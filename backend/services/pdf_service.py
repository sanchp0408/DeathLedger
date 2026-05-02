from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import io
from datetime import datetime

# ── COLOUR PALETTE ──────────────────────────────────────────
NAVY   = colors.HexColor("#1a1a2e")
NAVY2  = colors.HexColor("#16213e")
GOLD   = colors.HexColor("#c9a84c")
RED    = colors.HexColor("#e05252")
ORANGE = colors.HexColor("#e08c3a")
GREEN  = colors.HexColor("#4caf7d")
GREY1  = colors.HexColor("#f5f5f5")
GREY2  = colors.HexColor("#eeeeee")
GREY3  = colors.HexColor("#cccccc")
WHITE  = colors.white
BLACK  = colors.HexColor("#1a1a1a")
TEXT2  = colors.HexColor("#555555")
TEXT3  = colors.HexColor("#888888")

def _styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("DLTitle", parent=base["Normal"],
            fontName="Helvetica-Bold", fontSize=22,
            textColor=WHITE, alignment=TA_CENTER, spaceAfter=2),
        "subtitle": ParagraphStyle("DLSub", parent=base["Normal"],
            fontName="Helvetica", fontSize=9,
            textColor=colors.HexColor("#cccccc"), alignment=TA_CENTER, spaceAfter=0),
        "section": ParagraphStyle("DLSection", parent=base["Normal"],
            fontName="Helvetica-Bold", fontSize=11,
            textColor=NAVY, spaceBefore=4, spaceAfter=6),
        "body": ParagraphStyle("DLBody", parent=base["Normal"],
            fontName="Helvetica", fontSize=9,
            textColor=BLACK, leading=14, spaceAfter=4),
        "body_small": ParagraphStyle("DLBodySm", parent=base["Normal"],
            fontName="Helvetica", fontSize=8,
            textColor=TEXT2, leading=13, spaceAfter=3),
        "mono": ParagraphStyle("DLMono", parent=base["Normal"],
            fontName="Helvetica", fontSize=8,
            textColor=BLACK, leading=13),
        "warn": ParagraphStyle("DLWarn", parent=base["Normal"],
            fontName="Helvetica-Bold", fontSize=9,
            textColor=RED, spaceAfter=6),
        "ok": ParagraphStyle("DLOk", parent=base["Normal"],
            fontName="Helvetica-Bold", fontSize=9,
            textColor=GREEN, spaceAfter=6),
        "footer": ParagraphStyle("DLFooter", parent=base["Normal"],
            fontName="Helvetica", fontSize=7,
            textColor=TEXT3, alignment=TA_CENTER),
        "label": ParagraphStyle("DLLabel", parent=base["Normal"],
            fontName="Helvetica-Bold", fontSize=7,
            textColor=TEXT3, leading=10),
    }

def _section_header(text, S):
    """Returns a navy bar with white section title."""
    data = [[Paragraph(text, S["title"])]]
    t = Table(data, colWidths=[17 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY2),
        ("TOPPADDING",    (0,0), (-1,-1), 12),
        ("BOTTOMPADDING", (0,0), (-1,-1), 12),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
        ("ROWBACKGROUNDS", (0,0), (-1,-1), [NAVY2]),
    ]))
    return t

def _score_color(score: int, status: str):
    if status == "CRITICAL":
        return RED
    elif status == "MINOR":
        return ORANGE
    return GREEN

