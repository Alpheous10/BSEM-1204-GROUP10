from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
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
