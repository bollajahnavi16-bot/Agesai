import os
import uuid
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.analysis import Analysis
from app.models.finding import Finding
from app.analyzers.project_scanner import ProjectScanner
from app.analyzers.python_analyzer import PythonAnalyzer
from app.analyzers.security_analyzer import SecurityAnalyzer
from app.analyzers.dependency_analyzer import DependencyAnalyzer
from app.analyzers.ai_detector import AIDetector
from app.analyzers.rag_analyzer import RAGAnalyzer
from app.services.scoring_service import ScoringService
from app.ai.agent import get_ai_provider

class AnalysisService:
    @staticmethod
    def run_analysis(db: Session, project_id: str) -> Optional[Analysis]:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project or not project.root_path or not os.path.exists(project.root_path):
            return None

        # Update project status
        project.status = "analyzing"
        db.commit()

        analysis_id = f"anl_{uuid.uuid4().hex[:8]}"
        analysis_run = Analysis(
            id=analysis_id,
            project_id=project_id,
            status="running",
            started_at=datetime.utcnow()
        )
        db.add(analysis_run)
        db.commit()

        all_findings = []
        files_scanned_count = 0

        try:
            # 1. Project Scan
            scan_res = ProjectScanner.scan_directory(project.root_path)
            files_scanned_count = scan_res["total_files"]

            # 2. File-by-file Python AST and Security Analysis
            for root, dirs, files in os.walk(project.root_path):
                dirs[:] = [d for d in dirs if d not in {".git", ".venv", "venv", "node_modules", "__pycache__"}]
                for file in files:
                    full_path = os.path.join(root, file)
                    
                    if file.endswith(".py"):
                        # Python AST findings
                        py_findings = PythonAnalyzer.analyze_file(full_path, project.root_path)
                        all_findings.extend(py_findings)
                        
                        # Security findings
                        sec_findings = SecurityAnalyzer.analyze_file(full_path, project.root_path)
                        all_findings.extend(sec_findings)

            # 3. Dependency Inventory & Vulnerability Check
            dep_inventory, dep_findings = DependencyAnalyzer.analyze_project(project.root_path)
            all_findings.extend(dep_findings)

            # 4. AI / ML Detector
            ai_res = AIDetector.detect_components(project.root_path)

            # 5. RAG Pattern Analyzer
            rag_findings = RAGAnalyzer.analyze_project(project.root_path)
            all_findings.extend(rag_findings)

            # Deduplicate findings based on file_path, line_number, title
            unique_findings = []
            seen = set()
            for f in all_findings:
                key = (f.get("file_path"), f.get("line_number"), f.get("title"))
                if key not in seen:
                    seen.add(key)
                    unique_findings.append(f)

            # 6. Calculate Health Scores
            scores = ScoringService.calculate_health_scores(unique_findings)

            # 7. Generate Summary via AI Provider
            ai_provider = get_ai_provider()
            summary_text = ai_provider.analyze_findings(project.name, unique_findings)

            # 8. Persist Findings to Database
            for f in unique_findings:
                finding_db = Finding(
                    id=f"fnd_{uuid.uuid4().hex[:8]}",
                    project_id=project_id,
                    analysis_id=analysis_id,
                    category=f.get("category", "code_quality"),
                    severity=f.get("severity", "low"),
                    title=f.get("title", "Issue"),
                    description=f.get("description", ""),
                    file_path=f.get("file_path"),
                    line_number=f.get("line_number"),
                    evidence=f.get("evidence"),
                    root_cause=f.get("root_cause"),
                    impact=f.get("impact"),
                    recommendation=f.get("recommendation"),
                    confidence=f.get("confidence", 0.9),
                    source=f.get("source", "static_analyzer"),
                    status="open"
                )
                db.add(finding_db)

            # 9. Complete Analysis Record
            analysis_run.status = "completed"
            analysis_run.completed_at = datetime.utcnow()
            analysis_run.files_analyzed = files_scanned_count
            analysis_run.summary = summary_text

            # Update Project Model
            project.status = "completed"
            project.health_score = scores["overall_score"]
            project.updated_at = datetime.utcnow()

            db.commit()
            db.refresh(analysis_run)
            return analysis_run

        except Exception as e:
            analysis_run.status = "failed"
            project.status = "failed"
            db.commit()
            raise e

    @staticmethod
    def get_latest_analysis(db: Session, project_id: str) -> Optional[Analysis]:
        return db.query(Analysis).filter(Analysis.project_id == project_id).order_by(Analysis.started_at.desc()).first()

    @staticmethod
    def get_findings(db: Session, project_id: str, category: Optional[str] = None, severity: Optional[str] = None) -> List[Finding]:
        query = db.query(Finding).filter(Finding.project_id == project_id)
        if category:
            query = query.filter(Finding.category == category)
        if severity:
            query = query.filter(Finding.severity == severity)
        return query.order_by(Finding.severity.asc()).all()

    @staticmethod
    def get_architecture(db: Session, project_id: str) -> Dict[str, Any]:
        proj = db.query(Project).filter(Project.id == project_id).first()
        if not proj or not proj.root_path:
            return {"project_id": project_id, "components": [], "flow": []}

        ai_res = AIDetector.detect_components(proj.root_path)
        components = ai_res.get("details", [])

        # Build detected component list or mark standard architecture
        flow = ["Client HTTP Request", "FastAPI Application", "Analysis Engine / Logic", "Database"]
        if "ChromaDB" in ai_res.get("detected_components", []) or "LangChain" in ai_res.get("detected_components", []):
            flow = [
                "User Query Input",
                "FastAPI Support Router",
                "OpenAIEmbeddings Vectorization",
                "ChromaDB Similarity Search",
                "ChatOpenAI LLM Generation",
                "Response Synthesis"
            ]

        return {
            "project_id": project_id,
            "components": components,
            "flow": flow
        }
