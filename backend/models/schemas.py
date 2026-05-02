from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AuditRequest(BaseModel):
    pass

class AuditResponse(BaseModel):
    comparisons: List[Dict[str, Any]]
    summary: Dict[str, Any]
    extracted_names: Dict[str, str]
    missing_documents: List[str]
    regulatory: Dict[str, Any]
