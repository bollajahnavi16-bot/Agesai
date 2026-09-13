# AEGISAI — REST API Documentation

Base URL: `http://localhost:8000/api`
Interactive Swagger Docs: `http://localhost:8000/docs`

## Endpoints Summary

### Health
- `GET /api/health`
  - Response: `{"status": "ok", "service": "aegisai"}`

### Projects
- `POST /api/projects`
  - Body: `{"name": "...", "description": "...", "project_type": "python"}`
- `POST /api/projects/demo`
  - Instantiates Customer Support RAG Demo project and runs immediate analysis.
- `GET /api/projects`
  - Returns array of projects.
- `GET /api/projects/{project_id}`
- `DELETE /api/projects/{project_id}`
- `POST /api/projects/{project_id}/upload`
  - Upload `.zip` archive (multipart/form-data).
- `GET /api/projects/{project_id}/files`
  - Returns file tree.
- `GET /api/projects/{project_id}/files/{file_path:path}`
  - Returns file source content with redacted secrets.

### Analysis & Findings
- `POST /api/projects/{project_id}/analyze`
  - Runs multi-layered analysis pipeline.
- `GET /api/projects/{project_id}/analysis`
  - Gets latest analysis summary.
- `GET /api/projects/{project_id}/health`
  - Returns health score & category breakdowns.
- `GET /api/projects/{project_id}/architecture`
  - Returns detected components & flow step sequence.
- `GET /api/projects/{project_id}/findings`
  - Query params: `category`, `severity`.

### Incident Analyzer
- `POST /api/incidents/analyze`
  - Body: `{"error_text": "Traceback ...", "project_id": "..."}`
  - Returns root cause, impact, recommendation, confidence.

### Engineering Agent
- `POST /api/agent/chat`
  - Body: `{"project_id": "...", "message": "What should I fix first?"}`
  - Returns RAG agent answer grounded in project findings.

### Telemetry & Observability
- `GET /api/projects/{project_id}/telemetry`
- `GET /api/projects/{project_id}/telemetry/analyze`
  - Returns metrics summary and 3-sigma statistical anomalies labeled DEMO DATA.
