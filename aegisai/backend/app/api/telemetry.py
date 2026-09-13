import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.telemetry import Telemetry
from app.schemas.telemetry import TelemetryPoint, TelemetryCreate, TelemetryAnalysisResponse
from app.services.telemetry_service import TelemetryService
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["Telemetry & Observability"])

@router.post("/{project_id}/telemetry", response_model=TelemetryPoint)
def add_telemetry(project_id: str, payload: TelemetryCreate, db: Session = Depends(get_db)):
    proj = ProjectService.get_project(db, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    item = Telemetry(
        id=f"tel_{uuid.uuid4().hex[:8]}",
        project_id=project_id,
        timestamp=payload.timestamp or datetime.utcnow(),
        metric_type=payload.metric_type,
        value=payload.value
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/{project_id}/telemetry", response_model=List[TelemetryPoint])
def get_telemetry(project_id: str, db: Session = Depends(get_db)):
    proj = ProjectService.get_project(db, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    return TelemetryService.get_telemetry(db, project_id)

@router.get("/{project_id}/telemetry/analyze", response_model=TelemetryAnalysisResponse)
def analyze_telemetry_anomalies(project_id: str, db: Session = Depends(get_db)):
    proj = ProjectService.get_project(db, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    return TelemetryService.analyze_anomalies(db, project_id)
