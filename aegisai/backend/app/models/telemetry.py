from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    metric_type = Column(String, nullable=False)  # request_count, error_rate, latency, p95_latency, token_usage, estimated_cost, retrieval_latency
    value = Column(Float, nullable=False)

    project = relationship("Project", back_populates="telemetry")
