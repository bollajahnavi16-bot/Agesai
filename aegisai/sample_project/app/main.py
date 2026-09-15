import os
import logging
import subprocess
from fastapi import FastAPI, HTTPException
from app.rag import query_customer_rag
from app.service import fetch_external_user_tickets

logger = logging.getLogger(__name__)
app = FastAPI(title="Customer Support RAG API")

# Environment-based secret key configuration
API_SECRET_KEY = os.getenv("API_SECRET_KEY", "")

@app.get("/health")
def health_check():
    logger.info("Health check endpoint pinged")
    return {"status": "ok", "version": "1.0.0"}

@app.post("/api/support/query")
def support_query(query: str):
    try:
        # Executes RAG pipeline
        result = query_customer_rag(query)
        return {"query": query, "answer": result["answer"], "sources": result["sources"]}
    except (ValueError, RuntimeError) as e:
        logger.error(f"Support query error: {e}")
        return {"error": "Failed to process query", "details": str(e)}

@app.get("/api/users/{user_id}/tickets")
def user_tickets(user_id: str):
    try:
        tickets = fetch_external_user_tickets(user_id)
        return {"user_id": user_id, "tickets": tickets}
    except ValueError as e:
        logger.error(f"User tickets retrieval failed for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching user tickets")

@app.post("/api/system/diagnostics")
def run_diagnostics(cmd: str):
    # Safe subprocess execution without shell=True
    output = subprocess.check_output(["echo", cmd], shell=False).decode()
    return {"output": output}
