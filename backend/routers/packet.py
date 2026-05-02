from fastapi import APIRouter, Response, Request
from pydantic import BaseModel
from typing import Dict, Any, List
from services.pdf_service import generate_pdf_packet

router = APIRouter()

class PacketRequest(BaseModel):
    institution: str
    comparisons: List[Dict[str, Any]]
    missing_docs: List[str]
    claim_letter: str

@router.post("/download")
async def generate_packet(data: PacketRequest):
    # Prepare contradiction report structure
    overall = "OK"
    for c in data.comparisons:
        if c.get("severity") == "CRITICAL":
            overall = "CRITICAL"
            break
        elif c.get("severity") == "MINOR":
            overall = "MINOR"
            
    contradiction_report = {
        "overall_status": overall,
        "comparisons": data.comparisons
    }
    
    rules = {
        "required_docs": ["Death Certificate", "Aadhaar", "PAN"], # simplified for now
        "circular": "RBI/2025-26/95"
    }
    
    pdf_bytes = generate_pdf_packet(
        institution=data.institution,
        doc_fields={},
        contradiction_report=contradiction_report,
        claim_letter=data.claim_letter,
        missing_docs=data.missing_docs,
        rules=rules
    )
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=DeathLedger_Claim_{data.institution}.pdf"}
    )
    
@router.get("/download")
async def generate_packet_get():
    """Fallback for direct window.open access without data"""
    # Demo data
    contradiction_report = {
        "overall_status": "CRITICAL",
        "comparisons": [
            {"doc_a": "Death Certificate", "name_a": "Rajesh Kumar", "doc_b": "Aadhaar", "name_b": "Rajesh K.", "score": 85, "severity": "MINOR"}
        ]
    }
    rules = {"required_docs": ["Death Certificate", "Aadhaar"], "circular": "RBI/2025-26/95"}
    claim_letter = "Dear Branch Manager,\n\nPlease process this claim under RBI/2025-26/95.\n\nThank you."
    
    pdf_bytes = generate_pdf_packet(
        institution="SBI",
        doc_fields={},
        contradiction_report=contradiction_report,
        claim_letter=claim_letter,
        missing_docs=["PAN"],
        rules=rules
    )
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=DeathLedger_Demo_Claim.pdf"}
    )
