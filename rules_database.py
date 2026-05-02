# Required documents per institution + their RBI/IRDAI circular references

INSTITUTION_RULES = {
    "SBI": {
        "required_docs": [
            "Death Certificate",
            "Aadhaar Card",
            "PAN Card",
            "Bank Passbook / Account Statement",
            "Nomination Form / Succession Certificate",
            "Claimant's Aadhaar & PAN",
        ],
        "circular": "RBI Circular RBI/2005-06/288 & SBI Deceased Claim Policy 2021",
        "notes": "SBI requires original death certificate attested by gazetted officer for claims above Rs.1 Lakh.",
    },
    "LIC": {
        "required_docs": [
            "Death Certificate",
            "Original Policy Bond",
            "Claimant's Aadhaar & PAN",
            "NEFT Bank Details (cancelled cheque)",
            "Succession Certificate (if no nominee)",
            "Hospital Certificate (if death by illness)",
        ],
        "circular": "IRDAI Circular IRDA/LIFE/CIR/GLD/013/02/2012",
        "notes": "LIC will outright reject if policy bond is missing. Succession Certificate mandatory if nominee is deceased.",
    },
    "HDFC Bank": {
        "required_docs": [
            "Death Certificate",
            "Aadhaar Card",
            "PAN Card",
            "Bank Passbook",
            "Claimant's ID & Address Proof",
            "Succession Certificate or Probate (if no nominee)",
        ],
        "circular": "RBI Master Circular on Customer Service 2015",
        "notes": "HDFC processes claims within 15 days if all documents are in order.",
    },
    "ICICI Bank": {
        "required_docs": [
            "Death Certificate",
            "Aadhaar Card",
            "PAN Card",
            "Bank Statement",
            "Claimant's KYC Documents",
            "Legal Heir Certificate or Succession Certificate",
        ],
        "circular": "RBI Master Circular on Customer Service 2015",
        "notes": "ICICI may require additional notarised affidavit for accounts above Rs.5 Lakh.",
    },
}


def get_rules(institution: str) -> dict:
    return INSTITUTION_RULES.get(institution, {})


def check_missing_documents(uploaded_filenames: list, institution: str) -> list:
    """
    Heuristically check which required documents seem to be missing.
    Matches by keywords in filenames.
    """
    rules = get_rules(institution)
    required = rules.get("required_docs", [])

    keyword_map = {
        "Death Certificate": ["death", "certificate"],
        "Aadhaar Card": ["aadhaar", "aadhar", "uid"],
        "PAN Card": ["pan"],
        "Bank Passbook / Account Statement": ["passbook", "statement", "account"],
        "Nomination Form / Succession Certificate": ["succession", "nomination", "nominee"],
        "Claimant's Aadhaar & PAN": ["claimant", "aadhaar", "pan"],
        "Original Policy Bond": ["policy", "bond"],
        "NEFT Bank Details (cancelled cheque)": ["cheque", "neft", "bank"],
        "Hospital Certificate (if death by illness)": ["hospital", "medical"],
        "Legal Heir Certificate or Succession Certificate": ["heir", "succession"],
        "Claimant's KYC Documents": ["kyc", "claimant"],
        "Claimant's ID & Address Proof": ["id", "address", "proof"],
        "Bank Passbook": ["passbook", "bank"],
        "Bank Statement": ["statement", "bank"],
    }

    uploaded_lower = [f.lower() for f in uploaded_filenames]
    missing = []

    for doc in required:
        keywords = keyword_map.get(doc, [doc.lower().split()[0]])
        found = any(
            any(kw in fname for kw in keywords)
            for fname in uploaded_lower
        )
        if not found:
            missing.append(doc)

    return missing