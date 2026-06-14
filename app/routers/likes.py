from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.like import Like
from app.models.post import Post
from app.auth import get_current_user

router = APIRouter(prefix="/likes", tags=["Likes"])


@router.post("/{post_id}")
def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if already liked
    existing_like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked this post")
    
    new_like = Like(post_id=post_id, user_id=current_user.id)
    db.add(new_like)
    db.commit()
    return {"message": "Post liked successfully"}


@router.delete("/{post_id}")
def unlike_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    
    db.delete(like)
    db.commit()
    return {"message": "Like removed successfully"}
