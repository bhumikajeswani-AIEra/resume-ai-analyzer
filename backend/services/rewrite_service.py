import json
import os
import google.generativeai as genai
from fastapi import HTTPException

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

_model = genai.GenerativeModel(
    model_name="gemini-3-flash-preview",
    generation_config={"response_mime_type": "application/json"},
)


def apply_corrections(resume_text: str, corrections: list[dict]) -> str:
    if not corrections:
        return resume_text

    corrections_text = "\n".join(
        f"{i+1}. Section: {c['section']}\n   Issue: {c['issue']}\n   Fix: {c['suggestion']}"
        for i, c in enumerate(corrections)
    )

    prompt = f"""You are an expert resume editor.

Apply ONLY the following corrections to this resume. Return the COMPLETE resume text.

CRITICAL RULES:
- Preserve the EXACT section order and structure of the original resume
- Do NOT move, reorder, add, or remove any sections
- Do NOT change anything that is not explicitly listed in the corrections below
- Only make the minimum text edits needed to fix each listed issue

Corrections to apply:
{corrections_text}

---RESUME---
{resume_text}
---END RESUME---

Return a JSON object with a single key "rewritten_resume" containing the full corrected resume text."""

    try:
        response = _model.generate_content(prompt)
        obj, _ = json.JSONDecoder().raw_decode(response.text.strip())
        return obj["rewritten_resume"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply corrections: {str(e)}")
