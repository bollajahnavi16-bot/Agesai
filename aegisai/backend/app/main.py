import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.projects import router as projects_router
from app.api.analysis import router as analysis_router
from app.api.findings import router as findings_router
from app.api.incidents import router as incidents_router
from app.api.agent import router as agent_router
from app.api.telemetry import router as telemetry_router

# Ensure storage directory exists
os.makedirs(settings.PROJECT_STORAGE_DIR, exist_ok=True)

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AEGISAI — AI Engineering Intelligence Platform Backend Service",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Endpoint
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "aegisai"
    }

# Include API Routers
app.include_router(projects_router, prefix=settings.API_PREFIX)
app.include_router(analysis_router, prefix=settings.API_PREFIX)
app.include_router(findings_router, prefix=settings.API_PREFIX)
app.include_router(incidents_router, prefix=settings.API_PREFIX)
app.include_router(agent_router, prefix=settings.API_PREFIX)
app.include_router(telemetry_router, prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
