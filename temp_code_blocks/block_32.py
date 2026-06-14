import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.community import Community, CommunityMember
from app.models.resource import Resource
from app.models.assignment import Assignment
from app.models.announcement import Announcement
from app.models.post import Post
from app.models.like import Like
from app.models.comment import Comment
from app.models.notification import Notification
from app.auth import get_current_user
from app.schemas.community import CommunityResponse
from app.schemas.resource import ResourceResponse
from app.schemas.post import PostResponse
from app.schemas.dashboard import DashboardResponse, DashboardUser

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memberships = db.query(CommunityMember).filter(CommunityMember.user_id == current_user.id).all()
    community_ids = [m.community_id for m in memberships]

    communities = db.query(Community).filter(Community.id.in_(community_ids)).all()
    my_communities = [
        CommunityResponse(
            id=c.id, name=c.name, description=c.description, icon=c.icon,
            created_by=c.created_by, created_at=c.created_at,
            member_count=db.query(CommunityMember).filter(CommunityMember.community_id == c.id).count(),
            is_member=True
        )
        for c in communities
    ]

    upcoming_assignments = db.query(Assignment).filter(
        Assignment.community_id.in_(community_ids),
        Assignment.due_date >= datetime.utcnow()
    ).order_by(Assignment.due_date.asc()).limit(5).all()

    resources = db.query(Resource).filter(
        Resource.community_id.in_(community_ids)
    ).order_by(Resource.created_at.desc()).limit(5).all()
    recent_resources = [
        ResourceResponse(
            id=r.id, title=r.title, description=r.description, file_name=r.file_name,
            file_type=r.file_type, file_size=r.file_size,
            file_url=f"/uploads/resources/{os.path.basename(r.file_path)}",
            community_id=r.community_id, uploaded_by=r.uploaded_by, created_at=r.created_at
        )
        for r in resources
    ]

    posts = db.query(Post).filter(
        Post.community_id.in_(community_ids)
    ).order_by(Post.created_at.desc()).limit(5).all()
    recent_discussions = []
    for p in posts:
        like_count = db.query(Like).filter(Like.post_id == p.id).count()
        comment_count = db.query(Comment).filter(Comment.post_id == p.id).count()
        is_liked = db.query(Like).filter(
            Like.post_id == p.id, Like.user_id == current_user.id
        ).first() is not None
        recent_discussions.append(PostResponse(
            id=p.id, title=p.title, content=p.content, user_id=p.user_id,
            community_id=p.community_id, project_group_id=p.project_group_id,
            created_at=p.created_at, updated_at=p.updated_at,
            like_count=like_count, comment_count=comment_count, is_liked=is_liked
        ))

    announcements = db.query(Announcement).filter(
        (Announcement.community_id.is_(None)) | (Announcement.community_id.in_(community_ids))
    ).order_by(Announcement.pinned.desc(), Announcement.created_at.desc()).limit(5).all()

    unread_notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()

    return DashboardResponse(
        user=DashboardUser(username=current_user.username, full_name=current_user.full_name),
        my_communities=my_communities,
        upcoming_assignments=upcoming_assignments,
        recent_resources=recent_resources,
        recent_discussions=recent_discussions,
        announcements=announcements,
        unread_notifications=unread_notifications
    )