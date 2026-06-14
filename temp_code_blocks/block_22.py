from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse
from app.auth import get_current_user
from app.notifications_util import create_notification

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment: CommentCreate,
    post_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = Comment(
        content=comment.content,
        post_id=post_id,
        user_id=current_user.id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    if post.user_id != current_user.id:
        create_notification(
            db, post.user_id, "comment",
            f"@{current_user.username} commented on your post \"{post.title}\"",
            related_id=post_id
        )

    return new_comment


@router.get("/post/{post_id}", response_model=List[CommentResponse])
def get_post_comments(post_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.post_id == post_id).all()
    return comments


@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(
    comment_id: int,
    updated_comment: CommentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this comment")

    comment.content = updated_comment.content
    db.commit()
    db.refresh(comment)
    return comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this comment")

    db.delete(comment)
    db.commit()