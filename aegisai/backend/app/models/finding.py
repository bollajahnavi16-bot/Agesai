from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False)
    category = Column(String, nullable=False)  # code_quality, security, dependency, ai_rag, performance, reliability
    severity = Column(String, nullable=False)  # critical, high, medium, low
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    file_path = Column(String, nullable=True)
    line_number = Column(Integer, nullable=True)
    evidence = Column(Text, nullable=True)
    root_cause = Column(Text, nullable=True)
    impact = Column(Text, nullable=True)
    recommendation = Column(Text, nullable=True)
    confidence = Column(Float, default=0.9)  # 0.0 to 1.0
    source = Column(String, default="static_analyzer")  # python_ast, security_analyzer, rag_analyzer, etc.
    status = Column(String, default="open")  # open, resolved, ignored
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="findings")
    analysis = relationship("Analysis", back_populates="findings")
