"""
backend/llm_letter.py
─────────────────────
LLM-powered explanation letter generator for CreditLens.
Uses Groq/Llama 3.3 to generate regulatory-compliant adverse action notices
or approval letters, grounded strictly in SHAP feature contributions.

Falls back to a template-based letter if no Groq API key is configured.
"""

import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


def _generate_template_letter(
    decision: str,
    probability: float,
    risk_level: str,
    top_factors: list[dict],
    applicant: dict,
) -> str:
    """
    Template-based fallback letter when no LLM API key is available.
    Still provides a professional, regulation-style explanation.
    """
    date_str = "July 15, 2026"
    
    if decision == "DENIED":
        header = "NOTICE OF ADVERSE ACTION"
        intro = (
            f"After careful evaluation of your application, we regret to inform you that "
            f"your request for credit has been **denied**. "
            f"Our automated risk assessment system evaluated your application and determined a "
            f"default probability of **{probability:.1%}** (Risk Level: **{risk_level}**)."
        )
        action_header = "## Principal Reasons for This Decision"
    else:
        header = "NOTICE OF CREDIT APPROVAL"
        intro = (
            f"We are pleased to inform you that your request for credit has been **approved**. "
            f"Our risk assessment determined a default probability of **{probability:.1%}** "
            f"(Risk Level: **{risk_level}**), which falls within our acceptable lending parameters."
        )
        action_header = "## Key Factors in This Decision"
    
    # Format factors
    risk_factors = []
    positive_factors = []
    
    for f in top_factors:
        desc = f["description"]
        val = f["value"]
        direction = f["direction"]
        magnitude = f["magnitude"]
        
        # Format the value nicely
        if isinstance(val, float):
            if "utilization" in desc.lower() or "ratio" in desc.lower():
                val_str = f"{val:.1f}%"
            else:
                val_str = f"{val:,.2f}"
        elif isinstance(val, int):
            if "income" in desc.lower() or "amount" in desc.lower():
                val_str = f"${val:,}"
            else:
                val_str = f"{val:,}"
        else:
            val_str = str(val)
        
        line = f"- **{desc}**: Your value of {val_str} {direction} ({magnitude} impact)"
        
        if direction == "increases risk":
            risk_factors.append(line)
        else:
            positive_factors.append(line)
    
    factors_text = ""
    if risk_factors:
        factors_text += "### Risk-Increasing Factors\n" + "\n".join(risk_factors) + "\n\n"
    if positive_factors:
        factors_text += "### Risk-Decreasing Factors\n" + "\n".join(positive_factors) + "\n\n"
    
    # Build improvement suggestions for denied applications
    improvement = ""
    if decision == "DENIED":
        improvement = """## Steps to Improve Your Application

Based on the factors identified above, the following actions may improve your creditworthiness:

1. **Reduce outstanding debt** — Lowering your revolving credit utilization below 30% significantly reduces risk.
2. **Maintain payment history** — Ensuring all future payments are made on time will improve your delinquency record.
3. **Increase credit score** — Consistent on-time payments and reducing credit utilization typically raise credit scores over 6-12 months.
4. **Reduce debt-to-income ratio** — Paying down existing debts or increasing income improves this metric.

You may reapply after 90 days with updated financial information.
"""
    
    letter = f"""# {header}

**Date:** {date_str}

---

{intro}

{action_header}

{factors_text}

{improvement}

---

*This decision was made using an AI-assisted risk evaluation model. All factors cited above are derived directly from your application data using SHAP (SHapley Additive exPlanations) analysis. No factors outside of the provided data were considered.*

*If you believe this decision was made in error, you have the right to request a manual review within 60 days of this notice.*
"""
    return letter.strip()


def _generate_llm_letter(
    decision: str,
    probability: float,
    risk_level: str,
    shap_text: str,
    applicant: dict,
) -> str:
    """
    Uses Groq/Llama 3.3 70B to generate a regulatory-compliant explanation letter.
    """
    try:
        from groq import Groq
    except ImportError:
        return _generate_template_letter(decision, probability, risk_level, [], applicant)
    
    client = Groq(api_key=GROQ_API_KEY)
    
    system_prompt = """You are a senior credit risk compliance officer at an Indian financial institution. 
You write adverse action notices and approval letters that comply with RBI Fair Practices Code and federal credit regulations.

STRICT RULES:
1. ONLY cite reasons that appear in the SHAP analysis provided — never invent additional factors.
2. Use professional, regulatory language suitable for an official bank notice.
3. Be specific: cite the applicant's actual values and explain why they contribute to risk.
4. For denials: include specific, actionable steps the applicant can take to improve.
5. For approvals: highlight the key strengths while noting any areas of caution.
6. Never use discriminatory language or reference protected characteristics.
7. Keep the letter concise but thorough — approximately 300-400 words."""

    user_prompt = f"""Generate an official {decision} letter for a credit application.

DECISION: {decision}
PROBABILITY OF DEFAULT: {probability:.1%}
RISK LEVEL: {risk_level}

SHAP ANALYSIS (ranked by impact — these are the ONLY factors you may cite):
{shap_text}

Write the letter in Markdown format with clear headers. Include:
1. The decision and probability
2. Top reasons (citing ONLY the SHAP factors above with actual values)
3. {"Specific improvement recommendations" if decision == "DENIED" else "Key strengths and any cautions"}
4. Right to appeal / reapplication information

Remember: ONLY use factors from the SHAP analysis above. Do not invent any additional reasons."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
        max_tokens=800,
    )
    
    return response.choices[0].message.content


def generate_explanation_letter(
    decision: str,
    probability: float,
    risk_level: str,
    top_factors: list[dict],
    shap_text: str,
    applicant: dict,
) -> str:
    """
    Main entry point. Uses LLM if Groq key is available, otherwise falls back
    to the template-based letter generator.
    """
    if GROQ_API_KEY:
        try:
            return _generate_llm_letter(decision, probability, risk_level, shap_text, applicant)
        except Exception as e:
            print(f"[LLM] Groq API error, falling back to template: {e}")
    
    return _generate_template_letter(decision, probability, risk_level, top_factors, applicant)
