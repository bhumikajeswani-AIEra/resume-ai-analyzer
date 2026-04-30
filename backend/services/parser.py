import io
from fastapi import UploadFile, HTTPException


async def extract_text(file: UploadFile) -> str:
    content = await file.read()
    filename = file.filename or ""

    if filename.endswith(".pdf"):
        return _parse_pdf(content)
    elif filename.endswith(".docx"):
        return _parse_docx(content)
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF or DOCX file.",
        )


def _parse_pdf(content: bytes) -> str:
    try:
        import fitz  # PyMuPDF

        doc = fitz.open(stream=content, filetype="pdf")
        text = "\n".join(page.get_text() for page in doc)
        doc.close()
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {str(e)}")


def _parse_docx(content: bytes) -> str:
    try:
        from docx import Document

        doc = Document(io.BytesIO(content))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return "\n".join(paragraphs)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse DOCX: {str(e)}")
