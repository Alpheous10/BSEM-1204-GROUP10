from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ProjectGroupCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectGroupResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_by: int
    created_at: datetime
    member_count: int = 0
    is_member: bool = False

    class Config:
        from_attributes = True