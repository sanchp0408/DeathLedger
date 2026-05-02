from rapidfuzz import fuzz


CRITICAL_THRESHOLD = 70   # below this = CRITICAL mismatch
MINOR_THRESHOLD = 90      # below this but above 70 = MINOR


def compare_names(name1: str, name2: str) -> int:
    """Return similarity score 0-100 between two names."""
    return fuzz.token_sort_ratio(name1.lower(), name2.lower())


def classify_score(score: int) -> str:
    if score >= MINOR_THRESHOLD:
        return "OK"
    elif score >= CRITICAL_THRESHOLD:
        return "MINOR"
    else:
        return "CRITICAL"


def build_contradiction_report(doc_fields: dict) -> dict:
    """
    doc_fields: {filename: {names: [...], ...}}
    Returns a report dict with all pairwise name comparisons.
    """
    # Collect one representative name per document (first detected name)
    doc_names = {}
    for filename, fields in doc_fields.items():
        names = fields.get("names", [])
        if names:
            doc_names[filename] = names[0]
        else:
            doc_names[filename] = "NOT FOUND"

    comparisons = []
    files = list(doc_names.keys())

    for i in range(len(files)):
        for j in range(i + 1, len(files)):
            f1, f2 = files[i], files[j]
            n1, n2 = doc_names[f1], doc_names[f2]
            if n1 == "NOT FOUND" or n2 == "NOT FOUND":
                score = 0
                status = "CRITICAL"
            else:
                score = compare_names(n1, n2)
                status = classify_score(score)

            comparisons.append({
                "doc1": f1,
                "doc2": f2,
                "name1": n1,
                "name2": n2,
                "score": score,
                "status": status,
            })

    # Overall severity = worst found
    statuses = [c["status"] for c in comparisons]
    if "CRITICAL" in statuses:
        overall = "CRITICAL"
    elif "MINOR" in statuses:
        overall = "MINOR"
    else:
        overall = "OK"

    return {
        "doc_names": doc_names,
        "comparisons": comparisons,
        "overall": overall,
    }