import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectTreeResponse
from app.services.project_service import ProjectService
from app.services.analysis_service import AnalysisService
from app.analyzers.project_scanner import ProjectScanner

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    return ProjectService.create_project(db, project_in)

@router.post("/demo", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_demo_project(db: Session = Depends(get_db)):
    proj = ProjectService.create_demo_project(db)
    # Automatically trigger initial analysis so demo is ready out of the box
    try:
        AnalysisService.run_analysis(db, proj.id)
    except Exception:
        pass
    db.refresh(proj)
    return proj

@router.get("", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return ProjectService.list_projects(db)

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    proj = ProjectService.get_project(db, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.delete("/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    success = ProjectService.delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/upload")
def upload_project_zip(
    project_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    proj = ProjectService.get_project(db, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Invalid ZIP file. Only .zip archives are allowed.")

    # Save zip temporarily
    temp_zip = os.path.join(proj.root_path, "uploaded_archive.zip")
    with open(temp_zip, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Secure extraction
    success, msg = ProjectScanner.extract_zip_safely(temp_zip, proj.root_path)
    
    # Remove temp zip file
    if os.path.exists(temp_zip):
        os.remove(temp_zip)

    if not success:
        raise HTTPException(status_code=400, detail=msg)

    # Trigger automatic static analysis
    try:
        AnalysisService.run_analysis(db, proj.id)
    except Exception as e:
        pass

    db.refresh(proj)
    return {"message": "ZIP extracted and analyzed successfully", "project_id": proj.id}

@router.get("/{project_id}/files")
def get_project_files(project_id: str, db: Session = Depends(get_db)):
    return ProjectService.get_file_tree(db, project_id)

@router.get("/{project_id}/files/{file_path:path}")
def get_project_file_content(project_id: str, file_path: str, db: Session = Depends(get_db)):
    res = ProjectService.get_file_content(db, project_id, file_path)
    if "error" in res:
        raise HTTPException(status_code=400, detail=res["error"])
    return res
