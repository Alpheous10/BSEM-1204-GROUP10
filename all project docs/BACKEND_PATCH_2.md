# Backend Patch 2 — Delete Account, PostgreSQL Triggers & Admin

> **Prerequisite:** `MVP_UPGRADE_SPEC.md` must be fully applied before this patch.
> Work through each section **in order**. Do not skip sections.

---

## 0. Overview of Changes

| Action | File |
|--------|------|
| MODIFY | `app/models/user.py` — add `is_admin` field |
| CREATE | `app/models/archive.py` — SQLAlchemy models for archive tables |
| CREATE | `migrations/001_add_triggers.sql` — PostgreSQL trigger functions and triggers |
| MODIFY | `app/routers/users.py` — fix `DELETE /users/me` deletion order + add `GET /users/{user_id}/posts` |
| CREATE | `app/routers/admin.py` — admin-only endpoints to view archived data |
| MODIFY | `app/main.py` — register archive models and admin router |

---

## 1. Modify `app/models/user.py`

This file was last modified in `MVP_UPGRADE_SPEC.md` to add `bio` and `avatar_url`.
Now add `is_admin`. Replace the entire file with:

```python
from sqlalchemy import Column, Integer, String, Text, Boolean
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False, nullable=False)
```

---

## 2. Create `app/models/archive.py`

Create this file from scratch. These SQLAlchemy models tell SQLAlchemy to create
the archive tables on startup. The PostgreSQL triggers (created in step 3) will
then write into these tables automatically whenever rows are deleted.

```python
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
```

---

## 3. Create `migrations/001_add_triggers.sql`

Create the folder `migrations/` in the project root, then create this SQL file inside it.

**When to run this file:**
1. Start the server once so `Base.metadata.create_all()` creates all tables (including the archive tables above).
2. Then run this file against your PostgreSQL database:
   ```bash
   psql -U <your_db_user> -d <your_db_name> -f migrations/001_add_triggers.sql
   ```
3. The triggers will now be active. Do not run this file more than once (it uses `CREATE OR REPLACE` and `DROP TRIGGER IF EXISTS` so it is safe to re-run if needed).

```sql
-- ============================================================
-- TRIGGER FUNCTIONS
-- Each function copies the deleted row into the matching
-- archive table before the deletion is committed.
-- ============================================================

CREATE OR REPLACE FUNCTION archive_user_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO deleted_users (
        original_id, username, email, hashed_password,
        bio, avatar_url, deleted_at
    )
    VALUES (
        OLD.id, OLD.username, OLD.email, OLD.hashed_password,
        OLD.bio, OLD.avatar_url, NOW()
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION archive_post_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO deleted_posts (
        original_id, title, content, user_id, created_at, deleted_at
    )
    VALUES (
        OLD.id, OLD.title, OLD.content, OLD.user_id, OLD.created_at, NOW()
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION archive_comment_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO deleted_comments (
        original_id, content, post_id, user_id, created_at, deleted_at
    )
    VALUES (
        OLD.id, OLD.content, OLD.post_id, OLD.user_id, OLD.created_at, NOW()
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- TRIGGERS
-- Attached to the live tables. Fire BEFORE DELETE so the
-- archive write happens inside the same transaction.
-- ============================================================

DROP TRIGGER IF EXISTS trg_archive_user ON users;
CREATE TRIGGER trg_archive_user
    BEFORE DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION archive_user_before_delete();


DROP TRIGGER IF EXISTS trg_archive_post ON posts;
CREATE TRIGGER trg_archive_post
    BEFORE DELETE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION archive_post_before_delete();


DROP TRIGGER IF EXISTS trg_archive_comment ON comments;
CREATE TRIGGER trg_archive_comment
    BEFORE DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION archive_comment_before_delete();
```

**What each trigger does:**

| Trigger | Table | Archive Table | What is copied |
|---------|-------|---------------|----------------|
| `trg_archive_user` | `users` | `deleted_users` | Full user row + timestamp |
| `trg_archive_post` | `posts` | `deleted_posts` | Full post row + timestamp |
| `trg_archive_comment` | `comments` | `deleted_comments` | Full comment row + timestamp |

Likes and follows are **not** archived — they are junction table data and have no content value.

