from typing import Generator
from app.core.database import SessionLocal


def get_db() -> Generator:
    """
    Dependency helper to provide a database session to FastAPI path operations.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
