from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.post import Post
from app.models.user import User
from app.models.like import Like
from app.models.comment import Comment
from app.models.follow import Follow
from app.models.community import Community, CommunityMember
from app.schemas.post import PostResponse
from app.schemas.user import UserPublicResponse
from app.schemas.community import CommunityResponse
from app.auth import get_current_user_optional

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/posts", response_model=List[PostResponse])
def search_posts(
    q: str = Query(..., min_length=1),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    posts = db.query(Post).filter(
        Post.title.ilike(f"%{q}%") | Post.content.ilike(f"%{q}%")
    ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for post in posts:
        like_count = db.query(Like).filter(Like.post_id == post.id).count()
        comment_count = db.query(Comment).filter(Comment.post_id == post.id).count()
        is_liked = False
        if current_user:
            is_liked = db.query(Like).filter(
                Like.post_id == post.id, Like.user_id == current_user.id
            ).first() is not None
        result.append(PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            user_id=post.user_id,
            community_id=post.community_id,
            project_group_id=post.project_group_id,
            created_at=post.created_at,
            updated_at=post.updated_at,
            like_count=like_count,
            comment_count=comment_count,
            is_liked=is_liked
        ))

    return result


@router.get("/users", response_model=List[UserPublicResponse])
def search_users(
    q: str = Query(..., min_length=1),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    users = db.query(User).filter(User.username.ilike(f"%{q}%")).offset(skip).limit(limit).all()

    result = []
    for user in users:
        follower_count = db.query(Follow).filter(Follow.following_id == user.id).count()
        following_count = db.query(Follow).filter(Follow.follower_id == user.id).count()
        result.append(UserPublicResponse(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            bio=user.bio,
            avatar_url=user.avatar_url,
            department=user.department,
            academic_year=user.academic_year,
            follower_count=follower_count,
            following_count=following_count
        ))

    return result


@router.get("/communities", response_model=List[CommunityResponse])
def search_communities(
    q: str = Query(..., min_length=1),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    communities = db.query(Community).filter(
        Community.name.ilike(f"%{q}%")
    ).offset(skip).limit(limit).all()

    result = []
    for c in communities:
        member_count = db.query(CommunityMember).filter(CommunityMember.community_id == c.id).count()
        is_member = False
        if current_user:
            is_member = db.query(CommunityMember).filter(
                CommunityMember.community_id == c.id,
                CommunityMember.user_id == current_user.id
            ).first() is not None
        result.append(CommunityResponse(
            id=c.id, name=c.name, description=c.description, icon=c.icon,
            created_by=c.created_by, created_at=c.created_at,
            member_count=member_count, is_member=is_member
        ))

    return result