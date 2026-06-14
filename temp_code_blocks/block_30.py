from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.announcement import Announcement
from app.models.community import CommunityMember
from app.models.user import User
from app.schemas.announcement import AnnouncementCreate, AnnouncementResponse
from app.auth import get_current_user
from app.notifications_util import create_notification

router = APIRouter(prefix="/announcements", tags=["Announcements"])


@router.post("/", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
def create_announcement(
    announcement: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if announcement.community_id is not None:
        member = db.query(CommunityMember).filter(
            CommunityMember.community_id == announcement.community_id,
            CommunityMember.user_id == current_user.id
        ).first()
        if not member or member.role != "admin":
            raise HTTPException(status_code=403, detail="Only community admins can post announcements here")

        members = db.query(CommunityMember).filter(CommunityMember.community_id == announcement.community_id).all()
        recipients = [m.user_id for m in members if m.user_id != current_user.id]
    else:
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Only platform admins can post platform-wide announcements")
        recipients = [u.id for u in db.query(User).filter(User.id != current_user.id).all()]

    new_announcement = Announcement(
        title=announcement.title,
        content=announcement.content,
        community_id=announcement.community_id,
        pinned=announcement.pinned,
        created_by=current_user.id
    )
    db.add(new_announcement)
    db.commit()
    db.refresh(new_announcement)

    for user_id in recipients:
        create_notification(
            db, user_id, "announcement",
            f"New announcement: {announcement.title}",
            related_id=new_announcement.id
        )

    return new_announcement


@router.get("/", response_model=List[AnnouncementResponse])
def get_announcements(
    community_id: Optional[int] = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Announcement)
    if community_id is not None:
        query = query.filter(Announcement.community_id == community_id)
    else:
        query = query.filter(Announcement.community_id.is_(None))

    return query.order_by(Announcement.pinned.desc(), Announcement.created_at.desc()).offset(skip).limit(limit).all()


@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    if announcement.created_by != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this announcement")

    db.delete(announcement)
    db.commit()