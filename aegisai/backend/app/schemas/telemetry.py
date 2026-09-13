from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class TelemetryPoint(BaseModel):
    id: str
    project_id: str
    timestamp: datetime
    metric_type: str
    value: float

    class Config:
        from_attributes = True

class TelemetryCreate(BaseModel):
    metric_type: str
    value: float
    timestamp: Optional[datetime] = None

class AnomalyItem(BaseModel):
    metric_type: str
    timestamp: datetime
    value: float
    expected_mean: float
    z_score: float
    severity: str
    description: str

class TelemetryAnalysisResponse(BaseModel):
    project_id: str
    is_demo_data: bool
    total_data_points: int
    anomalies: List[AnomalyItem]
    metrics_summary: dict
