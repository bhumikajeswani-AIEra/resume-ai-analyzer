from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from models.schemas import AnalysisResponse, Correction, ATSResult, TEMPLATES
from services.parser import extract_text
from services.claude_service import analyze_resume
from services.ats_service import compute_ats_score

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    file: UploadFile = File(...),
    target_field: str = Form(...),
    years_experience: Optional[int] = Form(default=None),
):
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")

    resume_text = await extract_text(file)

    if len(resume_text.strip()) < 100:
        raise HTTPException(status_code=422, detail="Could not extract sufficient text from the file.")

    claude_result = analyze_resume(resume_text, target_field, years_experience)
    ats_result = compute_ats_score(resume_text, target_field)

    template_key = claude_result.get("template_recommendation", "general")
    template_info = TEMPLATES.get(template_key, TEMPLATES["general"])

    return AnalysisResponse(
        overall_score=claude_result["overall_score"],
        strengths=claude_result["strengths"],
        corrections=[Correction(**c) for c in claude_result["corrections"]],
        field_suggestions=claude_result["field_suggestions"],
        ats=ATSResult(**ats_result),
        missing_keywords=claude_result["missing_keywords"],
        template=template_info,
        resume_text=resume_text,
    )
