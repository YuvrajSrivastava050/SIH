from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.project import Project
from app.schemas.project import ProjectSchema, ProjectListResponse

router = APIRouter()


@router.get("", response_model=ProjectListResponse, summary="List Projects")
def list_projects(
    state: Optional[str] = None,
    district: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Retrieve all MPLADS projects with optional filtering by state, district, or category.
    """
    query = db.query(Project)
    
    if state:
        query = query.filter(Project.state.ilike(f"%{state}%"))
    if district:
        query = query.filter(Project.district.ilike(f"%{district}%"))
    if category:
        query = query.filter(Project.category.ilike(f"%{category}%"))

    total = query.count()
    projects = query.offset(offset).limit(limit).all()

    return ProjectListResponse(total=total, projects=projects)


@router.get("/{project_id}", response_model=ProjectSchema, summary="Get Project Details")
def get_project(project_id: str, db: Session = Depends(get_db)):
    """
    Retrieve single MPLADS project details by ID.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project with ID '{project_id}' not found.")
    return project
