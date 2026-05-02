from rapidfuzz import fuzz, process
from typing import List, Dict

SCORE_OK = 95
SCORE_MINOR = 80

def get_severity(score: float) -> str:
    if score >= SCORE_OK:
        return "OK"
    elif score >= SCORE_MINOR:
        return "MINOR"
    else:
        return "CRITICAL"

def normalize_name(name: str) -> str:
    """Normalize: lowercase, strip titles, expand initials if possible"""
    name = name.lower().strip()
    # Remove common titles
    titles = ['mr.', 'mrs.', 'dr.', 'shri', 'smt.', 'late']
    for t in titles:
        name = name.replace(t, '')
    return name.strip()

def compare_names(name_a: str, name_b: str) -> Dict:
    """
    Compare two names using multiple fuzzy algorithms.
    Returns the best score across token_sort_ratio and partial_ratio.
    This handles "R. Kumar" vs "Rajesh Kumar" better than simple ratio.
    """
    n_a = normalize_name(name_a)
    n_b = normalize_name(name_b)
    
    scores = {
        "ratio": fuzz.ratio(n_a, n_b),
        "partial_ratio": fuzz.partial_ratio(n_a, n_b),
        "token_sort_ratio": fuzz.token_sort_ratio(n_a, n_b),
        "token_set_ratio": fuzz.token_set_ratio(n_a, n_b),
    }
    
    best_score = max(scores.values())
    severity = get_severity(best_score)
    
    return {
        "score": round(best_score, 1),
        "severity": severity,
        "algorithm_scores": scores,
        "name_a_normalized": n_a,
        "name_b_normalized": n_b,
    }

def run_contradiction_engine(extracted_names: Dict[str, str]) -> List[Dict]:
    """
    Takes a dict of {document_type: extracted_name}.
    Returns all pairwise comparisons with scores and severity.
    
    Example input:
    {
        "death_certificate": "Rajesh Kumar",
        "aadhaar": "Rajesh Kumar",
        "bank_passbook": "R. Kumar",
        "pan": "Rajesh Kumar Sharma"
    }
    """
    results = []
    doc_types = list(extracted_names.keys())
    
    for i in range(len(doc_types)):
        for j in range(i + 1, len(doc_types)):
            doc_a = doc_types[i]
            doc_b = doc_types[j]
            name_a = extracted_names[doc_a]
            name_b = extracted_names[doc_b]
            
            comparison = compare_names(name_a, name_b)
            results.append({
                "doc_a": doc_a,
                "doc_b": doc_b,
                "name_a": name_a,
                "name_b": name_b,
                **comparison
            })
    
    return sorted(results, key=lambda x: x["score"])  # Worst first

def get_audit_summary(comparisons: List[Dict]) -> Dict:
    """Aggregate summary of all comparisons"""
    critical = sum(1 for c in comparisons if c["severity"] == "CRITICAL")
    minor = sum(1 for c in comparisons if c["severity"] == "MINOR")
    ok = sum(1 for c in comparisons if c["severity"] == "OK")
    
    overall = "CRITICAL" if critical > 0 else ("MINOR" if minor > 0 else "OK")
    
    return {
        "overall_status": overall,
        "critical_count": critical,
        "minor_count": minor,
        "ok_count": ok,
        "total_comparisons": len(comparisons),
        "recommendation": get_recommendation(overall, critical)
    }

def get_recommendation(status: str, critical_count: int) -> str:
    if status == "CRITICAL":
        return f"Generate One-Name Affidavit for {critical_count} critical mismatch(es) before submitting to institution."
    elif status == "MINOR":
        return "Prepare a Letter of Clarification explaining clerical inconsistencies."
    else:
        return "All name comparisons passed. Proceed with claim submission."
