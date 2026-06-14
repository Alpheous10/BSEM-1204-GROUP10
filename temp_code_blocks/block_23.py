from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.models.follow import Follow
from app.schemas.user import UserResponse, UserUpdate, UserPublicResponse
from app.schemas.post import PostResponse
from app.auth import get_current_user, get_current_user_optional
from app.notifications_util import create_notification

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    updates: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if updates.username is not None:
        existing = db.query(User).filter(
            User.username == updates.username,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = updates.username

    if updates.email is not None:
        existing = db.query(User).filter(
            User.email == updates.email,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
        current_user.email = updates.email

    if updates.full_name is not None:
        current_user.full_name = updates.full_name

    if updates.bio is not None:
        current_user.bio = updates.bio

    if updates.avatar_url is not None:
        current_user.avatar_url = updates.avatar_url

    if updates.department is not None:
        current_user.department = updates.department

    if updates.academic_year is not None:
        current_user.academic_year = updates.academic_year

    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_post_ids = [
        row.id
        for row in db.query(Post.id).filter(Post.user_id == current_user.id).all()
    ]

    if user_post_ids:
        db.query(Like).filter(Like.post_id.in_(user_post_ids)).delete(synchronize_session=False)
        db.query(Comment).filter(Comment.post_id.in_(user_post_ids)).delete(synchronize_session=False)

    db.query(Like).filter(Like.user_id == current_user.id).delete()
    db.query(Comment).filter(Comment.user_id == current_user.id).delete()
    db.query(Follow).filter(
        (Follow.follower_id == current_user.id) | (Follow.following_id == current_user.id)
    ).delete(synchronize_session=False)
    db.query(Post).filter(Post.user_id == current_user.id).delete()

    db.delete(current_user)
    db.commit()


@router.get("/{user_id}", response_model=UserPublicResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    follower_count = db.query(Follow).filter(Follow.following_id == user_id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user_id).count()

    return UserPublicResponse(
        id=user.id,
        username=user.username,
        full_name=user.full_name,
        bio=user.bio,
        avatar_url=user.avatar_url,
        department=user.department,
        academic_year=user.academic_year,
        follower_count=follower_count,
        following_count=following_count
    )


@router.get("/{user_id}/posts", response_model=List[PostResponse])
def get_user_posts(
    user_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    posts = db.query(Post).filter(
        Post.user_id == user_id
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


@router.post("/{user_id}/follow", status_code=status.HTTP_201_CREATED)
def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already following this user")

    follow = Follow(follower_id=current_user.id, following_id=user_id)
    db.add(follow)
    db.commit()

    create_notification(
        db, user_id, "follow",
        f"@{current_user.username} started following you",
        related_id=current_user.id
    )

    return {"message": f"Now following {target.username}"}


@router.delete("/{user_id}/follow", status_code=status.HTTP_200_OK)
def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    follow = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()
    if not follow:
        raise HTTPException(status_code=404, detail="You are not following this user")

    db.delete(follow)
    db.commit()
    return {"message": "Unfollowed successfully"}


@router.get("/{user_id}/followers")
def get_followers(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    follows = db.query(Follow).filter(Follow.following_id == user_id).all()
    followers = [{"id": f.follower.id, "username": f.follower.username} for f in follows]
    return {"followers": followers, "count": len(followers)}


@router.get("/{user_id}/following")
def get_following(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    follows = db.query(Follow).filter(Follow.follower_id == user_id).all()
    following = [{"id": f.following.id, "username": f.following.username} for f in follows]
    return {"following": following, "count": len(following)}