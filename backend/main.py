"""
backend/main.py
───────────────
FastAPI application for CreditLens — Explainable AI Credit Risk Evaluator.
Loads the trained LightGBM model and preprocessing pipeline on startup,
serves prediction + SHAP + LLM explanation via a single endpoint.
"""

import sys
import os

# Add project root to path so we can import model modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import numpy as np
import pandas as pd
import joblib
import json
import shap

load_dotenv()

from backend.schemas import ApplicantInput, PredictionResponse, ShapFactor
from backend.llm_letter import generate_explanation_letter
from model.explain import get_shap_explanation, get_top_factors, format_shap_for_llm

# ── App setup ────────────────────────────────────────────────────────
app = FastAPI(
    title="CreditLens API",
    description="Explainable AI Credit Risk Evaluator with SHAP-based explanations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model artifacts on startup ──────────────────────────────────
print("[STARTUP] Loading CreditLens model artifacts...")

try:
    model = joblib.load("model/artifacts/lgbm_model.pkl")
    preprocessor = joblib.load("model/artifacts/preprocessor.pkl")
    with open("model/artifacts/feature_metadata.json") as f:
        feature_metadata = json.load(f)
    with open("model/artifacts/metrics.json") as f:
        model_metrics = json.load(f)
    
    FEATURE_COLS = feature_metadata["feature_columns"]
    print(f"[STARTUP] ✓ Model loaded ({len(FEATURE_COLS)} features)")
    print(f"[STARTUP] ✓ Test AUC: {model_metrics['test_auc']}")
except Exception as e:
    print(f"[STARTUP] ✗ Failed to load model: {e}")
    print("[STARTUP] Run 'python data/generate_dataset.py && python data/preprocess.py && python model/train.py' first")
    model = None
    preprocessor = None
    FEATURE_COLS = []


# ── Endpoints ────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_metrics": model_metrics if model else None,
    }


@app.get("/model-info")
async def model_info():
    """Returns model performance metrics and feature metadata."""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {
        "metrics": model_metrics,
        "features": feature_metadata,
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(applicant: ApplicantInput):
    """
    Evaluate a loan applicant and return:
    - Decision (APPROVED/DENIED)
    - Probability of default
    - SHAP feature contributions (ranked)
    - LLM-generated explanation letter
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Train the model first.")
    
    # Convert input to dict and then to DataFrame
    raw_input = applicant.model_dump()
    
    # Compute debt-to-income ratio
    monthly_payment_factor = 0.03
    raw_input["debt_to_income"] = round(
        (raw_input["loan_amount"] * monthly_payment_factor * 12) / raw_input["annual_income"], 3
    )
    
    # Create DataFrame with features in correct order
    input_df = pd.DataFrame([{col: raw_input[col] for col in FEATURE_COLS}])
    
    # Preprocess
    X_processed = preprocessor.transform(input_df)
    
    # Predict
    probability = float(model.predict_proba(X_processed)[0, 1])
    
    # Decision logic
    if probability > 0.5:
        decision = "DENIED"
    else:
        decision = "APPROVED"
    
    # Risk level
    if probability > 0.7:
        risk_level = "HIGH"
    elif probability > 0.3:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
    
    # SHAP explanations
    explanations = get_shap_explanation(model, X_processed, raw_input)
    top_factors = get_top_factors(explanations, n=7)
    shap_text = format_shap_for_llm(explanations, n=7)
    
    # Get SHAP base value
    explainer = shap.TreeExplainer(model)
    base_value = float(explainer.expected_value)
    if isinstance(base_value, (list, np.ndarray)):
        base_value = float(base_value[1]) if len(base_value) > 1 else float(base_value[0])
    
    # Generate explanation letter
    letter = generate_explanation_letter(
        decision=decision,
        probability=probability,
        risk_level=risk_level,
        top_factors=top_factors,
        shap_text=shap_text,
        applicant=raw_input,
    )
    
    # Build response
    shap_factors = [
        ShapFactor(
            feature=exp["feature"],
            description=exp["description"],
            value=exp["value"],
            shap_value=exp["shap_value"],
            direction=exp["direction"],
            magnitude=exp["magnitude"],
        )
        for exp in explanations
    ]
    
    return PredictionResponse(
        decision=decision,
        probability_of_default=round(probability, 4),
        risk_level=risk_level,
        shap_values=shap_factors,
        explanation_letter=letter,
        base_value=round(base_value, 4),
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
