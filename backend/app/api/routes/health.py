from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/health", summary="Backend System Health Check")
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "MVP Backend"
    }
