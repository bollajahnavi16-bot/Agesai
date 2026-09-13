from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.schemas.finding import FindingResponse

class AnalysisResponse(BaseModel):
    id: str
    project_id: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    files_analyzed: int
    summary: Optional[str] = None

    class Config:
        from_attributes = True

class HealthBreakdown(BaseModel):
    code_quality: float
    security: float
    performance: float
    reliability: float
    ai_rag: float
    maintainability: float

class HealthScoreResponse(BaseModel):
    overall_score: float
    health_status: str  # Excellent, Good, Fair, Poor, Critical
    category_scores: HealthBreakdown
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int

class ArchitectureComponent(BaseModel):
    name: str
    category: str
    detected: bool
    confidence: float
    details: Optional[str] = None

class ArchitectureResponse(BaseModel):
    project_id: str
    components: List[ArchitectureComponent]
    flow: List[str]
