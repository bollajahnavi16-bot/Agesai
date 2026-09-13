from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.analysis import AnalysisResponse, HealthScoreResponse, ArchitectureResponse
from app.services.project_service import ProjectService
from app.services.analysis_service import AnalysisService
from app.services.scoring_service import ScoringService

router = APIRouter(prefix="/projects", tags=["Analysis"])

@router.post("/{project_id}/analyze", response_model=AnalysisResponse)
def analyze_project(project_id: str, db: Session = Depends(get_db)):
    proj = ProjectService.get_project(db, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        analysis = AnalysisService.run_analysis(db, project_id)
        if not analysis:
            raise HTTPException(status_code=400, detail="Unable to analyze project directory")
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/{project_id}/analysis", response_model=AnalysisResponse)
def get_latest_analysis(project_id: str, db: Session = Depends(get_db)):
    analysis = AnalysisService.get_latest_analysis(db, project_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="No analysis run found for this project")
    return analysis

@router.get("/{project_id}/health", response_model=HealthScoreResponse)
def get_project_health(project_id: str, db: Session = Depends(get_db)):
    proj = ProjectService.get_project(db, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    findings = AnalysisService.get_findings(db, project_id)
    raw_findings = [
        {
            "category": f.category,
            "severity": f.severity
        }
        for f in findings
    ]

    score_dict = ScoringService.calculate_health_scores(raw_findings)
    return HealthScoreResponse(**score_dict)

@router.get("/{project_id}/architecture", response_model=ArchitectureResponse)
def get_project_architecture(project_id: str, db: Session = Depends(get_db)):
    proj = ProjectService.get_project(db, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    arch = AnalysisService.get_architecture(db, project_id)
    return ArchitectureResponse(**arch)
