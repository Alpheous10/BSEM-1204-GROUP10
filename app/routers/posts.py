from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.post import Post
from app.models.user import User
from app.models.like import Like
from app.models.comment import Comment
from app.models.community import CommunityMember
from app.models.project_group import ProjectGroupMember
from app.schemas.post import PostCreate, PostResponse
from app.auth import get_current_user, get_current_user_optional
from app.cloudinary_config import upload_file

router = APIRouter(prefix="/posts", tags=["Posts"])


def build_post_response(post, db: Session, current_user=None) -> PostResponse:
    like_count = db.query(Like).filter(Like.post_id == post.id).count()
    comment_count = db.query(Comment).filter(Comment.post_id == post.id).count()

    is_liked = False
    if current_user:
        is_liked = db.query(Like).filter(
            Like.post_id == post.id,
            Like.user_id == current_user.id
        ).first() is not None

    return PostResponse(
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
    )


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if post.community_id is not None:
        member = db.query(CommunityMember).filter(
            CommunityMember.community_id == post.community_id,
            CommunityMember.user_id == current_user.id
        ).first()
        if not member:
            raise HTTPException(status_code=403, detail="You must join this community to post in it")

    if post.project_group_id is not None:
        member = db.query(ProjectGroupMember).filter(
            ProjectGroupMember.project_group_id == post.project_group_id,
            ProjectGroupMember.user_id == current_user.id
        ).first()
        if not member:
            raise HTTPException(status_code=403, detail="You must join this project group to post in it")

    db_post = Post(**post.dict(), user_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return build_post_response(db_post, db, current_user)


@router.get("/", response_model=List[PostResponse])
def get_all_posts(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    community_id: Optional[int] = None,
    project_group_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Post)
    if community_id is not None:
        query = query.filter(Post.community_id == community_id)
    if project_group_id is not None:
        query = query.filter(Post.project_group_id == project_group_id)

    posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    return [build_post_response(p, db, current_user) for p in posts]


@router.get("/{post_id}", response_model=PostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return build_post_response(post, db, current_user)


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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this post")

    post.title = updated_post.title
    post.content = updated_post.content
    db.commit()
    db.refresh(post)
    return build_post_response(post, db, current_user)


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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this post")

    db.delete(post)
    db.commit()


@router.post("/upload-image")
async def upload_post_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    import os, uuid
    ALLOWED = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED:
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 5MB)")

    cloudinary_url = upload_file(
        contents=contents,
        folder="unihub/post-images",
        resource_type="image",
        public_id=f"post_{current_user.id}_{uuid.uuid4().hex[:8]}"
    )

    return {"image_url": cloudinary_url}