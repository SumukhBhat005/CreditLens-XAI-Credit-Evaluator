"""
backend/schemas.py
──────────────────
Pydantic request/response models for CreditLens API.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ApplicantInput(BaseModel):
    """Input schema for a loan applicant."""
    credit_score: int = Field(..., ge=300, le=850, description="Credit score (300-850)")
    annual_income: int = Field(..., ge=10000, le=500000, description="Annual income in USD")
    employment_length: int = Field(..., ge=0, le=40, description="Years of employment")
    loan_amount: int = Field(..., ge=1000, le=100000, description="Loan amount requested in USD")
    open_credit_lines: int = Field(..., ge=0, le=30, description="Number of open credit lines")
    delinquency_30_59: int = Field(0, ge=0, le=10, description="30-59 day late payments in last 2 years")
    delinquency_60_89: int = Field(0, ge=0, le=10, description="60-89 day late payments in last 2 years")
    delinquency_90_plus: int = Field(0, ge=0, le=10, description="90+ day late payments in last 2 years")
    revolving_utilization: float = Field(..., ge=0, le=200, description="Revolving credit utilization (%)")
    real_estate_loans: int = Field(0, ge=0, le=10, description="Number of real estate loans")
    dependents: int = Field(0, ge=0, le=10, description="Number of dependents")
    age: int = Field(..., ge=21, le=75, description="Applicant age")

    class Config:
        json_schema_extra = {
            "example": {
                "credit_score": 720,
                "annual_income": 75000,
                "employment_length": 8,
                "loan_amount": 25000,
                "open_credit_lines": 5,
                "delinquency_30_59": 0,
                "delinquency_60_89": 0,
                "delinquency_90_plus": 0,
                "revolving_utilization": 35.0,
                "real_estate_loans": 1,
                "dependents": 2,
                "age": 38,
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
