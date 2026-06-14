Instructions for Member 3

Switch to your branch:Bashgit checkout -b member3-features


1. models/comment.py
Pythonfrom sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    post = relationship("Post", backref="comments")
    user = relationship("User", backref="comments")
2. models/like.py
Pythonfrom sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    post = relationship("Post", backref="likes")
    user = relationship("User")

    __table_args__ = (UniqueConstraint('post_id', 'user_id', name='unique_like'),)
3. schemas/comment.py
Pythonfrom pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    post_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
4. schemas/like.py
Pythonfrom pydantic import BaseModel
from datetime import datetime

class LikeResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
5. routers/comments.py
Pythonfrom fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.comment import Comment
from models.post import Post
from schemas.comment import CommentCreate, CommentResponse
from auth import get_current_user

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(comment: CommentCreate, post_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    new_comment = Comment(content=comment.content, post_id=post_id, user_id=current_user.id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.get("/post/{post_id}", response_model=List[CommentResponse])
def get_post_comments(post_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.post_id == post_id).all()
    return comments
6. routers/likes.py
Pythonfrom fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.like import Like
from models.post import Post
from auth import get_current_user

router = APIRouter(prefix="/likes", tags=["Likes"])

@router.post("/{post_id}")
def like_post(post_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if already liked
    existing_like = db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.id).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked this post")
    
    new_like = Like(post_id=post_id, user_id=current_user.id)
    db.add(new_like)
    db.commit()
    return {"message": "Post liked successfully"}

@router.delete("/{post_id}")
def unlike_post(post_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    like = db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.id).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    
    db.delete(like)
    db.commit()
    return {"message": "Like removed successfully"}
7. Update main.py (Final Version)
Replace your main.py with this final version:
Pythonfrom fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models.user
import models.post
import models.comment
import models.like

app = FastAPI(title="Social Media Post API", version="1.0", description="SDG 16 - Promoting Peaceful Digital Expression")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables
models.user.Base.metadata.create_all(bind=engine)
models.post.Base.metadata.create_all(bind=engine)
models.comment.Base.metadata.create_all(bind=engine)
models.like.Base.metadata.create_all(bind=engine)

# Import routers
from routers.auth import router as auth_router
from routers.posts import router as posts_router
from routers.comments import router as comments_router
from routers.likes import router as likes_router

app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(likes_router)

@app.get("/")
async def root():  # Async example
    return {
        "message": "Welcome to Social Media API",
        "sdg": "SDG 16 - Peace, Justice and Strong Institutions",
        "description": "Building responsible digital spaces for Sierra Leone youth"
    }

FINAL STEPS FOR MEMBER 3
8. Update README.md
Markdown# Social Media Post API

A FastAPI-based Social Media API built for Object-Oriented Programming 2.

**SDG Alignment**: SDG 16 (Peace, Justice and Strong Institutions) - Promoting constructive digital dialogue in Sierra Leone.

## Team Members
- Member 1: Database + Post CRUD
- Member 2: Authentication + JWT
- Member 3: Comments, Likes & Documentation

## Setup
1. Clone repo
2. Create database `social_media_db`
3. Copy `.env.example` to `.env` and update credentials
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`

## Features
- User Registration & Login (JWT)
- CRUD Posts
- Comments on Posts
- Like/Unlike Posts
- Protected Routes
- Swagger Documentation (`/docs`)

## Screenshots
(Add screenshots here)

Commit your work:
Bashgit add .
git commit -m "feat: Member 3 - Comments, Likes, Async endpoint, models, routers and documentation"
git push origin member3-features
Then create a Pull Request to main.
