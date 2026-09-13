from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    project_type = Column(String, default="python")  # e.g., python, rag, fullstack
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(String, default="created")  # created, analyzing, completed, failed
    health_score = Column(Float, default=100.0)
    root_path = Column(String, nullable=True)

    analyses = relationship("Analysis", back_populates="project", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="project", cascade="all, delete-orphan")
    telemetry = relationship("Telemetry", back_populates="project", cascade="all, delete-orphan")
