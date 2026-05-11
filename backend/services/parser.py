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
        from docx.oxml.ns import qn

        doc = Document(io.BytesIO(content))
        parts: list[str] = []

        def para_text(p_elem) -> str:
            return "".join(n.text for n in p_elem.iter(qn("w:t")) if n.text).strip()

        def table_lines(tbl_elem) -> list[str]:
            lines = []
            for tr in tbl_elem.findall(".//" + qn("w:tr")):
                cells = []
                for tc in tr.findall(".//" + qn("w:tc")):
                    cell_text = "\n".join(
                        para_text(p) for p in tc.findall(".//" + qn("w:p"))
                        if para_text(p)
                    )
                    if cell_text:
                        cells.append(cell_text)
                if cells:
                    lines.append("  ".join(cells))
            return lines

        # Walk body in document order — interleaves paragraphs and tables correctly
        for child in doc.element.body:
            local = child.tag.split("}")[-1] if "}" in child.tag else child.tag
            if local == "p":
                t = para_text(child)
                if t:
                    parts.append(t)
            elif local == "tbl":
                parts.extend(table_lines(child))

        # Text boxes (shapes drawn over the page — often used for name/header areas)
        for txbx in doc.element.iter(qn("w:txbxContent")):
            for p in txbx.iter(qn("w:p")):
                t = para_text(p)
                if t:
                    parts.append(t)

        return "\n".join(parts)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse DOCX: {str(e)}")
