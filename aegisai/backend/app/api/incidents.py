from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.incident import IncidentRequest, IncidentAnalysisResult
from app.services.incident_service import IncidentService

router = APIRouter(prefix="/incidents", tags=["Incident Analyzer"])

@router.post("/analyze", response_model=IncidentAnalysisResult)
def analyze_incident_log(payload: IncidentRequest, db: Session = Depends(get_db)):
    result = IncidentService.analyze_incident(db, payload.error_text, payload.project_id)
    return IncidentAnalysisResult(**result)
