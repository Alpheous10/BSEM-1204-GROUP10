from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AnnouncementCreate(BaseModel):
    title: str
    content: str
    community_id: Optional[int] = None
    pinned: bool = False


class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    community_id: Optional[int] = None
    pinned: bool
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True