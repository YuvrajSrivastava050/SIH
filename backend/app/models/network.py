from sqlalchemy import Column, Integer, String, Float, Text
from app.core.database import Base


class EntityRelationship(Base):
    __tablename__ = "entity_relationships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_id = Column(String, nullable=False, index=True)
    source_type = Column(String, nullable=False)  # PROJECT, CONTRACTOR, AGENCY, ADDRESS, PAN, GSTIN
    target_id = Column(String, nullable=False, index=True)
    target_type = Column(String, nullable=False)
    relationship_type = Column(String, nullable=False, index=True)  # SHARED_ADDRESS, SHARED_PAN, SHARED_GSTIN, CONTRACTOR_FOR
    confidence_score = Column(Float, default=1.0)
    metadata_json = Column(Text, nullable=True)
