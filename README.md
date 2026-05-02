# DeathLedger — AI-Powered Deceased Claim Auditor

DeathLedger is a tool designed to simplify the document verification process after a person’s death in India.

Instead of making multiple trips to banks and insurance offices, families can upload their documents once and get a complete, submission-ready claim packet in under a minute.

---

## The Problem

After a death, families are expected to quickly handle financial and legal formalities. In reality, this process is confusing and error-prone.

Common issues:
- Different institutions require different sets of documents  
- Small name mismatches lead to rejection  
- No clear guidance on regulatory rules  
- Multiple visits are needed to fix mistakes  

In many cases, delays happen because of simple document inconsistencies that could be detected early.

---

## The Solution

DeathLedger audits documents before submission.

It:
- Extracts names from uploaded files  
- Compares them across documents  
- Flags mismatches with severity levels  
- Checks required documents based on institution  
- Generates a claim letter and a final PDF packet  

Goal: **help users walk into a bank fully prepared the first time.**

---

## Key Features

### Document Processing
- OCR for PDFs and images  
- Supports Aadhaar, PAN, Death Certificate, Passbook, Insurance Policy  

### Name Verification
- Compares names using multiple matching techniques  
- Classifies issues as OK, Minor, or Critical  
- Suggests next steps (e.g., affidavit)

### Institution Rules
- Supports SBI, LIC, HDFC Bank, ICICI Bank  
- Checks required documents  
- Applies relevant RBI and IRDAI guidelines  

### Claim Letter Generation
- Generates a structured claim letter  
- Includes appropriate regulatory references  

### PDF Output
- Checklist of required documents  
- Mismatch report  
- Claim letter  
- Ready for submission  

### Accessibility
- Text-to-speech (English and Hindi)  
- FAQS and Language Toggle
- Shareable summary (WhatsApp-friendly)  
- Demo mode for testing  

---

## How It Works

1. Upload documents  
2. System extracts and compares names  
3. Missing documents are identified  
4. Legal checks are applied  
5. A final PDF packet is generated  

---

## Tech Stack

**Backend**
- FastAPI  
- Tesseract OCR  
- spaCy  
- RapidFuzz  
- ReportLab  

**Frontend**
- Next.js  
- TypeScript  
- Zustand  

---

## Impact

- Reducing weeks of paperwork and repeated bank visits to a single, prepared submission in under a minute.
- Lowers first-time claim rejection risk from **~40% to under 5%** (by catching mismatches early).
- Eliminates **₹5,000–₹15,000** spent on basic legal/document guidance  



## Team

- Sanchali Parikh - Frontend  
- Jagriti Kesarwani -  Backend
- Adit Jain - Ai logic, Github action setup
- Mizba Khanum — UI/UX andResearch  

