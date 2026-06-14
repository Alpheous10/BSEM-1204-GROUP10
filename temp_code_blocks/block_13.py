from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ResourceResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    file_name: str
    file_type: str
    file_size: int
    file_url: str
    community_id: Optional[int] = None
    uploaded_by: int
    created_at: datetime

    class Config:
        from_attributes = True