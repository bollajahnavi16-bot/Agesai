import os
import zipfile
import shutil
import uuid
from typing import List, Dict, Any, Tuple
from app.core.security import is_safe_path

ALLOWED_EXTENSIONS = {".zip"}
MAX_FILE_COUNT = 5000

class ProjectScanner:
    @staticmethod
    def extract_zip_safely(zip_path: str, extract_to: str) -> Tuple[bool, str]:
        """
        Safely extracts a ZIP archive preventing path traversal attacks.
        """
        try:
            os.makedirs(extract_to, exist_ok=True)
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                for member in zip_ref.infolist():
                    # Check for path traversal attempts
                    filename = member.filename
                    if ".." in filename or filename.startswith("/") or filename.startswith("\\"):
                        return False, f"Illegal path in zip file: {filename}"
                    
                    target_path = os.path.join(extract_to, filename)
                    if not is_safe_path(extract_to, filename):
                        return False, f"Path traversal attempt detected: {filename}"
                    
                    # Prevent symlinks or unsafe permissions
                    if member.is_dir():
                        os.makedirs(target_path, exist_ok=True)
                    else:
                        os.makedirs(os.path.dirname(target_path), exist_ok=True)
                        with zip_ref.open(member) as source, open(target_path, "wb") as target:
                            shutil.copyfileobj(source, target)
            return True, extract_to
        except Exception as e:
            return False, f"Failed to extract zip file: {str(e)}"

    @staticmethod
    def scan_directory(directory_path: str) -> Dict[str, Any]:
        """
        Scans directory, returns file count, file structure, languages, and framework signatures.
        """
        files_list = []
        languages = set()
        frameworks = set()
        total_files = 0
        total_size = 0

        for root, dirs, files in os.walk(directory_path):
            # Exclude virtualenvs, node_modules, git directories
            dirs[:] = [d for d in dirs if d not in {".git", ".venv", "venv", "__pycache__", "node_modules", ".idea", ".vscode"}]
            
            for file in files:
                rel_dir = os.path.relpath(root, directory_path)
                rel_path = file if rel_dir == "." else os.path.join(rel_dir, file).replace("\\", "/")
                full_path = os.path.join(root, file)
                
                ext = os.path.splitext(file)[1].lower()
                size = os.path.getsize(full_path)
                total_size += size
                total_files += 1
                
                if ext == ".py":
                    languages.add("Python")
                elif ext in {".ts", ".tsx"}:
                    languages.add("TypeScript")
                elif ext in {".js", ".jsx"}:
                    languages.add("JavaScript")
                elif ext in {".html", ".css"}:
                    languages.add("Web")
                
                # Simple framework signature checks
                if file in {"requirements.txt", "pyproject.toml"}:
                    frameworks.add("Python Project")
                elif file == "package.json":
                    frameworks.add("Node/React Project")

                files_list.append({
                    "path": rel_path,
                    "name": file,
                    "is_dir": False,
                    "size": size,
                    "extension": ext
                })

        return {
            "total_files": total_files,
            "total_size": total_size,
            "languages": list(languages),
            "frameworks": list(frameworks),
            "files": files_list
        }
