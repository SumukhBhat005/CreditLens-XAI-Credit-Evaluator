"""
data/generate_dataset.py
─────────────────────────
Generates a realistic synthetic credit risk dataset for CreditLens.
Produces ~10,000 applicants with 12 features and a binary default target.
Class imbalance mirrors real-world credit data (~7-8% default rate).
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)

N = 10_000  # Number of synthetic applicants

print("=" * 60)
print("  CreditLens — Synthetic Dataset Generator")
print("=" * 60)

# ── Generate base features ──────────────────────────────────────────
print("\n[1/4] Generating applicant features...")

data = {
    # Credit score: 300-850, normally distributed around 680
    "credit_score": np.clip(np.random.normal(680, 80, N), 300, 850).astype(int),
    
    # Annual income: log-normal distribution (realistic income skew)
    "annual_income": np.clip(np.random.lognormal(10.8, 0.7, N), 15000, 500000).astype(int),
    
    # Employment length in years: 0-40
    "employment_length": np.clip(np.random.exponential(6, N), 0, 40).astype(int),
    
    # Loan amount requested: 1,000 - 100,000
    "loan_amount": np.clip(np.random.lognormal(9.5, 0.8, N), 1000, 100000).astype(int),
    
    # Number of open credit lines: 0-30
    "open_credit_lines": np.clip(np.random.poisson(5, N), 0, 30).astype(int),
    
    # Number of times 30-59 days past due in last 2 years
    "delinquency_30_59": np.random.choice([0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3], N),
    
    # Number of times 60-89 days past due in last 2 years
    "delinquency_60_89": np.random.choice([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2], N),
    
    # Number of times 90+ days past due in last 2 years
    "delinquency_90_plus": np.random.choice([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1], N),
    
    # Revolving utilization of unsecured lines (%)
    "revolving_utilization": np.clip(np.random.beta(2, 5, N) * 150, 0, 200).round(1),
    
    # Number of real estate loans or lines
    "real_estate_loans": np.random.choice([0, 0, 0, 1, 1, 1, 2, 2, 3], N),
    
    # Number of dependents: 0-5
    "dependents": np.random.choice([0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4], N),
    
    # Applicant age: 21-75
    "age": np.clip(np.random.normal(45, 12, N), 21, 75).astype(int),
}

df = pd.DataFrame(data)

# ── Derive debt-to-income ratio ─────────────────────────────────────
# DTI = (loan_amount * 12-month payment factor) / annual_income
monthly_payment_factor = 0.03  # rough estimate
df["debt_to_income"] = (
    (df["loan_amount"] * monthly_payment_factor * 12) / df["annual_income"]
).round(3)

# ── Generate realistic default labels ───────────────────────────────
print("[2/4] Generating default labels based on risk factors...")

# Risk score: higher = more likely to default
risk_score = (
    -0.008 * df["credit_score"]           # lower score → more risk
    + 0.3 * df["delinquency_30_59"]       # past due → more risk
    + 0.6 * df["delinquency_60_89"]       # serious delinquency → much more risk
    + 1.2 * df["delinquency_90_plus"]     # very serious → highest risk
    + 0.8 * (df["revolving_utilization"] / 100)  # high utilization → risk
    + 0.5 * df["debt_to_income"]          # high DTI → risk
    - 0.02 * df["employment_length"]      # longer employment → less risk
    - 0.005 * df["annual_income"] / 10000 # higher income → less risk
    + np.random.normal(0, 0.3, N)         # noise
)

# Convert to probability via sigmoid
default_prob = 1 / (1 + np.exp(-risk_score))

# Sample defaults with ~7% overall default rate
threshold = np.percentile(default_prob, 93)
df["default"] = (default_prob > threshold).astype(int)

# ── Summary statistics ──────────────────────────────────────────────
print("[3/4] Computing summary statistics...")
print(f"\n  Total applicants  : {len(df):,}")
print(f"  Default rate      : {df['default'].mean():.1%}")
print(f"  Defaults          : {df['default'].sum():,}")
print(f"  Non-defaults      : {(1 - df['default']).sum():,.0f}")

print(f"\n  Feature ranges:")
for col in df.columns:
    if col != "default":
        print(f"    {col:30s}  min={df[col].min():>10,.1f}  max={df[col].max():>10,.1f}  mean={df[col].mean():>10,.1f}")

# ── Save dataset ────────────────────────────────────────────────────
print("\n[4/4] Saving dataset...")

os.makedirs("data/raw", exist_ok=True)
os.makedirs("data/processed", exist_ok=True)

df.to_csv("data/raw/credit_risk_dataset.csv", index=False)
print(f"  ✓ Saved to data/raw/credit_risk_dataset.csv ({len(df):,} rows, {len(df.columns)} columns)")

print(f"\n{'=' * 60}")
print("  → Next step: python data/preprocess.py")
print(f"{'=' * 60}\n")
