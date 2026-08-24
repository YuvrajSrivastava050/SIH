from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class MPSchema(BaseModel):
    id: str
    name: str
    constituency: str
    state: str
    party: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ContractorSchema(BaseModel):
    id: str
    name: str
    pan: Optional[str] = None
    gstin: Optional[str] = None
    registered_address: Optional[str] = None
    status: str

    model_config = ConfigDict(from_attributes=True)


class AgencySchema(BaseModel):
    id: str
    name: str
    department: str
    district: str
    state: str

    model_config = ConfigDict(from_attributes=True)


class ProjectSchema(BaseModel):
    id: str
    title: str
    category: str
    cost_sanctioned: float
    cost_spent: float
    mp_id: str
    district: str
    state: str
    sanction_date: str
    completion_date: Optional[str] = None
    status: str
    contractor_id: Optional[str] = None
    agency_id: Optional[str] = None
    description: Optional[str] = None
    
    mp: Optional[MPSchema] = None
    contractor: Optional[ContractorSchema] = None
    agency: Optional[AgencySchema] = None

    model_config = ConfigDict(from_attributes=True)


class ProjectListResponse(BaseModel):
    total: int
    projects: List[ProjectSchema]
