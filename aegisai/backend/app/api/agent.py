from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.agent import AgentChatRequest, AgentChatResponse
from app.services.project_service import ProjectService
from app.services.analysis_service import AnalysisService
from app.ai.agent import get_ai_provider
from app.core.config import settings

router = APIRouter(prefix="/agent", tags=["Engineering Agent"])

@router.post("/chat", response_model=AgentChatResponse)
def agent_chat(payload: AgentChatRequest, db: Session = Depends(get_db)):
    proj = ProjectService.get_project(db, payload.project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    findings = AnalysisService.get_findings(db, payload.project_id)
    raw_findings = [
        {
            "category": f.category,
            "severity": f.severity,
            "title": f.title,
            "description": f.description,
            "file_path": f.file_path,
            "line_number": f.line_number,
            "root_cause": f.root_cause,
            "recommendation": f.recommendation
        }
        for f in findings
    ]

    latest_analysis = AnalysisService.get_latest_analysis(db, payload.project_id)
    arch = AnalysisService.get_architecture(db, payload.project_id)

    project_context = {
        "name": proj.name,
        "project_type": proj.project_type,
        "health_score": proj.health_score,
        "status": proj.status,
        "summary": latest_analysis.summary if latest_analysis else "No analysis summary available.",
        "architecture_flow": arch.get("flow", []),
        "detected_components": [c.get("name") for c in arch.get("components", []) if c.get("detected")],
        "findings": raw_findings
    }

    ai_provider = get_ai_provider()
    ans = ai_provider.answer_project_question(project_context, payload.message)
    mode = "openai" if settings.OPENAI_API_KEY and not settings.OPENAI_API_KEY.startswith("dummy") else "demo"

    return AgentChatResponse(
        project_id=payload.project_id,
        message=payload.message,
        response=ans,
        context_used=[f"Findings ({len(findings)})", f"Health Score ({proj.health_score})", "Architecture Flow"],
        mode=mode
    )
