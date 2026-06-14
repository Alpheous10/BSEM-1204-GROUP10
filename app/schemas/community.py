from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CommunityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class CommunityResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    created_by: int
    created_at: datetime
    member_count: int = 0
    is_member: bool = False

    class Config:
        from_attributes = True


class CommunityMemberResponse(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str

    class Config:
        from_attributes = True