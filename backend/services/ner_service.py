import spacy
import re
from typing import Optional

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_name_from_text(text: str) -> Optional[str]:
    """Extract the most likely primary name from text using spaCy."""
    if not text:
        return None
        
    # Heuristics: search for "Name: X" or similar first
    lines = text.split('\n')
    for line in lines:
        if 'name' in line.lower() and ':' in line:
            parts = line.split(':', 1)
            if len(parts) > 1 and parts[1].strip():
                return parts[1].strip()
                
    doc = nlp(text)
    
    # Try to find PERSON entities
    names = [ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON"]
    
    if names:
        # Return the first one or longest one
        return max(names, key=len)
        
    return None
