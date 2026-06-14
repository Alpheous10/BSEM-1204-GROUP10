from pydantic import BaseModel
from typing import List, Optional

from app.schemas.community import CommunityResponse
from app.schemas.resource import ResourceResponse
from app.schemas.assignment import AssignmentResponse
from app.schemas.announcement import AnnouncementResponse
from app.schemas.post import PostResponse


class DashboardUser(BaseModel):
    username: str
    full_name: Optional[str] = None


class DashboardResponse(BaseModel):
    user: DashboardUser
    my_communities: List[CommunityResponse]
    upcoming_assignments: List[AssignmentResponse]
    recent_resources: List[ResourceResponse]
    recent_discussions: List[PostResponse]
    announcements: List[AnnouncementResponse]
    unread_notifications: int