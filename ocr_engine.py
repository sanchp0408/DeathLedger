import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
import os
import spacy
import re
from dotenv import load_dotenv

load_dotenv()

TESSERACT_PATH = os.getenv("TESSERACT_PATH", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

nlp = spacy.load("en_core_web_sm")


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file using PyMuPDF + OCR fallback."""
    text = ""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    for page in doc:
        page_text = page.get_text()
        if page_text.strip():
            text += page_text + "\n"
        else:
            # OCR fallback for scanned pages
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_bytes))
            ocr_text = pytesseract.image_to_string(img, lang="eng+hin")
            text += ocr_text + "\n"
    doc.close()
    return text.strip()


def extract_text_from_image(file_bytes: bytes) -> str:
    """Extract text from an image file using Tesseract OCR."""
    img = Image.open(io.BytesIO(file_bytes))
    text = pytesseract.image_to_string(img, lang="eng+hin")
    return text.strip()


def extract_text(file_bytes: bytes, filename: str) -> str:
    """Route to correct extractor based on file type."""
    ext = filename.lower().split(".")[-1]
    if ext == "pdf":
        return extract_text_from_pdf(file_bytes)
    elif ext in ("jpg", "jpeg", "png", "bmp", "tiff", "tif"):
        return extract_text_from_image(file_bytes)
    else:
        return ""


def extract_fields(text: str) -> dict:
    """Use spaCy + regex to extract names, dates, IDs from raw text."""
    doc = nlp(text)

    names = [ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON"]

    # Date patterns
    date_pattern = re.compile(
        r"\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+\w+\s+\d{4}|\w+\s+\d{1,2},?\s+\d{4})\b"
    )
    dates = date_pattern.findall(text)

    # Aadhaar: 12 digits
    aadhaar_pattern = re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b")
    aadhaars = aadhaar_pattern.findall(text)

    # PAN: 5 letters, 4 digits, 1 letter
    pan_pattern = re.compile(r"\b[A-Z]{5}[0-9]{4}[A-Z]\b")
    pans = pan_pattern.findall(text)

    return {
        "names": list(set(names)),
        "dates": list(set(dates)),
        "aadhaar": list(set(aadhaars)),
        "pan": list(set(pans)),
        "raw_text": text,
    }


def process_documents(uploaded_files: list) -> dict:
    """
    Process a list of uploaded files.
    uploaded_files: list of dicts with keys 'name' and 'bytes'
    Returns dict: {filename: extracted_fields_dict}
    """
    results = {}
    for f in uploaded_files:
        text = extract_text(f["bytes"], f["name"])
        fields = extract_fields(text)
        results[f["name"]] = fields
    return results