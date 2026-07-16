"""
data/load_kaggle_data.py
────────────────────────
Loads and prepares the "Give Me Some Credit" Kaggle dataset for CreditLens.
Dataset source: https://www.kaggle.com/c/GiveMeSomeCredit/data

Instructions:
  1. Download 'cs-training.csv' from the Kaggle page above (free account required)
  2. Place it in  data/raw/cs-training.csv
  3. Run this script:  python data/load_kaggle_data.py
"""

import pandas as pd
import numpy as np
import os

print("=" * 60)
print("  CreditLens -- Kaggle Dataset Loader")
print("  Source: 'Give Me Some Credit' (150K real borrower records)")
print("=" * 60)

RAW_PATH = "data/raw/cs-training.csv"
OUTPUT_PATH = "data/raw/credit_risk_dataset.csv"

# ── Step 1: Load the Kaggle CSV ─────────────────────────────────────
print("\n[1/4] Loading Kaggle CSV...")

if not os.path.exists(RAW_PATH):
    print(f"\n  ERROR: '{RAW_PATH}' not found.")
    print(f"  Please download 'cs-training.csv' from:")
    print(f"    https://www.kaggle.com/c/GiveMeSomeCredit/data")
    print(f"  and place it at: {RAW_PATH}")
    exit(1)

df_raw = pd.read_csv(RAW_PATH)
# Drop the unnamed index column that Kaggle includes
if "Unnamed: 0" in df_raw.columns:
    df_raw = df_raw.drop(columns=["Unnamed: 0"])

print(f"  Loaded {len(df_raw):,} rows, {len(df_raw.columns)} columns")
print(f"  Columns: {list(df_raw.columns)}")

# ── Step 2: Rename columns to CreditLens standard names ─────────────
print("\n[2/4] Renaming columns to CreditLens schema...")

COLUMN_MAP = {
    "SeriousDlqin2yrs":                       "default",
    "RevolvingUtilizationOfUnsecuredLines":    "revolving_utilization",
    "age":                                     "age",
    "NumberOfTime30-59DaysPastDueNotWorse":    "delinquency_30_59",
    "DebtRatio":                               "debt_to_income",
    "MonthlyIncome":                           "monthly_income",
    "NumberOfOpenCreditLinesAndLoans":          "open_credit_lines",
    "NumberOfTimes90DaysLate":                 "delinquency_90_plus",
    "NumberRealEstateLoansOrLines":            "real_estate_loans",
    "NumberOfTime60-89DaysPastDueNotWorse":    "delinquency_60_89",
    "NumberOfDependents":                      "dependents",
}

df = df_raw.rename(columns=COLUMN_MAP)

# Derive annual_income from monthly_income
df["annual_income"] = df["monthly_income"] * 12

# Drop the intermediate monthly_income column
df = df.drop(columns=["monthly_income"])

print(f"  Renamed columns: {list(df.columns)}")

# ── Step 3: Handle missing values ───────────────────────────────────
print("\n[3/4] Handling missing values...")

missing_before = df.isnull().sum()
missing_cols = missing_before[missing_before > 0]
for col, cnt in missing_cols.items():
    print(f"  {col}: {cnt:,} missing ({100*cnt/len(df):.1f}%)")

# Impute annual_income with median (29,731 missing in original = ~20%)
df["annual_income"] = df["annual_income"].fillna(df["annual_income"].median())

# Impute dependents with 0 (3,924 missing = ~2.6%)
df["dependents"] = df["dependents"].fillna(0).astype(int)

# Convert revolving_utilization from ratio (0-1+) to percentage (0-100+)
# The Kaggle dataset stores this as a decimal (e.g. 0.35 = 35%)
df["revolving_utilization"] = (df["revolving_utilization"] * 100).round(1)

missing_after = df.isnull().sum().sum()
print(f"\n  Missing values after imputation: {missing_after}")

# ── Step 4: Basic quality checks and save ───────────────────────────
print("\n[4/4] Quality checks and saving...")

print(f"\n  Total records     : {len(df):,}")
print(f"  Default rate      : {df['default'].mean():.2%}")
print(f"  Defaults          : {df['default'].sum():,}")
print(f"  Non-defaults      : {(df['default'] == 0).sum():,}")

print(f"\n  Feature ranges:")
for col in df.columns:
    if col != "default":
        print(f"    {col:30s}  min={df[col].min():>12,.1f}  max={df[col].max():>12,.1f}  mean={df[col].mean():>12,.1f}")

# Save in the same format that preprocess.py expects
os.makedirs("data/raw", exist_ok=True)
df.to_csv(OUTPUT_PATH, index=False)
print(f"\n  Saved to {OUTPUT_PATH} ({len(df):,} rows, {len(df.columns)} columns)")

print(f"\n{'=' * 60}")
print("  Next step: python data/preprocess.py")
print(f"{'=' * 60}\n")
