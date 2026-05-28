from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.post import Post
from models.user import User
from schemas.post import PostCreate, PostResponse
from auth import get_current_user

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_post = Post(**post.dict(), user_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.get("/", response_model=List[PostResponse])
def get_all_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    updated_post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this post"
        )
    
    post.title = updated_post.title
    post.content = updated_post.content
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
        )
    
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}