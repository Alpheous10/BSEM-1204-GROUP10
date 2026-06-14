from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Community(Base):
    __tablename__ = "communities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User")


class CommunityMember(Base):
    __tablename__ = "community_members"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, default="member", nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    community = relationship("Community", backref="members")
    user = relationship("User")

    __table_args__ = (UniqueConstraint("community_id", "user_id", name="unique_community_member"),)