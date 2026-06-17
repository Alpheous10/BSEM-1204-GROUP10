import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.resource import Resource
from app.models.community import CommunityMember
from app.models.user import User
from app.schemas.resource import ResourceResponse
from app.auth import get_current_user
from app.cloudinary_config import upload_file

router = APIRouter(prefix="/resources", tags=["Resources"])

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".ppt", ".pptx",
                      ".xls", ".xlsx", ".png", ".jpg", ".jpeg",
                      ".gif", ".webp", ".txt"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB


def build_resource_response(resource) -> ResourceResponse:
    return ResourceResponse(
        id=resource.id,
        title=resource.title,
        description=resource.description,
        file_name=resource.file_name,
        file_type=resource.file_type,
        file_size=resource.file_size,
        file_url=resource.file_path,
        community_id=resource.community_id,
        uploaded_by=resource.uploaded_by,
        created_at=resource.created_at
    )


@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
async def upload_resource(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    community_id: Optional[int] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import os
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' is not allowed")

    if community_id is not None:
        member = db.query(CommunityMember).filter(
            CommunityMember.community_id == community_id,
            CommunityMember.user_id == current_user.id
        ).first()
        if not member:
            raise HTTPException(status_code=403,
                detail="You must join this community to upload resources to it")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 20MB)")

    public_id = f"{uuid.uuid4().hex}"
    cloudinary_url = upload_file(
        contents=contents,
        folder="unihub/resources",
        resource_type="auto",
        public_id=public_id
    )

    resource = Resource(
        title=title,
        description=description,
        file_name=file.filename,
        file_path=cloudinary_url,
        file_type=ext.lstrip("."),
        file_size=len(contents),
        community_id=community_id,
        uploaded_by=current_user.id
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)

    return build_resource_response(resource)


@router.get("/", response_model=List[ResourceResponse])
def get_resources(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    community_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Resource)
    if community_id is not None:
        query = query.filter(Resource.community_id == community_id)
    resources = query.order_by(Resource.created_at.desc()).offset(skip).limit(limit).all()
    return [build_resource_response(r) for r in resources]


@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return build_resource_response(resource)


@router.get("/{resource_id}/download")
def download_resource(resource_id: int, db: Session = Depends(get_db)):
    from fastapi.responses import RedirectResponse
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return RedirectResponse(url=resource.file_path)


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    if resource.uploaded_by != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this resource")

    db.delete(resource)
    db.commit()
