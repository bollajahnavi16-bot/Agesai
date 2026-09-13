# AEGISAI — System Architecture & Design Specification

## Overview
AEGISAI is an end-to-end AI Engineering Intelligence Platform designed to inspect codebases, analyze multi-layer risks (Python AST static analysis, security credentials, dependency manifests, AI & RAG architectural patterns), compute deterministic health scores, analyze incidents/logs, and present actionable engineering recommendations via an interactive AI agent.

```
+-------------------------------------------------------------------------+
|                           React + Vite Frontend                         |
|   Landing | Dashboard | Projects | Files | Architecture | Agent | Ops   |
+-------------------------------------------------------------------------+
                                    | REST API (HTTP)
                                    v
+-------------------------------------------------------------------------+
|                             FastAPI Backend                             |
|  Projects API | Analysis API | Incidents API | Agent RAG | Telemetry    |
+-------------------------------------------------------------------------+
        |                     |                     |
        v                     v                     v
+---------------+     +-----------------+   +------------------+
| SQLite Engine |     | Multi-Analyzer  |   | AI Provider      |
|  (SQLAlchemy) |     | - Python AST    |   |  Abstraction     |
+---------------+     | - Security Reg  |   +------------------+
                      | - Dependencies  |     |              |
                      | - AI Component  |     v              v
                      | - RAG Analyzer  |  OpenAI API    Demo Mode
                      +-----------------+  (If Key)     (Offline)
```

## Core Workflows
1. **Project Registration / Demo Ingestion**: User uploads a ZIP file or launches the 1-click **Customer Support RAG Demo**.
2. **Scanner & AST Extraction**: Files are scanned into file trees. `.py` files are parsed into Python Abstract Syntax Trees (`ast.parse`).
3. **Multi-Analyzer Pipeline**:
   - `PythonASTAnalyzer`: Unused imports, bare/broad exceptions, missing timeouts, complex functions, debug calls.
   - `SecurityAnalyzer`: Exposed API keys, SQL string formatting, `shell=True` subprocesses, wildcard CORS.
   - `DependencyAnalyzer`: Inventory manifests (`requirements.txt`, `package.json`) and flag unpinned dependencies.
   - `AIDetector`: Scan imports for OpenAI, LangChain, LlamaIndex, ChromaDB, FAISS, Pinecone.
   - `RAGAnalyzer`: Check chunk size (>2000), missing chunk overlap (`overlap=0`), high `top_k` (>10), unfiltered vector search, missing retrieval evaluation.
4. **Scoring Engine**: Deducts weighted penalties from 100 base per category.
5. **AI Summary & Engineering Agent**: Summarizes findings and answers contextual user questions using ground-truth findings.
