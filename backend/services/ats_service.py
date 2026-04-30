FIELD_KEYWORDS: dict[str, list[str]] = {
    "Software Engineering": [
        "Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", "C++",
        "React", "Node.js", "FastAPI", "Django", "REST API", "GraphQL",
        "Docker", "Kubernetes", "CI/CD", "Git", "AWS", "GCP", "Azure",
        "SQL", "PostgreSQL", "MongoDB", "Redis", "microservices",
        "agile", "scrum", "unit testing", "code review", "system design",
    ],
    "Data Science": [
        "Python", "R", "SQL", "machine learning", "deep learning", "TensorFlow",
        "PyTorch", "scikit-learn", "pandas", "NumPy", "Spark", "Hadoop",
        "statistics", "A/B testing", "data visualization", "Tableau", "Power BI",
        "feature engineering", "NLP", "computer vision", "model deployment",
        "Jupyter", "MLflow", "data pipeline", "ETL",
    ],
    "Product Management": [
        "product roadmap", "stakeholder", "user research", "agile", "scrum",
        "KPI", "OKR", "A/B testing", "go-to-market", "prioritization",
        "JIRA", "Confluence", "wireframe", "MVP", "product strategy",
        "cross-functional", "user stories", "sprint", "backlog", "metrics",
        "customer discovery", "market research", "product lifecycle",
    ],
    "Marketing": [
        "SEO", "SEM", "Google Analytics", "content marketing", "social media",
        "email marketing", "HubSpot", "Salesforce", "CRM", "brand strategy",
        "campaign management", "conversion rate", "ROI", "lead generation",
        "copywriting", "digital marketing", "paid ads", "influencer marketing",
        "marketing automation", "A/B testing", "customer segmentation",
    ],
    "Finance": [
        "financial modeling", "Excel", "valuation", "DCF", "M&A",
        "financial analysis", "budgeting", "forecasting", "Bloomberg",
        "Python", "SQL", "risk management", "portfolio management",
        "CFA", "CPA", "GAAP", "IFRS", "investment banking", "private equity",
        "hedge fund", "equity research", "derivatives", "fixed income",
    ],
    "Design (UX/UI)": [
        "Figma", "Sketch", "Adobe XD", "user research", "wireframing",
        "prototyping", "usability testing", "design systems", "accessibility",
        "user flows", "information architecture", "interaction design",
        "visual design", "typography", "color theory", "responsive design",
        "Zeplin", "InVision", "design thinking", "A/B testing",
    ],
    "General": [
        "communication", "leadership", "teamwork", "problem-solving",
        "project management", "time management", "analytical", "detail-oriented",
        "Microsoft Office", "Excel", "PowerPoint", "collaboration",
        "adaptability", "critical thinking", "organization",
    ],
}


def compute_ats_score(resume_text: str, target_field: str) -> dict:
    field_key = _match_field(target_field)
    keywords = FIELD_KEYWORDS.get(field_key, FIELD_KEYWORDS["General"])
    lower_text = resume_text.lower()

    matched = [kw for kw in keywords if kw.lower() in lower_text]
    missing = [kw for kw in keywords if kw.lower() not in lower_text]
    score = round(len(matched) / len(keywords) * 100) if keywords else 0

    return {"score": score, "matched": matched, "missing": missing}


def _match_field(target_field: str) -> str:
    target_lower = target_field.lower()
    for key in FIELD_KEYWORDS:
        if key.lower() in target_lower or target_lower in key.lower():
            return key
    for key in FIELD_KEYWORDS:
        if any(word in target_lower for word in key.lower().split()):
            return key
    return "General"
