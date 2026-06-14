from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PostBase(BaseModel):
    title: str
    content: str


class PostCreate(PostBase):
    community_id: Optional[int] = None
    project_group_id: Optional[int] = None


class PostResponse(PostBase):
    id: int
    user_id: int
    community_id: Optional[int] = None
    project_group_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    like_count: int = 0
    comment_count: int = 0
    is_liked: bool = False

    class Config:
        from_attributes = True