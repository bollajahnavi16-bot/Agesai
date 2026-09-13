from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.ai.agent import get_ai_provider
from app.models.project import Project

class IncidentService:
    @staticmethod
    def analyze_incident(db: Session, error_text: str, project_id: Optional[str] = None) -> Dict[str, Any]:
        project_context = None
        if project_id:
            proj = db.query(Project).filter(Project.id == project_id).first()
            if proj:
                project_context = {
                    "name": proj.name,
                    "health_score": proj.health_score
                }

        ai_provider = get_ai_provider()
        res = ai_provider.analyze_incident(error_text, project_context)
        return res
