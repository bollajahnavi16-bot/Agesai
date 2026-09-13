from typing import Optional, List
from pydantic import BaseModel

class IncidentRequest(BaseModel):
    error_text: str
    project_id: Optional[str] = None

class IncidentAnalysisResult(BaseModel):
    classification: str
    probable_root_cause: str
    evidence: str
    impact: str
    recommendation: str
    confidence: float
    limitations: str
    detected_stack_frames: Optional[List[str]] = []
