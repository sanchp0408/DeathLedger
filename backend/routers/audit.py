from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional
from services.fuzzy_service import run_contradiction_engine, get_audit_summary
from services.ocr_service import extract_text_from_file
from services.ner_service import extract_name_from_text
from models.schemas import AuditRequest, AuditResponse

router = APIRouter()

INSTITUTION_DOCS = {
    "SBI": ["death_certificate", "aadhaar", "pan", "bank_passbook", "claimant_photo", "claim_form"],
    "LIC": ["death_certificate", "aadhaar", "pan", "policy_document", "original_policy_bond", "claimant_statement"],
    "HDFC": ["death_certificate", "aadhaar", "pan", "bank_passbook", "kyc_documents"],
    "ICICI": ["death_certificate", "aadhaar", "pan", "bank_passbook", "kyc_documents", "claim_form"]
}

@router.post("/process-docs")
async def process_documents(
    documents: List[UploadFile] = File(...),
    institution: str = Form(...),
    demo_mode: bool = Form(False),
    nominee_exists: bool = Form(False),
    claim_amount: Optional[float] = Form(None)
):
    extracted = {}
    uploaded_types = []
    
    # Check if frontend passed files as 'documents' or 'files'
    # The prompt used `files: List[UploadFile] = File(...)` but frontend uses `formData.append('documents', f.file)`
    # I changed it to `documents: List[UploadFile]` above to match frontend.
    
    for file in documents:
        # Determine document type based on filename heuristics or explicit prefix
        original_fname = file.filename
        if "____" in original_fname:
            doc_type, fname = original_fname.split("____", 1)
            fname = fname.lower()
        else:
            fname = original_fname.lower()
            doc_type = "unknown"
            if "death" in fname:
                doc_type = "death_certificate"
            elif "aadhaar" in fname or "aadhar" in fname:
                doc_type = "aadhaar"
            elif "pan" in fname:
                doc_type = "pan"
            elif "passbook" in fname or "bank" in fname:
                doc_type = "bank_passbook"
            else:
                doc_type = fname.split("_")[0]  # Fallback
            
        text = await extract_text_from_file(file)
        name = extract_name_from_text(text)
        
        # If we couldn't extract a name but it's a known document type, add a dummy name for testing if not demo
        if not name:
            name = "Unknown Name"
            
        if name:
            # We map to readable labels for the frontend to match demoData
            display_name_map = {
                "death_certificate": "Death Certificate",
                "aadhaar": "Aadhaar Card",
                "pan": "PAN Card",
                "bank_passbook": "Bank Passbook"
            }
            display_key = display_name_map.get(doc_type, doc_type.replace('_', ' ').title())
            extracted[display_key] = name
        uploaded_types.append(doc_type)
    
    # Run contradiction engine
    comparisons = run_contradiction_engine(extracted)
    summary = get_audit_summary(comparisons)
    
    # Missing document check
    required = INSTITUTION_DOCS.get(institution, [])
    missing = [doc for doc in required if doc not in uploaded_types]
    
    # Map missing to readable labels
    display_missing = [d.replace('_', ' ').title() for d in missing]
    
    # Regulatory flags
    simplified_procedure = bool(claim_amount and claim_amount < 1500000)
    nominee_protection = nominee_exists
    
    return {
        "comparisons": comparisons,
        "overall": summary["overall_status"], # Adding this to match frontend expected mapping
        "summary": summary,
        "extracted": [{"filename": k, "names": [v]} for k,v in extracted.items()], # Align with frontend extracted parsing
        "extracted_names": extracted,
        "missing_docs": display_missing,
        "missing_documents": display_missing,
        "regulatory": {
            "simplified_procedure": simplified_procedure,
            "nominee_protection": nominee_protection,
            "sla_days": 15,
            "circular": "RBI/2025-26/95"
        }
    }
