from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    project_type: Optional[str] = "python"

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    project_type: str
    created_at: datetime
    updated_at: datetime
    status: str
    health_score: float

    class Config:
        from_attributes = True

class FileItem(BaseModel):
    path: str
    name: str
    is_dir: bool
    size: Optional[int] = 0
    extension: Optional[str] = ""

class ProjectTreeResponse(BaseModel):
    files: List[FileItem]