---

## 4. Modify `app/routers/users.py`

This file was created in `MVP_UPGRADE_SPEC.md`. Replace the entire file with the version below.

**Changes from the previous version:**
- `DELETE /users/me` now deletes all related data in the correct order to avoid foreign key constraint errors. The PostgreSQL triggers fire automatically during each deletion step.
- Added `GET /users/{user_id}/posts` — required by the frontend to display a user's posts on their profile page.

```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.models.follow import Follow
from app.schemas.user import UserResponse, UserUpdate, UserPublicResponse
from app.schemas.post import PostResponse
from app.auth import get_current_user
from app.models.like import Like
from app.models.comment import Comment

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    updates: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if updates.username is not None:
        existing = db.query(User).filter(
            User.username == updates.username,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = updates.username

    if updates.email is not None:
        existing = db.query(User).filter(
            User.email == updates.email,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
        current_user.email = updates.email

    if updates.bio is not None:
        current_user.bio = updates.bio

    if updates.avatar_url is not None:
        current_user.avatar_url = updates.avatar_url

    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletes the current user's account in the correct order to avoid
    foreign key constraint violations. PostgreSQL triggers fire during
    steps 3, 5, and 6 to archive posts, comments, and the user row.
    """

    # Step 1 — Collect the IDs of all posts owned by this user
    user_post_ids = [
        row.id
        for row in db.query(Post.id).filter(Post.user_id == current_user.id).all()
    ]

    # Step 2 — Delete all likes on the user's posts (placed by other users)
    # These are not archived — they are just counts.
    if user_post_ids:
        db.query(Like).filter(
            Like.post_id.in_(user_post_ids)
        ).delete(synchronize_session=False)

    # Step 3 — Delete all comments on the user's posts (written by other users)
    # trg_archive_comment fires for each row.
    if user_post_ids:
        db.query(Comment).filter(
            Comment.post_id.in_(user_post_ids)
        ).delete(synchronize_session=False)

    # Step 4 — Delete all likes placed by this user on other posts
    db.query(Like).filter(Like.user_id == current_user.id).delete()

    # Step 5 — Delete all comments written by this user on other posts
    # trg_archive_comment fires for each row.
    db.query(Comment).filter(Comment.user_id == current_user.id).delete()

    # Step 6 — Delete all follow relationships involving this user
    db.query(Follow).filter(
        (Follow.follower_id == current_user.id) |
        (Follow.following_id == current_user.id)
    ).delete(synchronize_session=False)

    # Step 7 — Delete the user's posts
    # trg_archive_post fires for each row.
    db.query(Post).filter(Post.user_id == current_user.id).delete()

    # Step 8 — Delete the user
    # trg_archive_user fires.
    db.delete(current_user)

    db.commit()


@router.get("/{user_id}", response_model=UserPublicResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    follower_count = db.query(Follow).filter(Follow.following_id == user_id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user_id).count()

    return UserPublicResponse(
        id=user.id,
        username=user.username,
        bio=user.bio,
        avatar_url=user.avatar_url,
        follower_count=follower_count,
        following_count=following_count
    )


@router.get("/{user_id}/posts", response_model=List[PostResponse])
def get_user_posts(
    user_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    posts = db.query(Post).filter(
        Post.user_id == user_id
    ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for post in posts:
        like_count = db.query(Like).filter(Like.post_id == post.id).count()
        comment_count = db.query(Comment).filter(Comment.post_id == post.id).count()
        result.append(PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            user_id=post.user_id,
            created_at=post.created_at,
            updated_at=post.updated_at,
            like_count=like_count,
            comment_count=comment_count
        ))

    return result


@router.post("/{user_id}/follow", status_code=status.HTTP_201_CREATED)
def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already following this user")

    follow = Follow(follower_id=current_user.id, following_id=user_id)
    db.add(follow)
    db.commit()
    return {"message": f"Now following {target.username}"}


@router.delete("/{user_id}/follow", status_code=status.HTTP_200_OK)
def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    follow = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()
    if not follow:
        raise HTTPException(status_code=404, detail="You are not following this user")

    db.delete(follow)
    db.commit()
    return {"message": "Unfollowed successfully"}


@router.get("/{user_id}/followers")
def get_followers(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    follows = db.query(Follow).filter(Follow.following_id == user_id).all()
    followers = [
        {"id": f.follower.id, "username": f.follower.username}
        for f in follows
    ]
    return {"followers": followers, "count": len(followers)}


@router.get("/{user_id}/following")
def get_following(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    follows = db.query(Follow).filter(Follow.follower_id == user_id).all()
    following = [
        {"id": f.following.id, "username": f.following.username}
        for f in follows
    ]
    return {"following": following, "count": len(following)}
```

