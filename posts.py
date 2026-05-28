from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.post import Post
from schemas.post import PostCreate, PostResponse

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(post: PostCreate, db: Session = Depends(get_db)) -> PostResponse:
    db_post = Post(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.get("/", response_model=List[PostResponse])
def get_all_posts(db: Session = Depends(get_db)) -> List[PostResponse]:
    posts = db.query(Post).all()
    return posts


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)) -> PostResponse:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    updated_post: PostCreate,
    db: Session = Depends(get_db)
) -> PostResponse:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    post.title = updated_post.title
    post.content = updated_post.content
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, db: Session = Depends(get_db)) -> None:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    db.delete(post)
    db.commit()
