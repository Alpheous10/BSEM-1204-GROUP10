from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.community import Community, CommunityMember
from app.models.user import User
from app.schemas.community import CommunityCreate, CommunityResponse, CommunityMemberResponse
from app.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/communities", tags=["Communities"])


def build_community_response(community, db, current_user=None):
    member_count = db.query(CommunityMember).filter(CommunityMember.community_id == community.id).count()
    is_member = False
    if current_user:
        is_member = db.query(CommunityMember).filter(
            CommunityMember.community_id == community.id,
            CommunityMember.user_id == current_user.id
        ).first() is not None
    return CommunityResponse(
        id=community.id, name=community.name, description=community.description,
        icon=community.icon, created_by=community.created_by, created_at=community.created_at,
        member_count=member_count, is_member=is_member
    )


@router.post("/", response_model=CommunityResponse, status_code=status.HTTP_201_CREATED)
def create_community(
    community: CommunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Community).filter(Community.name == community.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="A community with this name already exists")

    new_community = Community(
        name=community.name,
        description=community.description,
        icon=community.icon,
        created_by=current_user.id
    )
    db.add(new_community)
    db.commit()
    db.refresh(new_community)

    membership = CommunityMember(community_id=new_community.id, user_id=current_user.id, role="admin")
    db.add(membership)
    db.commit()

    return build_community_response(new_community, db, current_user)


@router.get("/", response_model=List[CommunityResponse])
def get_communities(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    communities = db.query(Community).order_by(Community.created_at.desc()).offset(skip).limit(limit).all()
    return [build_community_response(c, db, current_user) for c in communities]


@router.get("/mine", response_model=List[CommunityResponse])
def get_my_communities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memberships = db.query(CommunityMember).filter(CommunityMember.user_id == current_user.id).all()
    community_ids = [m.community_id for m in memberships]
    communities = db.query(Community).filter(Community.id.in_(community_ids)).all()
    return [build_community_response(c, db, current_user) for c in communities]


@router.get("/{community_id}", response_model=CommunityResponse)
def get_community(
    community_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    return build_community_response(community, db, current_user)


@router.post("/{community_id}/join", status_code=status.HTTP_201_CREATED)
def join_community(
    community_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")

    existing = db.query(CommunityMember).filter(
        CommunityMember.community_id == community_id,
        CommunityMember.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already a member of this community")

    membership = CommunityMember(community_id=community_id, user_id=current_user.id, role="member")
    db.add(membership)
    db.commit()
    return {"message": f"Joined {community.name}"}


@router.delete("/{community_id}/leave")
def leave_community(
    community_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = db.query(CommunityMember).filter(
        CommunityMember.community_id == community_id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="You are not a member of this community")

    if membership.role == "admin":
        other_admin = db.query(CommunityMember).filter(
            CommunityMember.community_id == community_id,
            CommunityMember.role == "admin",
            CommunityMember.user_id != current_user.id
        ).first()
        if not other_admin:
            raise HTTPException(status_code=400, detail="You are the only admin. Promote another member before leaving.")

    db.delete(membership)
    db.commit()
    return {"message": "Left community successfully"}


@router.get("/{community_id}/members", response_model=List[CommunityMemberResponse])
def get_community_members(community_id: int, db: Session = Depends(get_db)):
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")

    memberships = db.query(CommunityMember).filter(CommunityMember.community_id == community_id).all()
    return [
        CommunityMemberResponse(
            id=m.user.id, username=m.user.username, full_name=m.user.full_name,
            avatar_url=m.user.avatar_url, role=m.role
        )
        for m in memberships
    ]