def generate_pdf_packet(
    institution: str,
    doc_fields: dict,
    contradiction_report: dict,
    claim_letter: str,
    missing_docs: list,
    rules: dict,
) -> bytes:
    buffer = io.BytesIO()
    pdf_doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=1.8 * cm,
        leftMargin=1.8 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
    )

    S = _styles()
    story = []
    PAGE_W = 17 * cm   # usable width

    # HEADER BANNER
    header_data = [[
        Paragraph("⚖  DeathLedger", ParagraphStyle("H1", fontName="Helvetica-Bold",
            fontSize=24, textColor=GOLD, alignment=TA_CENTER)),
    ],[
        Paragraph(
            f"Asset Claim Packet — {institution} &nbsp;|&nbsp; Generated: {datetime.now().strftime('%d %B %Y, %I:%M %p')}",
            ParagraphStyle("H2", fontName="Helvetica", fontSize=8,
                textColor=colors.HexColor("#aaaaaa"), alignment=TA_CENTER)),
    ]]
    header_t = Table(header_data, colWidths=[PAGE_W])
    header_t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY),
        ("TOPPADDING",    (0,0), (-1,-1), 14),
        ("BOTTOMPADDING", (0,0), (-1,-1), 14),
        ("LEFTPADDING",   (0,0), (-1,-1), 0),
        ("RIGHTPADDING",  (0,0), (-1,-1), 0),
    ]))
    story.append(header_t)
    story.append(Spacer(1, 0.3 * cm))

    # SECTION 1 — DOCUMENT CHECKLIST
    story.append(_section_header("SECTION 1 — Document Checklist", S))
    story.append(Spacer(1, 0.25 * cm))

    required_docs = rules.get("required_docs", [])

    cl_data = [[
        Paragraph("#",        S["label"]),
        Paragraph("Required Document", S["label"]),
        Paragraph("Status",   S["label"]),
    ]]
    for i, doc in enumerate(required_docs, 1):
        is_missing = doc in missing_docs
        status_txt = "❌  MISSING" if is_missing else "✅  Present"
        status_col = RED if is_missing else GREEN
        cl_data.append([
            Paragraph(str(i), S["body_small"]),
            Paragraph(doc.replace('_', ' ').title(), S["body_small"]),
            Paragraph(status_txt, ParagraphStyle("st", fontName="Helvetica-Bold",
                fontSize=8, textColor=status_col)),
        ])

    cl_table = Table(cl_data, colWidths=[0.8*cm, 12.2*cm, 4.0*cm])
    cl_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), NAVY2),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, 0), 8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, GREY1]),
        ("GRID",          (0, 0), (-1, -1), 0.4, GREY3),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(cl_table)
    story.append(Spacer(1, 0.3 * cm))

    if missing_docs:
        story.append(Paragraph(
            f"⚠  WARNING: {len(missing_docs)} document(s) missing — claim WILL be rejected without them.",
            S["warn"],
        ))
    else:
        story.append(Paragraph("✅  All required documents appear to be present.", S["ok"]))

    story.append(Spacer(1, 0.4 * cm))

    # SECTION 2 — CONTRADICTION REPORT
    story.append(HRFlowable(width="100%", thickness=1, color=GREY3))
    story.append(Spacer(1, 0.2 * cm))
    story.append(_section_header("SECTION 2 — Name Contradiction Report", S))
    story.append(Spacer(1, 0.25 * cm))

    overall = contradiction_report.get("overall_status", "OK")
    overall_color = {"CRITICAL": RED, "MINOR": ORANGE, "OK": GREEN}.get(overall, GREEN)
    story.append(Paragraph(
        f"Overall Status: <b>{overall}</b>",
        ParagraphStyle("ov", fontName="Helvetica-Bold", fontSize=10,
            textColor=overall_color, spaceAfter=8),
    ))

    comparisons = contradiction_report.get("comparisons", [])

    if not comparisons:
        story.append(Paragraph(
            "Upload at least 2 documents to see name comparisons.",
            S["body_small"],
        ))
    else:
        COL_W = [3.5*cm, 3.5*cm, 3.5*cm, 3.5*cm, 1.5*cm, 1.5*cm]

        def _wrap(txt, max_chars=22):
            return txt[:max_chars] + "…" if len(txt) > max_chars else txt

        ct_data = [[
            Paragraph("Document 1",  S["label"]),
            Paragraph("Extracted Name",  S["label"]),
            Paragraph("Document 2",  S["label"]),
            Paragraph("Extracted Name",  S["label"]),
            Paragraph("Score",       S["label"]),
            Paragraph("Status",      S["label"]),
        ]]

        style_cmds = [
            ("BACKGROUND",    (0, 0), (-1, 0), NAVY2),
            ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
            ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE",      (0, 0), (-1, 0), 7),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE]),
            ("FONTSIZE",      (0, 1), (-1, -1), 9),
            ("GRID",          (0, 0), (-1, -1), 0.4, GREY3),
            ("TOPPADDING",    (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING",   (0, 0), (-1, -1), 5),
            ("RIGHTPADDING",  (0, 0), (-1, -1), 5),
            ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN",         (4, 0), (5, -1), "CENTER"),
        ]

        for c in comparisons:
            score = round(c["score"])
            status = c["severity"]
            s_color = _score_color(score, status)

            score_para = Paragraph(
                f"<b>{score}%</b>",
                ParagraphStyle("sc", fontName="Helvetica-Bold", fontSize=8,
                    textColor=s_color, alignment=TA_CENTER),
            )
            status_para = Paragraph(
                f"<b>{status}</b>",
                ParagraphStyle("ss", fontName="Helvetica-Bold", fontSize=7,
                    textColor=s_color, alignment=TA_CENTER),
            )

            ct_data.append([
                Paragraph(_wrap(c.get("doc_a", c.get("docA", "")).replace('_', ' ').title()),  S["body_small"]),
                Paragraph(_wrap(c.get("name_a", c.get("nameA", ""))), ParagraphStyle("nm", fontName="Helvetica", fontSize=8, textColor=BLACK)),
                Paragraph(_wrap(c.get("doc_b", c.get("docB", "")).replace('_', ' ').title()),  S["body_small"]),
                Paragraph(_wrap(c.get("name_b", c.get("nameB", ""))), ParagraphStyle("nm2", fontName="Helvetica", fontSize=8, textColor=BLACK)),
                score_para,
                status_para,
            ])

        ct_table = Table(ct_data, colWidths=COL_W, repeatRows=1)
        ct_table.setStyle(TableStyle(style_cmds))
        story.append(KeepTogether(ct_table))

    story.append(Spacer(1, 0.4 * cm))

    # SECTION 3 — AI CLAIM LETTER
    story.append(HRFlowable(width="100%", thickness=1, color=GREY3))
    story.append(Spacer(1, 0.2 * cm))
    story.append(_section_header("SECTION 3 — AI-Generated Covering Letter", S))
    story.append(Spacer(1, 0.25 * cm))

    story.append(Paragraph(
        f"Regulatory Reference: {rules.get('circular', 'N/A')}",
        ParagraphStyle("circ", fontName="Helvetica-Oblique", fontSize=8,
            textColor=TEXT2, spaceAfter=10),
    ))

    for line in claim_letter.split("\n"):
        stripped = line.strip()
        if stripped:
            story.append(Paragraph(stripped, S["body"]))
        else:
            story.append(Spacer(1, 0.15 * cm))

    story.append(Spacer(1, 0.4 * cm))

    # FOOTER
    story.append(HRFlowable(width="100%", thickness=1.5, color=NAVY))
    story.append(Spacer(1, 0.15 * cm))
    story.append(Paragraph(
        "Generated by DeathLedger  ·  Built for Bharat",
        S["footer"],
    ))

    pdf_doc.build(story)
    buffer.seek(0)
    return buffer.read()
