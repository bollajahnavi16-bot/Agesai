# AEGISAI — Security Architecture & Threat Model

## Security Principles

1. **Zero Code Execution**:
   - Uploaded project code is strictly analyzed using static Python AST (`ast.parse`) and regex string pattern matching.
   - Code is **never executed**, compiled into binary, or imported into the running backend process.

2. **Secure Archive Ingestion**:
   - ZIP file extractions are subjected to strict path validation (`is_safe_path`).
   - Rejects any file path containing relative traversal (`..`) or leading absolute path markers (`/`, `\`).
   - Restricts file extension to `.zip`.

3. **No Frontend Key Exposure**:
   - API keys (such as `OPENAI_API_KEY`) are exclusively processed in the Python backend.
   - Frontend never receives or stores API keys.
   - File viewing redacts matching API keys (`sk-...`) and raw secrets prior to sending JSON responses.

4. **Offline Fallback Guarantee (Demo Mode)**:
   - When no external LLM API key exists in `.env`, the system defaults to a deterministic local provider without making external network calls.
