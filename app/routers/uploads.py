import os, uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.auth import get_current_user

router = APIRouter(prefix="/uploads", tags=["Uploads"])

AVATAR_DIR = "uploads/avatars"
os.makedirs(AVATAR_DIR, exist_ok=True)

POST_IMAGE_DIR = "uploads/post-images"
os.makedirs(POST_IMAGE_DIR, exist_ok=True)

ALLOWED_IMAGE_TYPES = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_AVATAR_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_POST_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only image files are allowed (jpg, png, gif, webp)")

    contents = await file.read()
    if len(contents) > MAX_AVATAR_SIZE:
        raise HTTPException(status_code=400, detail="Image too large (max 5MB)")

    stored_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(AVATAR_DIR, stored_name)
    with open(file_path, "wb") as f:
        f.write(contents)

    # Delete old avatar file from disk if it was a local upload
    if current_user.avatar_url and current_user.avatar_url.startswith("/uploads/avatars/"):
        old_path = current_user.avatar_url.lstrip("/")
        if os.path.exists(old_path):
            os.remove(old_path)

    current_user.avatar_url = f"/uploads/avatars/{stored_name}"
    db.commit()
    db.refresh(current_user)

    return {"avatar_url": current_user.avatar_url}


@router.post("/post-image")
async def upload_post_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    contents = await file.read()
    if len(contents) > MAX_POST_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")

    stored_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(POST_IMAGE_DIR, stored_name)
    with open(file_path, "wb") as f:
        f.write(contents)

    return {"image_url": f"/uploads/post-images/{stored_name}"}
