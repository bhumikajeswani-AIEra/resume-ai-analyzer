import json
import os
from typing import Optional
import google.generativeai as genai
from fastapi import HTTPException

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel(
    model_name="gemini-3-flash-preview",
    generation_config={"response_mime_type": "application/json"},
)

JSON_SCHEMA = """
{
  "overall_score": <integer 0-100>,
  "strengths": [<string>, ...],
  "corrections": [
    {"section": <string>, "issue": <string>, "suggestion": <string>},
    ...
  ],
  "field_suggestions": [<string>, ...],
  "missing_keywords": [<string>, ...],
  "template_recommendation": <one of: "technical", "creative", "executive", "academic", "general">,
  "template_reason": <string>
}
"""


def analyze_resume(resume_text: str, target_field: str, years_experience: Optional[int] = None) -> dict:
    exp_context = f" The candidate has approximately {years_experience} years of experience." if years_experience else ""

    prompt = f"""You are an expert resume coach and recruiter with 15+ years of experience.

Analyze the following resume for a candidate applying to the **{target_field}** field.{exp_context}

Return a JSON object with EXACTLY this structure:
{JSON_SCHEMA}

Guidelines:
- overall_score: honest 0-100 quality score
- strengths: 3-5 things working well (reference actual resume content)
- corrections: ONLY include issues that directly hurt shortlist probability — factual errors, ATS-blocking problems, weak/vague bullets missing metrics, critical missing sections. DO NOT flag cosmetic or formatting preferences (e.g. punctuation style, unconventional phrasing, parenthetical structure, how dates are displayed) unless they would cause an ATS to reject or a recruiter to disqualify. Max 5 corrections, highest impact only.
- field_suggestions: 5-7 tailored tips to stand out for {target_field} roles
- missing_keywords: important skills/tools ATS systems look for in {target_field} that are absent
- template_recommendation: best template style for this candidate and field
- template_reason: one sentence explaining why

Be specific and actionable. Reference actual content from the resume.

---RESUME START---
{resume_text}
---RESUME END---"""

    try:
        response = model.generate_content(prompt)
        obj, _ = json.JSONDecoder().raw_decode(response.text.strip())
        return obj
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e)}")
