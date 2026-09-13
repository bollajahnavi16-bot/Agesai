# AEGISAI — AI Engineering Intelligence Platform

> **Find the problem. Understand the cause. Fix it faster.**

AEGISAI is an end-to-end full-stack AI Engineering Intelligence Platform designed to inspect software projects and AI/ML codebases, identify static security vulnerabilities and RAG architecture anti-patterns, evaluate holistic project health scores, analyze incidents/logs, and provide interactive contextual engineering assistance.

---

## 🌟 Key Features

- **Multi-Layer Static Analysis**: AST-level checks for bare/broad exceptions, missing network timeouts, complex functions, dangerous `eval`/`exec`, and `subprocess` shell calls.
- **RAG Architecture Inspection**: Scans document chunk size, chunk overlap parameters, vector retriever `top_k` limits, and metadata filtering.
- **Security Vulnerability Scanner**: Regex & AST detection for exposed API credentials (`sk-...`, AWS keys), raw SQL string construction, and wildcard CORS.
- **Deterministic Health Score Engine**: Category health breakdowns (Security, Reliability, AI/RAG, Code Quality, Performance, Maintainability) with weighted severity penalties clamped between 0–100.
- **Incident & Traceback Analyzer**: Parses raw stack traces and error logs to return root cause, evidence, impact, and recommendations.
- **Engineering Agent**: Contextual AI assistant grounded strictly in project findings and architecture context.
- **Observability & Anomaly Detection**: Visualizes latency, request rates, error rates, and flags 3-sigma statistical anomalies labeled `DEMO DATA`.
- **Offline Demo Mode**: Zero-dependency deterministic offline operation when no `OPENAI_API_KEY` is present.

---

## 🏗️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router DOM.
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, SQLite (PostgreSQL-ready).
- **AI Layer**: Dual provider abstraction (`OpenAIProvider` + deterministic `DemoProvider`).
- **Analysis**: Pure Python AST parsing (`ast.parse`) & static regex analyzers. Zero code execution.

---

## 📁 Repository Structure

```
aegisai/
│
├── frontend/             # React + Vite + TypeScript + Tailwind UI
│   ├── src/
│   │   ├── components/   # Dashboard, Projects, Code, Agent, Observability
│   │   ├── pages/        # Landing, Dashboard, Projects, Overview, Issues, Files, etc.
│   │   ├── services/     # Centralized API Client (Axios)
│   │   └── hooks/        # Custom React Hooks
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # FastAPI Python Service
│   ├── app/
│   │   ├── main.py       # FastAPI Entrypoint & CORS setup
│   │   ├── core/         # DB & Security Path Sanitization
│   │   ├── models/       # SQLAlchemy Models (Project, Analysis, Finding, Telemetry)
│   │   ├── schemas/      # Pydantic Schemas
│   │   ├── analyzers/    # AST, Security, Dependency, AI, RAG Analyzers
│   │   ├── services/     # Project, Analysis, Scoring, Incident, Telemetry Services
│   │   └── ai/           # AI Provider Abstraction (OpenAI + Demo Mode)
│   ├── tests/            # Pytest test suite
│   └── requirements.txt
│
├── sample_project/       # Customer Support RAG API Sample Project
├── docs/                 # ARCHITECTURE.md, API.md, SECURITY.md
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Run

```bash
cd aegisai/backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server (runs on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

FastAPI Interactive Docs will be accessible at: `http://localhost:8000/docs`

---

### 2. Frontend Setup & Run

In a separate terminal:

```bash
cd aegisai/frontend

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### 3. Testing the Backend

```bash
cd aegisai/backend
pytest
```

---

## 🔒 Security & Safety

- **Zero Code Execution**: Uploaded source code is statically analyzed via Python AST parsing and **never executed**.
- **Path Traversal Defense**: ZIP extractions strictly enforce path containment to prevent directory traversal attacks (`..`).
- **No Secret Leakage**: File viewers automatically redact API keys and sensitive credentials.
