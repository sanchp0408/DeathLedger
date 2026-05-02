import PyPDF2
import pytesseract
from PIL import Image
import io
import os
from fastapi import UploadFile

TESSERACT_PATH = os.getenv("TESSERACT_PATH", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

async def extract_text_from_file(file: UploadFile) -> str:
    """Extract text from a PDF or image file."""
    file_bytes = await file.read()
    ext = file.filename.lower().split(".")[-1]
    
    text = ""
    if ext == "pdf":
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    text += page_text + "\n"
        except Exception as e:
            print(f"PyPDF2 extraction failed: {e}")
    elif ext in ("jpg", "jpeg", "png", "bmp", "tiff", "tif"):
        try:
            img = Image.open(io.BytesIO(file_bytes))
            text = pytesseract.image_to_string(img, lang="eng")
        except Exception as e:
            print(f"OCR failed for image: {e}")
            
    return text.strip()
