import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_demo_project_analysis_and_findings():
    # 1. Instantiate demo project
    demo_res = client.post("/api/projects/demo")
    assert demo_res.status_code == 201
    proj_id = demo_res.json()["id"]

    # 2. Run explicit analysis
    anl_res = client.post(f"/api/projects/{proj_id}/analyze")
    assert anl_res.status_code == 200
    anl_data = anl_res.json()
    assert anl_data["status"] == "completed"
    assert anl_data["files_analyzed"] > 0

    # 3. Check Health Score
    health_res = client.get(f"/api/projects/{proj_id}/health")
    assert health_res.status_code == 200
    health_data = health_res.json()
    assert 0 <= health_data["overall_score"] <= 100

    # 4. Check Findings
    findings_res = client.get(f"/api/projects/{proj_id}/findings")
    assert findings_res.status_code == 200
    findings = findings_res.json()
    assert len(findings) > 0
    assert any(f["category"] == "ai_rag" for f in findings)
    assert any(f["category"] == "security" for f in findings)

def test_agent_chat_endpoint():
    demo_res = client.post("/api/projects/demo")
    proj_id = demo_res.json()["id"]

    chat_res = client.post(
        "/api/agent/chat",
        json={"project_id": proj_id, "message": "What should I fix first?"}
    )
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert len(chat_data["response"]) > 0
    assert "remediation priority" in chat_data["response"].lower() or "fix" in chat_data["response"].lower()
