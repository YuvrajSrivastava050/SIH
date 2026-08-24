from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from app.core.database import Base


class HistoricalCase(Base):
    __tablename__ = "historical_cases"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    official_investigation_date = Column(String, nullable=False)
    cutoff_date = Column(String, nullable=False)
    target_project_id = Column(String, nullable=False)
    summary_findings = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
