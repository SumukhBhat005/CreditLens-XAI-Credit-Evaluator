"""
data/preprocess.py
──────────────────
Preprocessing pipeline for CreditLens.
Loads raw dataset, handles outliers, builds a sklearn ColumnTransformer,
does stratified train/test split, and saves artifacts for inference.
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer

print("=" * 60)
print("  CreditLens — Preprocessing Pipeline")
print("=" * 60)

# ── Load raw data ───────────────────────────────────────────────────
print("\n[1/5] Loading raw dataset...")
df = pd.read_csv("data/raw/credit_risk_dataset.csv")
print(f"  ✓ Loaded {len(df):,} rows, {len(df.columns)} columns")

# ── Feature definitions ─────────────────────────────────────────────
FEATURE_COLS = [
    "credit_score",
    "annual_income",
    "employment_length",
    "loan_amount",
    "open_credit_lines",
    "delinquency_30_59",
    "delinquency_60_89",
    "delinquency_90_plus",
    "revolving_utilization",
    "real_estate_loans",
    "dependents",
    "age",
    "debt_to_income",
]

TARGET_COL = "default"

# Human-readable feature names (for SHAP explanations)
FEATURE_DESCRIPTIONS = {
    "credit_score":            "Credit Score",
    "annual_income":           "Annual Income",
    "employment_length":       "Employment Length (years)",
    "loan_amount":             "Loan Amount Requested",
    "open_credit_lines":       "Number of Open Credit Lines",
    "delinquency_30_59":       "30-59 Day Late Payments (last 2 years)",
    "delinquency_60_89":       "60-89 Day Late Payments (last 2 years)",
    "delinquency_90_plus":     "90+ Day Late Payments (last 2 years)",
    "revolving_utilization":   "Revolving Credit Utilization (%)",
    "real_estate_loans":       "Number of Real Estate Loans",
    "dependents":              "Number of Dependents",
    "age":                     "Applicant Age",
    "debt_to_income":          "Debt-to-Income Ratio",
}

# ── Outlier handling ────────────────────────────────────────────────
print("[2/5] Handling outliers...")
initial_count = len(df)

# Cap extreme values
df["revolving_utilization"] = df["revolving_utilization"].clip(0, 150)
df["debt_to_income"] = df["debt_to_income"].clip(0, 5)
df["annual_income"] = df["annual_income"].clip(10000, 500000)

print(f"  ✓ Outliers capped (no rows removed, {len(df):,} rows remain)")

# ── Check for missing values ────────────────────────────────────────
print("[3/5] Checking for missing values...")
missing = df[FEATURE_COLS].isnull().sum()
if missing.sum() > 0:
    print(f"  ⚠ Missing values found:")
    for col, count in missing[missing > 0].items():
        print(f"    {col}: {count} ({100*count/len(df):.1f}%)")
else:
    print(f"  ✓ No missing values found")

# ── Build preprocessing pipeline ───────────────────────────────────
print("[4/5] Building sklearn preprocessing pipeline...")

# All features are numeric — use a single pipeline
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_pipeline, FEATURE_COLS),
    ],
    remainder="drop"
)

# ── Stratified train/test split ─────────────────────────────────────
X = df[FEATURE_COLS]
y = df[TARGET_COL]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"  Train set: {len(X_train):,} rows ({y_train.mean():.1%} default rate)")
print(f"  Test set:  {len(X_test):,} rows ({y_test.mean():.1%} default rate)")

# Fit the preprocessor on training data only
preprocessor.fit(X_train)
print(f"  ✓ Preprocessor fitted on training data")

# Transform both sets
X_train_processed = preprocessor.transform(X_train)
X_test_processed = preprocessor.transform(X_test)

# ── Save artifacts ──────────────────────────────────────────────────
print("[5/5] Saving artifacts...")

os.makedirs("data/processed", exist_ok=True)
os.makedirs("model/artifacts", exist_ok=True)

# Save processed data
np.save("data/processed/X_train.npy", X_train_processed)
np.save("data/processed/X_test.npy", X_test_processed)
np.save("data/processed/y_train.npy", y_train.values)
np.save("data/processed/y_test.npy", y_test.values)

# Save preprocessor
joblib.dump(preprocessor, "model/artifacts/preprocessor.pkl")

# Save feature metadata
import json
metadata = {
    "feature_columns": FEATURE_COLS,
    "feature_descriptions": FEATURE_DESCRIPTIONS,
    "target_column": TARGET_COL,
    "train_size": len(X_train),
    "test_size": len(X_test),
    "default_rate_train": float(y_train.mean()),
    "default_rate_test": float(y_test.mean()),
}
with open("model/artifacts/feature_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)

print(f"  ✓ Saved X_train.npy, X_test.npy, y_train.npy, y_test.npy")
print(f"  ✓ Saved preprocessor.pkl")
print(f"  ✓ Saved feature_metadata.json")

print(f"\n{'=' * 60}")
print("  → Next step: python model/train.py")
print(f"{'=' * 60}\n")
