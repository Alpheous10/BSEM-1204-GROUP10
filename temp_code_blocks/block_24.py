from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.post import Post
from app.models.follow import Follow
from app.models.like import Like
from app.models.comment import Comment
from app.schemas.post import PostResponse
from app.auth import get_current_user

router = APIRouter(prefix="/feed", tags=["Feed"])


@router.get("/", response_model=List[PostResponse])
def get_feed(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    following_ids = db.query(Follow.following_id).filter(
        Follow.follower_id == current_user.id
    ).subquery()

    posts = db.query(Post).filter(
        Post.user_id.in_(following_ids)
    ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for post in posts:
        like_count = db.query(Like).filter(Like.post_id == post.id).count()
        comment_count = db.query(Comment).filter(Comment.post_id == post.id).count()
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