import os
import json
import base64
from flask import Flask, render_template, request, jsonify, send_file
from dotenv import load_dotenv
import io

load_dotenv()

# Import your existing modules
from ocr_engine import process_documents
from contradiction_detector import build_contradiction_report
from rules_database import get_rules, check_missing_documents, INSTITUTION_RULES
from claim_letter import generate_claim_letter, generate_whatsapp_summary
from pdf_generator import generate_pdf_packet

app = Flask(__name__)

# Store last generated PDF in memory (for download)
_last_pdf = {}


@app.route("/")
def index():
    institutions = list(INSTITUTION_RULES.keys())
    return render_template("index.html", institutions=institutions)


@app.route("/api/rules/<institution>")
def get_institution_rules(institution):
    rules = get_rules(institution)
    return jsonify(rules)


@app.route("/api/process", methods=["POST"])
def process():
    institution = request.form.get("institution", "SBI")
    demo_mode = request.form.get("demo_mode") == "true"
    rules = get_rules(institution)

    if demo_mode:
        files_to_process = _make_demo_files()
    else:
        files_to_process = []
        for f in request.files.getlist("documents"):
            files_to_process.append({
                "name": f.filename,
                "bytes": f.read()
            })

    if not files_to_process:
        return jsonify({"error": "No documents provided"}), 400

    # Step 1: OCR
    doc_fields = process_documents(files_to_process)

    # Step 2: Contradictions
    contradiction_report = build_contradiction_report(doc_fields)

    # Step 3: Missing docs
    filenames = [f["name"] for f in files_to_process]
    missing_docs = check_missing_documents(filenames, institution)

    # Step 4: Claim letter
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    claim_letter_text = ""
    if api_key and api_key not in ("your_key_here", ""):
        try:
            claim_letter_text = generate_claim_letter(
                doc_fields, contradiction_report, institution,
                rules.get("circular", ""), missing_docs,
            )
        except Exception as e:
            claim_letter_text = (
                f"[API Error: {e}]\n\n"
                "To: The Branch Manager\nSubject: Claim for Deceased Account\n\n"
                "Dear Sir/Madam,\n\nWe hereby submit the claim documents as listed in this packet.\n\nYours faithfully,\n[Claimant Name]"
            )
    else:
        claim_letter_text = (
            "To: The Branch Manager\n"
            f"Subject: Deceased Account Claim — {institution}\n\n"
            "Dear Sir/Madam,\n\n"
            "We hereby submit our claim for the deceased account holder's assets. "
            "Please find attached all supporting documents for your review.\n\n"
            "We request you to kindly process this claim at the earliest.\n\n"
            "Yours faithfully,\n[Claimant Name]\n\n"
            "[Add ANTHROPIC_API_KEY to .env for AI-generated letter with RBI circular references]"
        )

    # Step 5: Generate PDF
    pdf_bytes = generate_pdf_packet(
        institution, doc_fields, contradiction_report,
        claim_letter_text, missing_docs, rules,
    )

    # Store PDF for download
    _last_pdf["data"] = pdf_bytes
    _last_pdf["institution"] = institution

    # WhatsApp summary
    whatsapp_text = generate_whatsapp_summary(contradiction_report, institution, missing_docs)

    # Build clean comparisons (round scores)
    comparisons = []
    for c in contradiction_report.get("comparisons", []):
        comparisons.append({
            "doc1": c["doc1"],
            "doc2": c["doc2"],
            "name1": c["name1"],
            "name2": c["name2"],
            "score": round(c["score"]),
            "status": c["status"],
        })

    # Build extracted fields summary
    extracted = []
    for fname, fields in doc_fields.items():
        extracted.append({
            "filename": fname,
            "names": fields.get("names", []),
            "dates": fields.get("dates", []),
            "aadhaar": fields.get("aadhaar", []),
            "pan": fields.get("pan", []),
        })

    return jsonify({
        "overall": contradiction_report.get("overall", "OK"),
        "comparisons": comparisons,
        "missing_docs": missing_docs,
        "required_docs": rules.get("required_docs", []),
        "claim_letter": claim_letter_text,
        "whatsapp_text": whatsapp_text,
        "extracted": extracted,
        "circular": rules.get("circular", ""),
        "notes": rules.get("notes", ""),
    })


@app.route("/api/download")
def download_pdf():
    if "data" not in _last_pdf:
        return "No PDF generated yet", 404
    institution = _last_pdf.get("institution", "Claim")
    return send_file(
        io.BytesIO(_last_pdf["data"]),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"DeathLedger_{institution.replace(' ', '_')}.pdf",
    )


def _make_demo_files():
    import io as _io
    from reportlab.pdfgen import canvas as rl_canvas

    DEMO_DOCS = [
        {
            "name": "death_certificate.pdf",
            "text": "DEATH CERTIFICATE\nName of Deceased: Rajesh Kumar\nDate of Death: 15 March 2022\nAadhaar: 1234 5678 9012\nPAN: ABCDE1234F\nRegistered by: Municipal Corporation Varanasi",
        },
        {
            "name": "bank_passbook_SBI.pdf",
            "text": "STATE BANK OF INDIA\nAccount Holder: R. Kumar\nAccount Number: 12345678901\nBranch: Varanasi Main\nPAN: ABCDE1234F",
        },
        {
            "name": "aadhaar_card.pdf",
            "text": "UNIQUE IDENTIFICATION AUTHORITY OF INDIA\nName: Rajesh Kumar Sharma\nAadhaar: 1234 5678 9012\nDOB: 12/05/1965\nAddress: 45, Civil Lines, Varanasi",
        },
    ]

    demo_uploaded = []
    for d in DEMO_DOCS:
        buf = _io.BytesIO()
        c = rl_canvas.Canvas(buf)
        y = 750
        for line in d["text"].split("\n"):
            c.drawString(50, y, line)
            y -= 20
        c.save()
        buf.seek(0)
        demo_uploaded.append({"name": d["name"], "bytes": buf.read()})
    return demo_uploaded


if __name__ == "__main__":
    app.run(debug=True, port=5000)
