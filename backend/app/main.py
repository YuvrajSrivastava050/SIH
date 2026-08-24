from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes import api_router

# Ensure all database tables are created on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_TITLE,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="""
    **NIRIKSHAN** - AI-powered Forensic Intelligence & Early-Warning Platform for MPLADS Projects.
    
    This backend API exposes explainable forensic intelligence engines:
    - 🧬 Behavioral DNA Lab
    - 📊 Adaptive Peer Benchmarking
    - 🕸️ Network Intelligence & Collusion Graph
    - ⚖️ Forensic Reasoning & Counter-Evidence Engine
    - 📁 Audit-Ready Dossier Generator
    - 🧪 Historical Case Replay Lab
    """
)

# Enable CORS for future frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount master API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", include_in_schema=False)
def root():
    return {
        "title": settings.PROJECT_NAME,
        "docs": "/docs",
        "api_health": f"{settings.API_V1_STR}/health"
    }
