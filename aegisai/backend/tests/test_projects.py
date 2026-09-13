import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "aegisai"}

def test_create_and_list_project():
    # Create project
    create_res = client.post(
        "/api/projects",
        json={"name": "Test Project", "description": "Unit testing project", "project_type": "python"}
    )
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["name"] == "Test Project"
    project_id = data["id"]

    # List projects
    list_res = client.get("/api/projects")
    assert list_res.status_code == 200
    assert any(p["id"] == project_id for p in list_res.json())

    # Get single project
    get_res = client.get(f"/api/projects/{project_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Test Project"

def test_create_demo_project():
    res = client.post("/api/projects/demo")
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Customer Support RAG API"
    assert data["project_type"] == "rag"
