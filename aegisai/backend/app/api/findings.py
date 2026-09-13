from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.finding import FindingResponse
from app.services.analysis_service import AnalysisService

router = APIRouter(prefix="/projects", tags=["Findings"])

@router.get("/{project_id}/findings", response_model=List[FindingResponse])
def get_project_findings(
    project_id: str,
    category: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    findings = AnalysisService.get_findings(db, project_id, category=category, severity=severity)
    return findings
