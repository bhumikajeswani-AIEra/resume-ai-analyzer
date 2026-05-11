import io
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT

SECTION_HEADERS = {
    "experience", "work experience", "professional experience", "employment",
    "education", "academic background",
    "skills", "technical skills", "core skills", "key skills",
    "certifications", "certificates", "licenses",
    "projects", "key projects", "personal projects",
    "summary", "professional summary", "objective", "profile", "about",
    "achievements", "accomplishments", "awards",
    "publications", "research", "interests", "languages", "references",
    "internships", "volunteer", "extracurricular",
}

TEMPLATE_COLORS = {
    "technical": HexColor("#1e40af"),
    "executive": HexColor("#1f2d3d"),
    "creative":  HexColor("#0369a1"),
    "academic":  HexColor("#333333"),
    "general":   HexColor("#222222"),
}


def _is_section_header(line: str) -> bool:
    stripped = line.strip().rstrip(":").lower()
    if stripped in SECTION_HEADERS:
        return True
    if line.strip().isupper() and 2 < len(line.strip()) < 50:
        return True
    return False


def _is_contact_line(line: str) -> bool:
    l = line.lower()
    return bool(
        "@" in l or
        re.search(r"\+?\d[\d\s\-]{7,}", line) or
        "linkedin" in l or "github" in l or
        l.strip().startswith(("http", "www"))
    )


def generate_pdf(resume_text: str, template_name: str) -> bytes:
    color = TEMPLATE_COLORS.get(template_name, TEMPLATE_COLORS["general"])
    buf = io.BytesIO()

    doc = SimpleDocTemplate(
        buf,
        pagesize=letter,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )

    name_style = ParagraphStyle("name", fontSize=16, textColor=color, alignment=TA_CENTER,
                                 fontName="Helvetica-Bold", spaceAfter=4)
    contact_style = ParagraphStyle("contact", fontSize=9, textColor=HexColor("#555555"),
                                    alignment=TA_CENTER, spaceAfter=2)
    header_style = ParagraphStyle("header", fontSize=10, textColor=color, fontName="Helvetica-Bold",
                                   spaceBefore=12, spaceAfter=2, textTransform="uppercase")
    bullet_style = ParagraphStyle("bullet", fontSize=10, leftIndent=12, spaceAfter=2,
                                   bulletIndent=2, bulletFontName="Helvetica")
    text_style = ParagraphStyle("text", fontSize=10, spaceAfter=3)

    story = []
    lines = resume_text.split("\n")
    first_nonempty = True

    for line in lines:
        stripped = line.strip()

        if not stripped:
            story.append(Spacer(1, 3))
            continue

        if first_nonempty:
            first_nonempty = False
            story.append(Paragraph(stripped, name_style))
            continue

        if _is_contact_line(stripped):
            story.append(Paragraph(stripped, contact_style))
            continue

        if _is_section_header(stripped):
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#CCCCCC"), spaceAfter=2))
            label = stripped.upper()
            story.append(Paragraph(label, header_style))
            continue

        if stripped.startswith(("•", "-", "–", "▪", "*", "○")):
            text = stripped.lstrip("•-–▪*○ ").strip()
            story.append(Paragraph(f"• {text}", bullet_style))
            continue

        story.append(Paragraph(stripped, text_style))

    doc.build(story)
    buf.seek(0)
    return buf.read()
