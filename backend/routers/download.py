import io
import base64
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from services.rewrite_service import apply_corrections
from services.docx_editor import apply_corrections_to_docx
from services.docx_generator import generate_docx

router = APIRouter()

DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


class DownloadRequest(BaseModel):
    resume_text: str
    corrections: list[dict] = []
    template: str = "general"
    file_base64: str = ""
    file_type: str = "pdf"


@router.post("/download")
def download_resume(req: DownloadRequest):
    has_corrections = bool(req.corrections)
    has_original_docx = bool(req.file_base64) and req.file_type == "docx"

    if has_corrections and has_original_docx:
        # Edit original DOCX in-place — preserves all formatting
        original_bytes = base64.b64decode(req.file_base64)
        content = apply_corrections_to_docx(original_bytes, req.corrections, req.resume_text)
        filename = "resume_corrected.docx"
    else:
        # Template styling — generate clean DOCX from text
        text = apply_corrections(req.resume_text, req.corrections)
        content = generate_docx(text, req.template)
        filename = f"resume_{req.template}.docx"

    return StreamingResponse(
        io.BytesIO(content),
        media_type=DOCX_MEDIA,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
