from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.archive import DeletedUser, DeletedPost, DeletedComment
from app.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user


@router.get("/deleted-users")
def get_deleted_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    records = db.query(DeletedUser).order_by(DeletedUser.deleted_at.desc()).all()
    return [
        {
            "id": r.id,
            "original_id": r.original_id,
            "username": r.username,
            "email": r.email,
            "bio": r.bio,
            "avatar_url": r.avatar_url,
            "deleted_at": r.deleted_at
        }
        for r in records
    ]


@router.get("/deleted-posts")
def get_deleted_posts(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    records = db.query(DeletedPost).order_by(DeletedPost.deleted_at.desc()).all()
    return [
        {
            "id": r.id,
            "original_id": r.original_id,
            "title": r.title,
            "content": r.content,
            "user_id": r.user_id,
            "created_at": r.created_at,
            "deleted_at": r.deleted_at
        }
        for r in records
    ]


@router.get("/deleted-comments")
def get_deleted_comments(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    records = db.query(DeletedComment).order_by(DeletedComment.deleted_at.desc()).all()
    return [
        {
            "id": r.id,
            "original_id": r.original_id,
            "content": r.content,
            "post_id": r.post_id,
            "user_id": r.user_id,
            "created_at": r.created_at,
            "deleted_at": r.deleted_at
        }
        for r in records
    ]
