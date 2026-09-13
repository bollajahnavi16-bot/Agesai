import os
import io
import zipfile
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_zip_path_traversal_rejection():
    # Create project
    proj_res = client.post("/api/projects", json={"name": "Security Test Proj"})
    proj_id = proj_res.json()["id"]

    # Construct malicious zip containing path traversal filename
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr('../../malicious_file.py', 'print("hacked")')
    zip_buffer.seek(0)

    # Upload malicious zip
    upload_res = client.post(
        f"/api/projects/{proj_id}/upload",
        files={"file": ("malicious.zip", zip_buffer, "application/zip")}
    )
    assert upload_res.status_code == 400
    assert "Illegal path" in upload_res.json()["detail"] or "traversal" in upload_res.json()["detail"]
