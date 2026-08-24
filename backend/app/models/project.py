from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class MP(Base):
    __tablename__ = "mps"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    constituency = Column(String, nullable=False)
    state = Column(String, nullable=False)
    party = Column(String, nullable=True)

    projects = relationship("Project", back_populates="mp")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    cost_sanctioned = Column(Float, nullable=False)  # in Lakhs
    cost_spent = Column(Float, nullable=False, default=0.0)
    mp_id = Column(String, ForeignKey("mps.id"), nullable=False)
    district = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False, index=True)
    sanction_date = Column(String, nullable=False)
    completion_date = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Sanctioned")
    
    contractor_id = Column(String, ForeignKey("contractors.id"), nullable=True)
    agency_id = Column(String, ForeignKey("agencies.id"), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    mp = relationship("MP", back_populates="projects")
    contractor = relationship("Contractor", back_populates="projects")
    agency = relationship("Agency", back_populates="projects")
