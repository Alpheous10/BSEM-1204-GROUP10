from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.assignment import Assignment
from app.models.community import CommunityMember
from app.models.user import User
from app.schemas.assignment import AssignmentCreate, AssignmentResponse
from app.auth import get_current_user
from app.notifications_util import create_notification

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.post("/", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == assignment.community_id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="You must be a member of this community")

    new_assignment = Assignment(
        title=assignment.title,
        description=assignment.description,
        due_date=assignment.due_date,
        community_id=assignment.community_id,
        created_by=current_user.id
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    members = db.query(CommunityMember).filter(CommunityMember.community_id == assignment.community_id).all()
    for m in members:
        if m.user_id != current_user.id:
            create_notification(
                db, m.user_id, "assignment",
                f"New assignment posted: {assignment.title}",
                related_id=new_assignment.id
            )

    return new_assignment


@router.get("/", response_model=List[AssignmentResponse])
def get_assignments(
    community_id: Optional[int] = None,
    upcoming: bool = False,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Assignment)
    if community_id is not None:
        query = query.filter(Assignment.community_id == community_id)
    if upcoming:
        query = query.filter(Assignment.due_date >= datetime.utcnow())

    return query.order_by(Assignment.due_date.asc()).offset(skip).limit(limit).all()


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(
    assignment_id: int,
    updated: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if assignment.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this assignment")

    assignment.title = updated.title
    assignment.description = updated.description
    assignment.due_date = updated.due_date
    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if assignment.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this assignment")

    db.delete(assignment)
    db.commit()