"""
backend/schemas.py
──────────────────
Pydantic request/response models for CreditLens API.
Features aligned to Kaggle 'Give Me Some Credit' dataset.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ApplicantInput(BaseModel):
    """Input schema for a loan applicant — matches Kaggle dataset features."""
    revolving_utilization: float = Field(..., ge=0, le=200, description="Total balance on credit cards / sum of credit limits (%)")
    age: int = Field(..., ge=21, le=109, description="Age of borrower in years")
    delinquency_30_59: int = Field(0, ge=0, le=15, description="30-59 day late payments in last 2 years")
    debt_to_income: float = Field(..., ge=0, le=5, description="Monthly debt payments / gross monthly income")
    annual_income: int = Field(..., ge=0, le=1000000, description="Annual income in USD")
    open_credit_lines: int = Field(..., ge=0, le=60, description="Number of open loans and credit lines")
    delinquency_90_plus: int = Field(0, ge=0, le=15, description="90+ day serious delinquencies in last 2 years")
    real_estate_loans: int = Field(0, ge=0, le=20, description="Number of mortgage and real estate loans")
    delinquency_60_89: int = Field(0, ge=0, le=15, description="60-89 day late payments in last 2 years")
    dependents: int = Field(0, ge=0, le=15, description="Number of dependents in family")

    class Config:
        json_schema_extra = {
            "example": {
                "revolving_utilization": 35.0,
                "age": 38,
                "delinquency_30_59": 0,
                "debt_to_income": 0.35,
                "annual_income": 75000,
                "open_credit_lines": 8,
                "delinquency_90_plus": 0,
                "real_estate_loans": 1,
                "delinquency_60_89": 0,
                "dependents": 2,
            }
        }


class ShapFactor(BaseModel):
    """A single SHAP feature contribution."""
    feature: str
    description: str
    value: Optional[float] = None
    shap_value: float
    direction: str
    magnitude: str


class PredictionResponse(BaseModel):
    """Full prediction response with explainability."""
    decision: str = Field(..., description="APPROVED or DENIED")
    probability_of_default: float = Field(..., description="Probability of default (0-1)")
    risk_level: str = Field(..., description="LOW, MEDIUM, or HIGH")
    shap_values: list[ShapFactor] = Field(..., description="Ranked SHAP feature contributions")
    explanation_letter: str = Field(..., description="LLM-generated explanation letter")
    base_value: float = Field(..., description="SHAP base value (average model output)")
