<div align="center">

# 🛡️ CreditLens

### Explainable AI (XAI) Credit Risk Evaluator

[![FastAPI](https://img.shields.io/badge/FastAPI-REST_API-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LightGBM](https://img.shields.io/badge/LightGBM-ML_Model-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/microsoft/LightGBM)
[![SHAP](https://img.shields.io/badge/SHAP-Explainability-FF6F00?style=for-the-badge&logo=google-lens&logoColor=white)](https://github.com/shap/shap)
[![Groq](https://img.shields.io/badge/Groq_API-Llama_3.3_70B-FF5722?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

---

*A compliance-first, transparent loan underwriting platform that replaces opaque ML models with mathematical explainability (SHAP TreeExplainer) and automatically generates regulatory-compliant Adverse Action notices or approval letters using an LLM. Fully aligns with fair lending regulation disclosure requirements.*

[Key Features »](#-key-features) · [System Architecture »](#-system-architecture) · [Getting Started »](#-getting-started) · [Model Quality & Metrics »](#-model-quality--metrics)

</div>

---

## 💡 The Problem (Regulatory Compliance in AI Lending)

Traditional lending algorithms are **black boxes**. A predictive neural network or deep ensemble might accurately forecast defaults, but under fair lending regulations (e.g. the US Equal Credit Opportunity Act & Regulation B), **lenders are legally prohibited from denying credit without explaining the specific, principal reasons why.**

CreditLens solves this gap by wrapping a high-performance **LightGBM binary classifier** inside a local explanation framework (**SHAP**), then feeding those exact mathematical attributions to **Llama 3.3** to construct a clear, compliant notice:

| Traditional Credit Risk AI | CreditLens (XAI) |
|:---|:---|
| ❌ "Application Denied: Risk score 0.78." | ✅ "Application Denied: Default risk is 78.0%." |
| ❌ No explanation (illegal under Reg B). | ✅ Ranked list of principal drivers (e.g. utilization at 94.2%). |
| ❌ Hallucinated reasons by general LLMs. | ✅ Grounded adverse action letter based strictly on SHAP math. |
| ❌ Lack of transparency for compliance officers. | ✅ Audit trail showing confusion matrices and metric validations. |

---

## ✨ Key Features

- **High-Performance Credit Classifier** — LightGBM model trained on a 10,000-applicant synthetic credit risk dataset, optimizing for class imbalance and AUC-ROC.
- **Local SHAP Attributions** — Computes exact, per-feature contributions using a `TreeExplainer`, mapping model outputs directly to specific applicant data.
- **Dual-Mode LLM Letter Generator** — Generates formal adverse action notices or approval letters using Llama 3.3 via Groq API. Automatically falls back to high-fidelity template logic if no API token is present.
- **Interactive Risk Dashboard** — Renders decision metrics, risk probability gauges, local SHAP waterfall charts (built client-side in Recharts), and styled letters.
- **Demo Presets** — Quick-load buttons representing Tier-A (Low Risk), Borderline, and High Risk profiles for instant evaluation.
- **Model Validation Panel** — Displays live performance metrics (AUC, F1, Precision, Recall), confusion matrices, and global feature importance.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          React Client (Vite)                           │
│                                                                        │
│  ┌───────────────────────┐   ┌───────────────────┐   ┌──────────────┐  │
│  │     ApplicantForm     │──▶│   DecisionBanner  │──▶│   ShapChart  │  │
│  │ (Metric Presets/Form) │   │ (Risk Gauge/HTML) │   │ (Waterfall)  │  │
│  └───────────────────────┘   └───────────────────┘   └──────────────┘  │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │
                         REST API   │   POST /predict (JSON)
                      CORS Allowed  │   Response: Decision, SHAP, Letter
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend Server                          │
│                                                                        │
│   ┌───────────────────────────┐           ┌─────────────────────────┐  │
│   │     /predict Endpoint     │──────────▶│  Preprocessing Pipeline │  │
│   │  (pydantic validation)    │           │     (StandardScaler)    │  │
│   └─────────────┬─────────────┘           └────────────┬────────────┘  │
│                 │                                      │               │
│                 ▼                                      ▼               │
│   ┌───────────────────────────┐           ┌─────────────────────────┐  │
│   │    LLM Letter Generator   │◀──ground──│      SHAP Explainer     │  │
│   │    (Groq/Llama 3.3 70B)   │           │    (shap.TreeExplainer) │  │
│   └───────────────────────────┘           └────────────┬────────────┘  │
│                                                        │               │
│                                                        ▼               │
│                                           ┌─────────────────────────┐  │
│                                           │     LightGBM Classifier │  │
│                                           │   (lgbm_model.pkl)      │  │
│                                           └─────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Model Quality & Metrics

The LightGBM model is validated using a stratified 80/20 train/test split. Cross-validation averages show robust predictive capacity:

| Evaluation Metric | Score | Detail |
|:---|:---:|:---|
| **Mean CV AUC-ROC** | **98.24%** | Measured over 5 Stratified K-Folds (± 0.36%) |
| **Test Set AUC-ROC** | **97.66%** | High separation capacity between default/non-default |
| **Precision** | **67.70%** | Minimizes false positives (unnecessary credit denial) |
| **Recall** | **77.86%** | Catches the vast majority of actual defaults |
| **F1-Score** | **0.7243** | Balanced performance on imbalanced target class |

### Confusion Matrix (Test Set)
- **True Negatives (TN):** `1808` (Correctly approved low-risk applicants)
- **False Positives (FP):** `52` (Rejected low-risk applicants)
- **False Negatives (FN):** `31` (Approved high-risk default applicants)
- **True Positives (TP):** `109` (Correctly rejected high-risk default applicants)

---

## 🛠️ Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Setup & Run the Backend
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (optional: add GROQ_API_KEY)
cp .env.example .env

# Run FastAPI server
python main.py
```
FastAPI will start at `http://127.0.0.1:8000`. You can explore the interactive docs at `/docs`.

### 2. Setup & Run the Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The React frontend will be accessible at the address printed in the terminal (usually `http://localhost:5173`).

---

## 📂 Project Structure

```
CreditLens/
├── backend/
│   ├── main.py              # FastAPI application server
│   ├── predict.py           # Preprocessing & model inference
│   ├── llm_letter.py        # Groq/Llama letter generator + fallback templates
│   └── schemas.py           # Pydantic validation schemas
│
├── model/
│   ├── train.py             # LightGBM classifier training
│   ├── explain.py           # SHAP TreeExplainer computations
│   └── artifacts/           # Saved pickles, schemas, and metrics.json
│
├── data/
│   ├── generate_dataset.py  # Synthetic data generation engine
│   └── preprocess.py        # Outlier handling & fit scaling pipeline
│
└── frontend/
    ├── src/
    │   ├── components/      # React components (Form, Banner, Recharts SHAP, Letter)
    │   ├── App.jsx          # App container & API interface
    │   ├── index.css        # Tailwind style entrypoint
    │   └── main.jsx         # React DOM mount point
    ├── vite.config.js       # Vite configuration with Tailwind CSS v4
    └── package.json
```

---

## ⚖️ Fair Lending & Security Controls

- **No Prohibited Proxies** — Feature generation excludes attributes like gender, race, religion, marital status, or zip codes to prevent indirect algorithmic bias.
- **Traceability** — Every model decision saves its SHAP values, providing a direct mathematical explanation that can be audited by standard compliance officers.
- **LLM Grounding** — The letter generator is restricted via system prompts to ensure it only references features identified by the SHAP explainability layer, eliminating hallucinations.

---

### Built with ❤️ by [Sumukh Bhat](https://github.com/SumukhBhat005)
*Demonstrating Explainable AI (XAI), Machine Learning pipelines, RESTful backend design, and high-fidelity data visualization.*
