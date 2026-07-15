"""
model/explain.py
────────────────
SHAP-based explainability module for CreditLens.
Provides per-applicant local explanations using TreeExplainer.
Returns ranked feature contributions with human-readable descriptions.
"""

import shap
import numpy as np
import json
import joblib


# ── Load feature metadata ───────────────────────────────────────────
with open("model/artifacts/feature_metadata.json") as f:
    _metadata = json.load(f)

FEATURE_COLS = _metadata["feature_columns"]
FEATURE_DESCRIPTIONS = _metadata["feature_descriptions"]


def get_shap_explanation(model, preprocessed_input: np.ndarray, raw_input: dict) -> list[dict]:
    """
    Compute per-feature SHAP values for a single applicant.
    
    Args:
        model: Trained LightGBM model
        preprocessed_input: Scaled feature array (1, n_features)
        raw_input: Original unscaled input dict (for display values)
    
    Returns:
        List of dicts sorted by |SHAP value|, each containing:
        - feature: raw column name
        - description: human-readable name
        - value: the applicant's actual value for this feature
        - shap_value: SHAP contribution (positive = increases default risk)
        - direction: "increases risk" or "decreases risk"
        - magnitude: "high" / "moderate" / "low"
    """
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(preprocessed_input)
    
    # For binary classification, shap_values may be a list [class_0, class_1]
    # We want class 1 (default) contributions
    if isinstance(shap_values, list):
        sv = shap_values[1][0]  # First (only) sample, class 1
    else:
        sv = shap_values[0]  # Single array
    
    # Build explanation list
    explanations = []
    for i, col in enumerate(FEATURE_COLS):
        shap_val = float(sv[i])
        abs_shap = abs(shap_val)
        
        # Determine magnitude
        if abs_shap > 0.5:
            magnitude = "high"
        elif abs_shap > 0.15:
            magnitude = "moderate"
        else:
            magnitude = "low"
        
        explanations.append({
            "feature": col,
            "description": FEATURE_DESCRIPTIONS.get(col, col),
            "value": raw_input.get(col, None),
            "shap_value": round(shap_val, 4),
            "direction": "increases risk" if shap_val > 0 else "decreases risk",
            "magnitude": magnitude,
        })
    
    # Sort by absolute SHAP value (most impactful first)
    explanations.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
    
    return explanations


def get_top_factors(explanations: list[dict], n: int = 7) -> list[dict]:
    """Return top N most impactful factors."""
    return explanations[:n]


def format_shap_for_llm(explanations: list[dict], n: int = 7) -> str:
    """
    Format top SHAP factors as a structured text block for the LLM prompt.
    """
    top = get_top_factors(explanations, n)
    lines = []
    for i, exp in enumerate(top, 1):
        direction_symbol = "↑" if exp["direction"] == "increases risk" else "↓"
        lines.append(
            f"  {i}. {exp['description']}: {exp['value']} "
            f"({direction_symbol} {exp['direction']}, "
            f"impact: {exp['magnitude']}, "
            f"SHAP: {exp['shap_value']:+.4f})"
        )
    return "\n".join(lines)
