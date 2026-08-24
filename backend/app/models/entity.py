from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.core.database import Base


class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    pan = Column(String, nullable=True, index=True)
    gstin = Column(String, nullable=True, index=True)
    registered_address = Column(String, nullable=True)
    registration_date = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Active")

    projects = relationship("Project", back_populates="contractor")


class Agency(Base):
    __tablename__ = "agencies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    district = Column(String, nullable=False)
    state = Column(String, nullable=False)

    projects = relationship("Project", back_populates="agency")
