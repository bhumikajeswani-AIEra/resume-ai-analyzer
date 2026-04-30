# ResumeAI — Smart Resume Optimizer

> Built by a PM who decided to stop waiting for engineers and just ship it herself. 🚀

---

## What is this?

**ResumeAI** is an AI-powered web app that helps job seekers get more shortlists by making their resume smarter — not prettier.

Upload your resume, tell it the role you're targeting, and get back:

- **ATS Score** — see how well your resume matches what automated hiring systems look for
- **Corrections** — specific fixes for weak bullet points, vague language, and missing metrics
- **Field-Specific Suggestions** — tailored advice based on your target role (SWE, PM, Finance, Design, etc.)
- **Template Recommendations** — the right resume format for your field and experience level

---

## Why I built this

I'm a Product Manager learning to build with AI — no CS degree, no prior coding background. Just curiosity, Claude, and a lot of "why isn't this working" moments.

This project is part of my journey into **vibe coding** — using AI tools to go from idea → shipped product without writing every line from scratch. The goal wasn't to become a developer. It was to prove that PMs can build, iterate, and ship real products when they stop waiting for resources.

If you're a PM reading this: you can build too. Start.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Backend | FastAPI (Python) |
| AI | Gemini 3 Flash (Google AI) |
| File Parsing | PyMuPDF (PDF) + python-docx (DOCX) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Features

- Drag-and-drop resume upload (PDF or DOCX)
- Target field selector (Software Engineering, Product Management, Marketing, Finance, Design, and more)
- Years of experience context for more accurate feedback
- ATS keyword match/miss breakdown
- Expandable correction cards with specific rewrites
- 5 template recommendations with rationale
- Clean tabbed results UI

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # add your GEMINI_API_KEY
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Open `http://localhost:3000`

---

## Project Structure

```
resume-optimizer/
├── backend/
│   ├── main.py                  # FastAPI app
│   ├── routers/resume.py        # POST /api/analyze
│   ├── services/
│   │   ├── parser.py            # PDF/DOCX extraction
│   │   ├── claude_service.py    # Gemini AI integration
│   │   └── ats_service.py       # ATS keyword scoring
│   └── models/schemas.py        # Pydantic types
└── frontend/
    ├── app/
    │   ├── page.tsx             # Landing page
    │   └── results/page.tsx     # Analysis results
    └── components/
        ├── UploadForm.tsx
        ├── ScoreGauge.tsx
        ├── CorrectionCard.tsx
        ├── ATSPanel.tsx
        └── TemplateGallery.tsx
```

---

## What's Next

- [ ] Job description matching (paste a JD, get role-specific gap analysis)
- [ ] Downloadable optimized resume PDF
- [ ] Side-by-side before/after view
- [ ] User accounts to save and track resume versions

---

## About Me

I'm Bhumika — a Product Manager in the PGP 2025 cohort at Masters Union, exploring the intersection of AI and product building.

This project was built as part of learning to **vibe code** — using AI as a co-pilot to ship real products fast. Every bug, every "failed to fetch", every model deprecation error was a lesson.

Connect with me on [LinkedIn](https://linkedin.com/in/bhumikajeswani) if you're a PM curious about building with AI.

---

*Built with Next.js + FastAPI + Gemini AI + a lot of patience.*
