from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

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

    model_config = ConfigDict(from_attributes=True)

class FileItem(BaseModel):
    path: str
    name: str
    is_dir: bool
    size: Optional[int] = 0
    extension: Optional[str] = ""

class ProjectTreeResponse(BaseModel):
    files: List[FileItem]