---

## 5. Create `app/routers/admin.py`

Create this file from scratch. All endpoints in this router require `is_admin = True` on the requesting user. Any non-admin receives a 403.

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.archive import DeletedUser, DeletedPost, DeletedComment
from app.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user


@router.get("/deleted-users")
def get_deleted_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    records = db.query(DeletedUser).order_by(DeletedUser.deleted_at.desc()).all()
    return [
        {
            "id": r.id,
            "original_id": r.original_id,
            "username": r.username,
            "email": r.email,
            "bio": r.bio,
            "avatar_url": r.avatar_url,
            "deleted_at": r.deleted_at
        }
        for r in records
    ]


@router.get("/deleted-posts")
def get_deleted_posts(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    records = db.query(DeletedPost).order_by(DeletedPost.deleted_at.desc()).all()
    return [
        {
            "id": r.id,
            "original_id": r.original_id,
            "title": r.title,
            "content": r.content,
            "user_id": r.user_id,
            "created_at": r.created_at,
            "deleted_at": r.deleted_at
        }
        for r in records
    ]


@router.get("/deleted-comments")
def get_deleted_comments(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    records = db.query(DeletedComment).order_by(DeletedComment.deleted_at.desc()).all()
    return [
        {
            "id": r.id,
            "original_id": r.original_id,
            "content": r.content,
            "post_id": r.post_id,
            "user_id": r.user_id,
            "created_at": r.created_at,
            "deleted_at": r.deleted_at
        }
        for r in records
    ]
```

**To grant admin to a user**, run this directly in PostgreSQL (replace `<username>`):
```sql
UPDATE users SET is_admin = TRUE WHERE username = '<username>';
```

---

## 6. Modify `app/main.py`

This is the complete final version of `app/main.py` after both specs.
Replace the entire file with:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.database import engine, Base
import app.models.user
import app.models.post
import app.models.comment
import app.models.like
import app.models.follow
import app.models.archive

from app.routers.auth import router as auth_router
from app.routers.posts import router as posts_router
from app.routers.comments import router as comments_router
from app.routers.likes import router as likes_router
from app.routers.users import router as users_router
from app.routers.feed import router as feed_router
from app.routers.search import router as search_router
from app.routers.admin import router as admin_router

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Social Media Post API",
    version="1.0",
    description="SDG 16 - Promoting Peaceful Digital Expression"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(likes_router)
app.include_router(users_router)
app.include_router(feed_router)
app.include_router(search_router)
app.include_router(admin_router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Social Media API",
        "sdg": "SDG 16 - Peace, Justice and Strong Institutions",
        "description": "Building responsible digital spaces for Sierra Leone youth"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
```

---

## 7. Apply Order

Run these steps in order after making all code changes:

```bash
# 1. Install dependencies (if not already done from spec 1)
pip install -r requirements.txt

# 2. Start server once so create_all creates the archive tables
python main.py

# 3. In a separate terminal, stop the server (Ctrl+C), then apply SQL triggers
psql -U <your_db_user> -d <your_db_name> -f migrations/001_add_triggers.sql

# 4. Start the server again — it is now fully patched
python main.py
```

---

## 8. New Endpoints After This Patch

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/{user_id}/posts` | No | Get all posts by a specific user |
| GET | `/admin/deleted-users` | Yes (admin only) | View archived deleted users |
| GET | `/admin/deleted-posts` | Yes (admin only) | View archived deleted posts |
| GET | `/admin/deleted-comments` | Yes (admin only) | View archived deleted comments |

**Modified endpoint:**
- `DELETE /users/me` — now correctly deletes all related data in the right order before deleting the user. Triggers archive posts and comments automatically.
