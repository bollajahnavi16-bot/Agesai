from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class FindingResponse(BaseModel):
    id: str
    project_id: str
    analysis_id: str
    category: str
    severity: str
    title: str
    description: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    evidence: Optional[str] = None
    root_cause: Optional[str] = None
    impact: Optional[str] = None
    recommendation: Optional[str] = None
    confidence: float
    source: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
