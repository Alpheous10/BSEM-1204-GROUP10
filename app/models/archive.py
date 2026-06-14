from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base
from datetime import datetime


class DeletedUser(Base):
    __tablename__ = "deleted_users"

    id = Column(Integer, primary_key=True, index=True)
    original_id = Column(Integer, nullable=False)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    deleted_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class DeletedPost(Base):
    __tablename__ = "deleted_posts"

    id = Column(Integer, primary_key=True, index=True)
    original_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class DeletedComment(Base):
    __tablename__ = "deleted_comments"

    id = Column(Integer, primary_key=True, index=True)
    original_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    post_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
