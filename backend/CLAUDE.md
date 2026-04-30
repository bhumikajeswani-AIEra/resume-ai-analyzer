# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run the dev server
uvicorn main:app --reload

# Run with a specific port
uvicorn main:app --reload --port 8000

# Health check
curl http://localhost:8000/health
```

Requires `ANTHROPIC_API_KEY` set in environment (or `.env` file via `python-dotenv`).

## Architecture

Single FastAPI backend with three service layers:

```
POST /api/analyze
  → parser.py         # Extract text from PDF (PyMuPDF) or DOCX (python-docx)
  → claude_service.py # Call Claude claude-sonnet-4-6 via forced tool_use → structured JSON
  → ats_service.py    # Keyword match against FIELD_KEYWORDS dict → ATS score
  → AnalysisResponse  # Merged and returned
```

**Claude integration:** Uses forced tool calling (`tool_choice: {type: "tool", name: "resume_analysis"}`) — Claude never returns free text, always structured JSON matching `ANALYSIS_TOOL` schema. Model is hardcoded to `claude-sonnet-4-6`.

**ATS scoring:** Pure keyword matching in `ats_service.py` — no AI involved. Field is fuzzy-matched against `FIELD_KEYWORDS` keys. Score = `matched / total * 100`.

**Template recommendation:** Claude returns one of 5 enum values (`technical`, `creative`, `executive`, `academic`, `general`). The router maps this to a `TemplateInfo` object from the `TEMPLATES` dict in `schemas.py`.

## Key Constraints

- Max file size: 5MB (enforced in router)
- Min extracted text: 100 characters (enforced in router)
- Supported formats: `.pdf` and `.docx` only
- `years_experience` is optional — affects the Claude prompt context string only

## Adding a New Field to ATS

Add a new key + keyword list to `FIELD_KEYWORDS` in `ats_service.py`. The fuzzy matcher in `_match_field()` will pick it up automatically.
