from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AssignmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: datetime
    community_id: int


class AssignmentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    due_date: datetime
    community_id: int
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True