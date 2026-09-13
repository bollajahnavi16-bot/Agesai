import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_incident_analyzer():
    error_log = """
    Traceback (most recent call last):
      File "/app/service.py", line 12, in fetch_external_user_tickets
        response = requests.get(f"{CRM_ENDPOINT}?user_id={user_id}")
    requests.exceptions.ConnectTimeout: HTTPSConnectionPool(host='crm.internal.example.com', port=443): Read timed out.
    """

    res = client.post("/api/incidents/analyze", json={"error_text": error_log})
    assert res.status_code == 200
    data = res.json()
    assert "Timeout" in data["classification"] or "Network" in data["classification"]
    assert "timeout" in data["recommendation"].lower()
    assert data["confidence"] > 0.8
