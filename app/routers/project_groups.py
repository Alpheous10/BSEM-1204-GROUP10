from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.project_group import ProjectGroup, ProjectGroupMember
from app.models.user import User
from app.schemas.project_group import ProjectGroupCreate, ProjectGroupResponse
from app.schemas.community import CommunityMemberResponse
from app.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/project-groups", tags=["Project Groups"])


def build_response(pg, db, current_user=None) -> ProjectGroupResponse:
    member_count = db.query(ProjectGroupMember).filter(ProjectGroupMember.project_group_id == pg.id).count()
    is_member = False
    if current_user:
        is_member = db.query(ProjectGroupMember).filter(
            ProjectGroupMember.project_group_id == pg.id,
            ProjectGroupMember.user_id == current_user.id
        ).first() is not None
    return ProjectGroupResponse(
        id=pg.id, name=pg.name, description=pg.description, created_by=pg.created_by,
        created_at=pg.created_at, member_count=member_count, is_member=is_member
    )


@router.post("/", response_model=ProjectGroupResponse, status_code=status.HTTP_201_CREATED)
def create_project_group(
    group: ProjectGroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_group = ProjectGroup(name=group.name, description=group.description, created_by=current_user.id)
    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    membership = ProjectGroupMember(project_group_id=new_group.id, user_id=current_user.id, role="admin")
    db.add(membership)
    db.commit()

    return build_response(new_group, db, current_user)


@router.get("/", response_model=List[ProjectGroupResponse])
def get_project_groups(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    groups = db.query(ProjectGroup).order_by(ProjectGroup.created_at.desc()).offset(skip).limit(limit).all()
    return [build_response(g, db, current_user) for g in groups]


@router.get("/mine", response_model=List[ProjectGroupResponse])
def get_my_project_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memberships = db.query(ProjectGroupMember).filter(ProjectGroupMember.user_id == current_user.id).all()
    group_ids = [m.project_group_id for m in memberships]
    groups = db.query(ProjectGroup).filter(ProjectGroup.id.in_(group_ids)).all()
    return [build_response(g, db, current_user) for g in groups]


@router.get("/{group_id}", response_model=ProjectGroupResponse)
def get_project_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    group = db.query(ProjectGroup).filter(ProjectGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Project group not found")
    return build_response(group, db, current_user)


@router.post("/{group_id}/join", status_code=status.HTTP_201_CREATED)
def join_project_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(ProjectGroup).filter(ProjectGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Project group not found")

    existing = db.query(ProjectGroupMember).filter(
        ProjectGroupMember.project_group_id == group_id,
        ProjectGroupMember.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already a member of this project group")

    membership = ProjectGroupMember(project_group_id=group_id, user_id=current_user.id, role="member")
    db.add(membership)
    db.commit()
    return {"message": f"Joined {group.name}"}


@router.delete("/{group_id}/leave")
def leave_project_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = db.query(ProjectGroupMember).filter(
        ProjectGroupMember.project_group_id == group_id,
        ProjectGroupMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="You are not a member of this project group")

    db.delete(membership)
    db.commit()
    return {"message": "Left project group successfully"}


@router.get("/{group_id}/members", response_model=List[CommunityMemberResponse])
def get_project_group_members(group_id: int, db: Session = Depends(get_db)):
    group = db.query(ProjectGroup).filter(ProjectGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Project group not found")

    memberships = db.query(ProjectGroupMember).filter(ProjectGroupMember.project_group_id == group_id).all()
    return [
        CommunityMemberResponse(
            id=m.user.id, username=m.user.username, full_name=m.user.full_name,
            avatar_url=m.user.avatar_url, role=m.role
        )
        for m in memberships
    ]