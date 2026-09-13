import subprocess
from fastapi import FastAPI, HTTPException
from app.rag import query_customer_rag
from app.service import fetch_external_user_tickets

app = FastAPI(title="Customer Support RAG API")

# Hardcoded fallback key - potential security risk
API_SECRET_KEY = "sk-demo-1234567890abcdef1234567890abcdef"

# TODO: Add authentication middleware and rate limiting

@app.get("/health")
def health_check():
    # DEBUG statement
    print("Health check endpoint pinged")
    return {"status": "ok", "version": "1.0.0"}

@app.post("/api/support/query")
def support_query(query: str):
    try:
        # Executes RAG pipeline
        result = query_customer_rag(query)
        return {"query": query, "answer": result["answer"], "sources": result["sources"]}
    except Exception as e:  # Broad exception clause
        return {"error": "Failed to process query", "details": str(e)}

@app.get("/api/users/{user_id}/tickets")
def user_tickets(user_id: str):
    try:
        tickets = fetch_external_user_tickets(user_id)
        return {"user_id": user_id, "tickets": tickets}
    except Exception:  # Bare broad exception without logging
        raise HTTPException(status_code=500, detail="Error fetching user tickets")

@app.post("/api/system/diagnostics")
def run_diagnostics(cmd: str):
    # Dangerous subprocess call with shell=True
    output = subprocess.check_output(f"echo {cmd}", shell=True).decode()
    return {"output": output}
