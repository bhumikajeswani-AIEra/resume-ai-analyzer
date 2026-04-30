from pydantic import BaseModel


class Correction(BaseModel):
    section: str
    issue: str
    suggestion: str


class ATSResult(BaseModel):
    score: int
    matched: list[str]
    missing: list[str]


class TemplateInfo(BaseModel):
    name: str
    description: str
    reason: str


TEMPLATES: dict[str, TemplateInfo] = {
    "technical": TemplateInfo(
        name="Technical",
        description="Clean, skills-first layout with prominent tech stack section. Preferred by engineering recruiters and ATS systems.",
        reason="Best for software, data, and engineering roles — highlights technical depth upfront.",
    ),
    "creative": TemplateInfo(
        name="Creative",
        description="Visually distinctive with subtle design elements. Balances personality with professionalism.",
        reason="Ideal for design, marketing, and media roles where visual presentation matters.",
    ),
    "executive": TemplateInfo(
        name="Executive",
        description="Polished, achievement-focused layout with strong summary section and quantified impact.",
        reason="Best for senior, leadership, and finance roles — emphasizes results and authority.",
    ),
    "academic": TemplateInfo(
        name="Academic",
        description="Publications, research, and education-first structure. Traditional CV-style format.",
        reason="Perfect for research, academia, and PhD-track roles.",
    ),
    "general": TemplateInfo(
        name="General",
        description="Balanced, versatile layout that works across industries. Clean chronological format.",
        reason="Great for career changers or roles that value broad skills over specialization.",
    ),
}


class AnalysisResponse(BaseModel):
    overall_score: int
    strengths: list[str]
    corrections: list[Correction]
    field_suggestions: list[str]
    ats: ATSResult
    missing_keywords: list[str]
    template: TemplateInfo
