import os
import shutil
import uuid
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.finding import Finding
from app.models.analysis import Analysis
from app.schemas.project import ProjectCreate
from app.core.config import settings
from app.core.security import is_safe_path, redact_secrets

class ProjectService:
    @staticmethod
    def create_project(db: Session, project_in: ProjectCreate) -> Project:
        proj_id = f"proj_{uuid.uuid4().hex[:8]}"
        proj_dir = os.path.join(settings.PROJECT_STORAGE_DIR, proj_id)
        os.makedirs(proj_dir, exist_ok=True)

        db_project = Project(
            id=proj_id,
            name=project_in.name,
            description=project_in.description,
            project_type=project_in.project_type or "python",
            status="created",
            health_score=100.0,
            root_path=proj_dir
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def create_demo_project(db: Session) -> Project:
        proj_id = "proj_demo_rag"
        existing = db.query(Project).filter(Project.id == proj_id).first()
        if existing:
            return existing

        proj_dir = os.path.join(settings.PROJECT_STORAGE_DIR, proj_id)
        os.makedirs(proj_dir, exist_ok=True)

        # Copy sample_project files into uploads/proj_demo_rag
        sample_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../sample_project"))
        if os.path.exists(sample_dir):
            for item in os.listdir(sample_dir):
                s = os.path.join(sample_dir, item)
                d = os.path.join(proj_dir, item)
                if os.path.isdir(s):
                    shutil.copytree(s, d, dirs_exist_ok=True)
                else:
                    shutil.copy2(s, d)

        db_project = Project(
            id=proj_id,
            name="Customer Support RAG API",
            description="Customer support automated response service built with FastAPI, LangChain, and ChromaDB.",
            project_type="rag",
            status="created",
            health_score=100.0,
            root_path=proj_dir
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def get_project(db: Session, project_id: str) -> Optional[Project]:
        return db.query(Project).filter(Project.id == project_id).first()

    @staticmethod
    def list_projects(db: Session) -> List[Project]:
        return db.query(Project).order_by(Project.created_at.desc()).all()

    @staticmethod
    def delete_project(db: Session, project_id: str) -> bool:
        proj = db.query(Project).filter(Project.id == project_id).first()
        if not proj:
            return False

        if proj.root_path and os.path.exists(proj.root_path):
            try:
                shutil.rmtree(proj.root_path)
            except Exception:
                pass

        db.delete(proj)
        db.commit()
        return True

    @staticmethod
    def get_file_tree(db: Session, project_id: str) -> Dict[str, Any]:
        proj = ProjectService.get_project(db, project_id)
        if not proj or not proj.root_path or not os.path.exists(proj.root_path):
            return {"files": []}

        file_list = []
        for root, dirs, files in os.walk(proj.root_path):
            dirs[:] = [d for d in dirs if d not in {".git", ".venv", "venv", "__pycache__", "node_modules"}]
            for f in files:
                rel_dir = os.path.relpath(root, proj.root_path)
                rel_path = f if rel_dir == "." else os.path.join(rel_dir, f).replace("\\", "/")
                full_path = os.path.join(root, f)
                ext = os.path.splitext(f)[1].lower()
                
                file_list.append({
                    "path": rel_path,
                    "name": f,
                    "is_dir": False,
                    "size": os.path.getsize(full_path),
                    "extension": ext
                })

        return {"files": file_list}

    @staticmethod
    def get_file_content(db: Session, project_id: str, file_path: str) -> Dict[str, Any]:
        proj = ProjectService.get_project(db, project_id)
        if not proj or not proj.root_path:
            return {"error": "Project not found"}

        if not is_safe_path(proj.root_path, file_path):
            return {"error": "Invalid or dangerous file path"}

        full_path = os.path.join(proj.root_path, file_path)
        if not os.path.exists(full_path) or os.path.isdir(full_path):
            return {"error": "File does not exist"}

        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            # Redact secrets for front-end viewing safety
            safe_content = redact_secrets(content)
            
            return {
                "file_path": file_path,
                "content": safe_content,
                "lines_count": len(content.splitlines())
            }
        except Exception as e:
            return {"error": f"Failed to read file: {str(e)}"}
