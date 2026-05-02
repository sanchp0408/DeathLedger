# DeathLedger AI Auditor

DeathLedger is an AI-powered document auditor and claim processing assistant. It helps grieving families streamline the process of claiming deceased accounts across various banks and insurance institutions (e.g., SBI, LIC, HDFC, ICICI) by verifying documents, detecting contradictions, and generating required claim letters and forms automatically.

## 🚀 Features

- **Automated OCR & Extraction**: Extracts text, names, dates, Aadhaar, and PAN from uploaded documents (PDFs and images) using PyMuPDF and Tesseract OCR.
- **Contradiction Detection**: Automatically cross-references extracted names and details across multiple documents to flag critical or minor mismatches using fuzzy string matching.
- **Institution Rules Engine**: Validates uploaded documents against a database of institution-specific rules and RBI/IRDAI circulars, identifying any missing requirements.
- **AI Claim Letter Generation**: Utilizes Anthropic's API to draft precise, professional claim letters referencing appropriate regulatory circulars.
- **Ready-to-Print PDF Packets**: Compiles all analysis, reports, and claim letters into a single, comprehensive PDF packet for easy submission.
- **WhatsApp Summaries**: Generates a quick, shareable summary of the claim status and missing documents for family members.

## 🛠 Tech Stack

- **Backend / Core Engine**: Python, FastAPI, Flask, PyMuPDF, Pytesseract, spaCy, RapidFuzz, ReportLab.
- **Frontend**: Next.js 15, React, Tailwind CSS, Lucide React.
- **AI Integration**: Anthropic API.

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **Tesseract OCR**: You must install Tesseract on your system for OCR capabilities.
  - Windows: Download from [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki) and ensure the path is correctly set in your environment variables.

## 📁 Project Structure

This repository contains both a core processing engine and a modern Next.js/FastAPI monorepo structure.

- `frontend/`: Next.js 15 React frontend application.
- `backend/`: FastAPI backend implementation.
- `app.py`: Flask application prototype (serves as an all-in-one alternative).
- Core Modules:
  - `ocr_engine.py`: Text and entity extraction logic.
  - `contradiction_detector.py`: Fuzzy matching and discrepancy identification.
  - `rules_database.py`: Institution requirements and circulars mapping.
  - `claim_letter.py` & `pdf_generator.py`: Document generation.

## ⚙️ Environment Variables

Create a `.env` file in the root directory and/or your backend directory with the following keys:

```env
# Anthropic API Key for generating AI claim letters
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Path to your Tesseract executable (Windows example, adjust if necessary)
TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
```

## 🚀 Setup & Installation

### 1. Running the FastAPI Backend
```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download required spaCy model
python -m spacy download en_core_web_sm

# Start the server
uvicorn main:app --reload --port 8000
```

### 2. Running the Next.js Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will be available at `http://localhost:3000`.

### 3. Running the Flask Prototype (Alternative)
If you prefer to run the standalone Flask prototype that integrates the core modules directly:
```bash
# Ensure dependencies from backend/requirements.txt are installed, then run:
python app.py
```
The Flask app will be available at `http://localhost:5000`.

## 💡 Usage

1. **Select Institution**: Choose the target institution (e.g., SBI, LIC).
2. **Upload Documents**: Upload the required documents such as Death Certificate, Aadhaar, PAN, Bank Passbook, etc.
3. **Analyze**: (Optional) Enable Demo Mode to use pre-loaded sample documents to test the flow.
4. **Review**: Check the generated contradiction report and the missing documents list.
5. **Download**: Download the final compiled PDF packet containing the AI-generated claim letter and document analysis, ready for physical submission.

## 📄 License
This project is licensed under the MIT License.
