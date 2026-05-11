import io
import json
import os
import unicodedata
import google.generativeai as genai
from docx import Document
from fastapi import HTTPException

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

_model = genai.GenerativeModel(
    model_name="gemini-3-flash-preview",
    generation_config={"response_mime_type": "application/json"},
)

# Map typographic characters to ASCII equivalents for fuzzy matching
_NORMALIZE_MAP = str.maketrans({
    "‘": "'", "’": "'", "‚": "'",  # curly single quotes
    "“": '"', "”": '"', "„": '"',  # curly double quotes
    "–": "-", "—": "-",                  # en-dash, em-dash
    "…": "...",                               # ellipsis
    " ": " ",                                 # non-breaking space
})


def _norm(text: str) -> str:
    """Normalize unicode punctuation to ASCII for reliable matching."""
    return unicodedata.normalize("NFKC", text).translate(_NORMALIZE_MAP)


def _get_substitutions(resume_text: str, corrections: list[dict]) -> list[dict]:
    corrections_text = "\n".join(
        f"{i+1}. Issue: {c['issue']}\n   Fix: {c['suggestion']}"
        for i, c in enumerate(corrections)
    )

    prompt = f"""You are a resume editor. Given the corrections below and the EXACT resume text, produce the minimal text substitutions needed.

Corrections to apply:
{corrections_text}

---RESUME TEXT (copy characters EXACTLY as they appear)---
{resume_text}
---END---

Return a JSON array:
[{{"old_text": "exact substring from the resume above", "new_text": "replacement text"}}]

Critical rules:
- old_text MUST be a verbatim substring copied from the resume text above — do not paraphrase or normalize quotes/dashes
- new_text is the corrected version
- For "add a bullet/line" corrections: set old_text to the line BEFORE where it should be inserted, new_text to that same line + newline + new bullet
- For "remove" corrections: set new_text to empty string ""
- Return [] only if no concrete text change is possible"""

    try:
        response = _model.generate_content(prompt)
        obj, _ = json.JSONDecoder().raw_decode(response.text.strip())
        return obj if isinstance(obj, list) else []
    except Exception:
        return []


def _replace_in_runs(para, old: str, new: str) -> bool:
    """
    Try to replace `old` with `new` in a paragraph's runs.
    Uses three strategies in order: exact → normalized → normalized case-insensitive.
    Preserves per-run formatting where possible.
    """
    old_norm = _norm(old)

    # Strategy 1: exact match inside a single run
    for run in para.runs:
        if old in run.text:
            run.text = run.text.replace(old, new, 1)
            return True

    # Strategy 2: normalized match inside a single run
    for run in para.runs:
        run_norm = _norm(run.text)
        if old_norm in run_norm:
            idx = run_norm.find(old_norm)
            run.text = run.text[:idx] + new + run.text[idx + len(old):]
            return True

    # Strategy 3: text spans multiple runs — merge, replace, restore to first run
    full = "".join(r.text for r in para.runs)
    full_norm = _norm(full)

    target = old if old in full else (old_norm if old_norm in full_norm else None)
    if target is not None:
        search_in = full if old in full else full_norm
        base = full if old in full else full_norm
        idx = search_in.find(target)
        new_full = base[:idx] + new + base[idx + len(target):]
        if para.runs:
            para.runs[0].text = new_full
            for r in para.runs[1:]:
                r.text = ""
        return True

    return False


def _iter_paragraphs(doc):
    """Yield all paragraphs from body, tables, and text boxes."""
    yield from doc.paragraphs
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                yield from cell.paragraphs


def apply_corrections_to_docx(docx_bytes: bytes, corrections: list[dict], resume_text: str) -> bytes:
    if not corrections:
        return docx_bytes

    substitutions = _get_substitutions(resume_text, corrections)
    if not substitutions:
        return docx_bytes

    doc = Document(io.BytesIO(docx_bytes))

    for sub in substitutions:
        old = sub.get("old_text", "")
        new = sub.get("new_text", "")
        if not old:
            continue
        for para in _iter_paragraphs(doc):
            if _replace_in_runs(para, old, new):
                break  # each substitution should only apply once

    buf = io.BytesIO()
    doc.save(buf)
    buf.seek(0)
    return buf.read()
