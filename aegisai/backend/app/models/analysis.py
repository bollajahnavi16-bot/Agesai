from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    status = Column(String, default="running")  # running, completed, failed
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    files_analyzed = Column(Integer, default=0)
    summary = Column(Text, nullable=True)  # JSON or text summary of overall run

    project = relationship("Project", back_populates="analyses")
    findings = relationship("Finding", back_populates="analysis", cascade="all, delete-orphan")
