from typing import List, Dict, Any

PENALTIES = {
    "critical": 25.0,
    "high": 15.0,
    "medium": 8.0,
    "low": 3.0
}

WEIGHTS = {
    "security": 0.25,
    "reliability": 0.20,
    "ai_rag": 0.20,
    "code_quality": 0.15,
    "performance": 0.10,
    "maintainability": 0.10
}

class ScoringService:
    @staticmethod
    def calculate_health_scores(findings: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates category scores and overall weighted health score (0.0 to 100.0).
        """
        category_scores = {cat: 100.0 for cat in WEIGHTS.keys()}
        counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}

        for f in findings:
            cat = f.get("category", "code_quality")
            sev = f.get("severity", "low").lower()

            if sev in counts:
                counts[sev] += 1

            penalty = PENALTIES.get(sev, 3.0)
            if cat in category_scores:
                category_scores[cat] -= penalty

        # Clamp individual category scores to 0.0 - 100.0
        for cat in category_scores:
            category_scores[cat] = max(0.0, min(100.0, category_scores[cat]))

        # Calculate weighted overall health score
        overall_score = sum(category_scores[cat] * WEIGHTS[cat] for cat in WEIGHTS.keys())
        overall_score = max(0.0, min(100.0, overall_score))

        # Health status label
        if overall_score >= 90:
            status = "Excellent"
        elif overall_score >= 75:
            status = "Good"
        elif overall_score >= 60:
            status = "Fair"
        elif overall_score >= 40:
            status = "Poor"
        else:
            status = "Critical"

        return {
            "overall_score": round(overall_score, 1),
            "health_status": status,
            "category_scores": {cat: round(score, 1) for cat, score in category_scores.items()},
            "critical_count": counts["critical"],
            "high_count": counts["high"],
            "medium_count": counts["medium"],
            "low_count": counts["low"]
        }
