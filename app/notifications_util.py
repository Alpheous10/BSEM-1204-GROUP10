from sqlalchemy.orm import Session
from app.models.notification import Notification


def create_notification(db: Session, user_id: int, type: str, message: str, related_id: int = None):
    if user_id is None:
        return
    notif = Notification(
        user_id=user_id,
        type=type,
        message=message,
        related_id=related_id
    )
    db.add(notif)
    db.commit()