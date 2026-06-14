from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class ProjectGroup(Base):
    __tablename__ = "project_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User")


class ProjectGroupMember(Base):
    __tablename__ = "project_group_members"

    id = Column(Integer, primary_key=True, index=True)
    project_group_id = Column(Integer, ForeignKey("project_groups.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, default="member", nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    project_group = relationship("ProjectGroup", backref="members")
    user = relationship("User")

    __table_args__ = (UniqueConstraint("project_group_id", "user_id", name="unique_project_group_member"),)