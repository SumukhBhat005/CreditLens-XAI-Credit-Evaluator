"""
model/train.py
──────────────
Trains a LightGBM binary classifier for credit default prediction.
Handles class imbalance with scale_pos_weight, uses 5-fold CV,
and saves the trained model alongside evaluation metrics.
"""

import numpy as np
import json
import joblib
import lightgbm as lgb
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import (
    roc_auc_score, f1_score, precision_score, recall_score,
    confusion_matrix, classification_report
)

print("=" * 60)
print("  CreditLens — Model Training Pipeline")
print("=" * 60)

# ── Load processed data ─────────────────────────────────────────────
print("\n[1/4] Loading processed data...")
X_train = np.load("data/processed/X_train.npy")
X_test = np.load("data/processed/X_test.npy")
y_train = np.load("data/processed/y_train.npy")
y_test = np.load("data/processed/y_test.npy")

# Load feature metadata
with open("model/artifacts/feature_metadata.json") as f:
    metadata = json.load(f)

feature_names = metadata["feature_columns"]
n_pos = y_train.sum()
n_neg = len(y_train) - n_pos
scale_weight = n_neg / n_pos

print(f"  Train: {len(X_train):,} samples ({n_pos:.0f} defaults, {n_neg:.0f} non-defaults)")
print(f"  Test:  {len(X_test):,} samples")
print(f"  Scale pos weight: {scale_weight:.2f}")

# ── LightGBM hyperparameters ────────────────────────────────────────
print("\n[2/4] Configuring LightGBM...")

params = {
    "objective": "binary",
    "metric": "auc",
    "boosting_type": "gbdt",
    "learning_rate": 0.05,
    "num_leaves": 31,
    "max_depth": 6,
    "min_child_samples": 20,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "reg_alpha": 0.1,
    "reg_lambda": 0.1,
    "scale_pos_weight": scale_weight,
    "random_state": 42,
    "verbose": -1,
    "n_estimators": 500,
}

print(f"  Parameters: {json.dumps({k:v for k,v in params.items() if k not in ['verbose']}, indent=4)}")

# ── 5-Fold Cross-Validation ─────────────────────────────────────────
print("\n[3/4] Running 5-fold stratified cross-validation...")

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = []

for fold, (train_idx, val_idx) in enumerate(cv.split(X_train, y_train), 1):
    X_fold_train, X_fold_val = X_train[train_idx], X_train[val_idx]
    y_fold_train, y_fold_val = y_train[train_idx], y_train[val_idx]
    
    model = lgb.LGBMClassifier(**params)
    model.fit(
        X_fold_train, y_fold_train,
        eval_set=[(X_fold_val, y_fold_val)],
    )
    
    y_pred_proba = model.predict_proba(X_fold_val)[:, 1]
    auc = roc_auc_score(y_fold_val, y_pred_proba)
    cv_scores.append(auc)
    print(f"  Fold {fold}: AUC = {auc:.4f}")

mean_cv_auc = np.mean(cv_scores)
std_cv_auc = np.std(cv_scores)
print(f"\n  Mean CV AUC: {mean_cv_auc:.4f} ± {std_cv_auc:.4f}")

# ── Train final model on full training set ───────────────────────────
print("\n[4/4] Training final model on full training set...")

final_model = lgb.LGBMClassifier(**params)
final_model.fit(X_train, y_train)

# ── Evaluate on test set ─────────────────────────────────────────────
y_pred_proba = final_model.predict_proba(X_test)[:, 1]
y_pred = (y_pred_proba > 0.5).astype(int)

test_auc = roc_auc_score(y_test, y_pred_proba)
test_f1 = f1_score(y_test, y_pred)
test_precision = precision_score(y_test, y_pred)
test_recall = recall_score(y_test, y_pred)
cm = confusion_matrix(y_test, y_pred)

print(f"\n  ── Test Set Results ──────────────────────────────")
print(f"  AUC-ROC   : {test_auc:.4f}")
print(f"  F1-Score  : {test_f1:.4f}")
print(f"  Precision : {test_precision:.4f}")
print(f"  Recall    : {test_recall:.4f}")
print(f"\n  Confusion Matrix:")
print(f"    TN={cm[0][0]:>5}  FP={cm[0][1]:>5}")
print(f"    FN={cm[1][0]:>5}  TP={cm[1][1]:>5}")
print(f"\n{classification_report(y_test, y_pred, target_names=['No Default', 'Default'])}")

# ── Feature importance ───────────────────────────────────────────────
importances = final_model.feature_importances_
sorted_idx = np.argsort(importances)[::-1]

print("  ── Feature Importance (by split) ─────────────────")
for idx in sorted_idx:
    print(f"    {feature_names[idx]:35s}  {importances[idx]:>6}")

# ── Save model and metrics ───────────────────────────────────────────
print("\n  Saving model artifacts...")

joblib.dump(final_model, "model/artifacts/lgbm_model.pkl")

metrics = {
    "cv_auc_mean": round(mean_cv_auc, 4),
    "cv_auc_std": round(std_cv_auc, 4),
    "cv_scores": [round(s, 4) for s in cv_scores],
    "test_auc": round(test_auc, 4),
    "test_f1": round(test_f1, 4),
    "test_precision": round(test_precision, 4),
    "test_recall": round(test_recall, 4),
    "confusion_matrix": cm.tolist(),
    "feature_importance": {
        feature_names[i]: int(importances[i]) for i in sorted_idx
    },
    "hyperparameters": {k: v for k, v in params.items() if k != "verbose"},
    "n_train": len(X_train),
    "n_test": len(X_test),
}

with open("model/artifacts/metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

print(f"  ✓ Model saved to model/artifacts/lgbm_model.pkl")
print(f"  ✓ Metrics saved to model/artifacts/metrics.json")

print(f"\n{'=' * 60}")
print("  ✓ MODEL TRAINING COMPLETE")
print(f"  Test AUC: {test_auc:.4f} | F1: {test_f1:.4f}")
print(f"{'=' * 60}\n")
