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
…# Backend Patch 3 — Study Circle Expansion

> **Prerequisite:** `MVP_UPGRADE_SPEC.md` and `BACKEND_PATCH_2.md` must already be applied.
> This patch turns the API from a generic social feed into the full **Study Circle**
> academic platform: Communities, Resources (file uploads), Assignments, Project
> Groups, Announcements, and Notifications, plus a single aggregate `/dashboard/`
> endpoint for the frontend home screen.
>
> Work through sections **in order**. Every file listed gets either created or
> fully replaced — copy the code exactly.

---

## 0. File Operations Overview

| Action | File |
|--------|------|
| MODIFY | `app/models/user.py` |
| MODIFY | `app/models/post.py` |
| CREATE | `app/models/community.py` |
| CREATE | `app/models/resource.py` |
| CREATE | `app/models/assignment.py` |
| CREATE | `app/models/project_group.py` |
| CREATE | `app/models/announcement.py` |
| CREATE | `app/models/notification.py` |
| CREATE | `app/notifications_util.py` |
| MODIFY | `app/auth.py` |
| MODIFY | `app/schemas/user.py` |
| MODIFY | `app/schemas/post.py` |
| CREATE | `app/schemas/community.py` |
| CREATE | `app/schemas/resource.py` |
| CREATE | `app/schemas/assignment.py` |
| CREATE | `app/schemas/project_group.py` |
| CREATE | `app/schemas/announcement.py` |
| CREATE | `app/schemas/notification.py` |
| CREATE | `app/schemas/dashboard.py` |
| MODIFY | `app/routers/auth.py` |
| MODIFY | `app/routers/posts.py` |
| MODIFY | `app/routers/likes.py` |
| MODIFY | `app/routers/comments.py` |
| MODIFY | `app/routers/users.py` |
| MODIFY | `app/routers/feed.py` |
| MODIFY | `app/routers/search.py` |
| CREATE | `app/routers/communities.py` |
| CREATE | `app/routers/resources.py` |
| CREATE | `app/routers/assignments.py` |
| CREATE | `app/routers/project_groups.py` |
| CREATE | `app/routers/announcements.py` |
| CREATE | `app/routers/notifications.py` |
| CREATE | `app/routers/dashboard.py` |
| MODIFY | `app/main.py` |

No new pip packages are required — `python-multipart` (already in `requirements.txt`) covers the file upload form parsing.

---

## 1. Models

### 1a. Modify `app/models/user.py`

Adds the academic profile fields from the Study Circle spec (`full_name`, `department`, `academic_year`).

```python
from sqlalchemy import Column, Integer, String, Text, Boolean
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    department = Column(String, nullable=True)
    academic_year = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False, nullable=False)
```

### 1b. Modify `app/models/post.py`

Adds optional `community_id` and `project_group_id` so a post can belong to a community, a project group, or neither (a general profile post).

```python
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=True)
    project_group_id = Column(Integer, ForeignKey("project_groups.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", backref="posts")
    community = relationship("Community")
    project_group = relationship("ProjectGroup")
```

### 1c. Create `app/models/community.py`

```python
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
```

### 1d. Create `app/models/resource.py`

```python
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    uploader = relationship("User")
    community = relationship("Community")
```

### 1e. Create `app/models/assignment.py`

```python
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=False)
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    community = relationship("Community")
    creator = relationship("User")
```

### 1f. Create `app/models/project_group.py`

```python
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
```

### 1g. Create `app/models/announcement.py`

```python
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=True)
    pinned = Column(Boolean, default=False, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    community = relationship("Community")
    creator = relationship("User")
```

### 1h. Create `app/models/notification.py`

```python
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from app.database import Base
from datetime import datetime


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    related_id = Column(Integer, nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

---

## 2. Create `app/notifications_util.py`

Shared helper used by likes, comments, follows, announcements, and assignments to push a notification row.

```python
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
```

---

## 3. Modify `app/auth.py`

Adds `get_current_user_optional` — a dependency that returns the current `User` if a valid
token is supplied, or `None` if no token / an invalid token is present, **without** raising
401. This lets public endpoints (community list, post list, etc.) still personalize their
response (`is_member`, `is_liked`) for logged-in users while remaining accessible to anonymous
visitors.

Replace the entire file with:

```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from app.database import get_db
from app.models.user import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
)

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/login"
)

oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="auth/login",
    auto_error=False
)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception

    return user


def get_current_user_optional(
    token: str = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db)
):
    if token is None:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None

    return db.query(User).filter(User.username == username).first()
```

---

## 4. Schemas

### 4a. Modify `app/schemas/user.py`

```python
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    full_name: Optional[str] = None
    department: Optional[str] = None
    academic_year: Optional[str] = None


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    department: Optional[str] = None
    academic_year: Optional[str] = None


class UserResponse(UserBase):
    id: int
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    department: Optional[str] = None
    academic_year: Optional[str] = None
    is_admin: bool = False

    class Config:
        from_attributes = True


class UserPublicResponse(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    department: Optional[str] = None
    academic_year: Optional[str] = None
    follower_count: int = 0
    following_count: int = 0

    class Config:
        from_attributes = True
```

### 4b. Modify `app/schemas/post.py`

Adds community/project-group linkage and `is_liked` (per-viewer like state).

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PostBase(BaseModel):
    title: str
    content: str


class PostCreate(PostBase):
    community_id: Optional[int] = None
    project_group_id: Optional[int] = None


class PostResponse(PostBase):
    id: int
    user_id: int
    community_id: Optional[int] = None
    project_group_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    like_count: int = 0
    comment_count: int = 0
    is_liked: bool = False

    class Config:
        from_attributes = True
```

### 4c. Create `app/schemas/community.py`

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CommunityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class CommunityResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    created_by: int
    created_at: datetime
    member_count: int = 0
    is_member: bool = False

    class Config:
        from_attributes = True


class CommunityMemberResponse(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str

    class Config:
        from_attributes = True
```

### 4d. Create `app/schemas/resource.py`

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ResourceResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    file_name: str
    file_type: str
    file_size: int
    file_url: str
    community_id: Optional[int] = None
    uploaded_by: int
    created_at: datetime

    class Config:
        from_attributes = True
```

### 4e. Create `app/schemas/assignment.py`

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AssignmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: datetime
    community_id: int


class AssignmentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    due_date: datetime
    community_id: int
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True
```

### 4f. Create `app/schemas/project_group.py`

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ProjectGroupCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectGroupResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_by: int
    created_at: datetime
    member_count: int = 0
    is_member: bool = False

    class Config:
        from_attributes = True
```

### 4g. Create `app/schemas/announcement.py`

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AnnouncementCreate(BaseModel):
    title: str
    content: str
    community_id: Optional[int] = None
    pinned: bool = False


class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    community_id: Optional[int] = None
    pinned: bool
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True
```

### 4h. Create `app/schemas/notification.py`

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class NotificationResponse(BaseModel):
    id: int
    type: str
    message: str
    related_id: Optional[int] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
```

### 4i. Create `app/schemas/dashboard.py`

```python
from pydantic import BaseModel
from typing import List, Optional

from app.schemas.community import CommunityResponse
from app.schemas.resource import ResourceResponse
from app.schemas.assignment import AssignmentResponse
from app.schemas.announcement import AnnouncementResponse
from app.schemas.post import PostResponse


class DashboardUser(BaseModel):
    username: str
    full_name: Optional[str] = None


class DashboardResponse(BaseModel):
    user: DashboardUser
    my_communities: List[CommunityResponse]
    upcoming_assignments: List[AssignmentResponse]
    recent_resources: List[ResourceResponse]
    recent_discussions: List[PostResponse]
    announcements: List[AnnouncementResponse]
    unread_notifications: int
```

---

## 5. Modified Routers

### 5a. Modify `app/routers/auth.py`

Registration now stores the new profile fields. Replace the entire file with:

```python
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.auth import (
    get_password_hash,
    create_access_token,
    verify_password
)

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user_email = db.query(User).filter(User.email == user.email).first()
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        department=user.department,
        academic_year=user.academic_year
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
@limiter.limit("5/minute")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    access_token = create_access_token(data={"sub": user.username})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
```

### 5b. Modify `app/routers/posts.py`

Adds `community_id` / `project_group_id` filtering on the list endpoint, membership
validation on create, and `is_liked` for the requesting user.

```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.post import Post
from app.models.user import User
from app.models.like import Like
from app.models.comment import Comment
from app.models.community import CommunityMember
from app.models.project_group import ProjectGroupMember
from app.schemas.post import PostCreate, PostResponse
from app.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/posts", tags=["Posts"])


def build_post_response(post, db: Session, current_user=None) -> PostResponse:
    like_count = db.query(Like).filter(Like.post_id == post.id).count()
    comment_count = db.query(Comment).filter(Comment.post_id == post.id).count()

    is_liked = False
    if current_user:
        is_liked = db.query(Like).filter(
            Like.post_id == post.id,
            Like.user_id == current_user.id
        ).first() is not None

    return PostResponse(
        id=post.id,
        title=post.title,
        content=post.content,
        user_id=post.user_id,
        community_id=post.community_id,
        project_group_id=post.project_group_id,
        created_at=post.created_at,
        updated_at=post.updated_at,
        like_count=like_count,
        comment_count=comment_count,
        is_liked=is_liked
    )


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if post.community_id is not None:
        member = db.query(CommunityMember).filter(
            CommunityMember.community_id == post.community_id,
            CommunityMember.user_id == current_user.id
        ).first()
        if not member:
            raise HTTPException(status_code=403, detail="You must join this community to post in it")

    if post.project_group_id is not None:
        member = db.query(ProjectGroupMember).filter(
            ProjectGroupMember.project_group_id == post.project_group_id,
            ProjectGroupMember.user_id == current_user.id
        ).first()
        if not member:
            raise HTTPException(status_code=403, detail="You must join this project group to post in it")

    db_post = Post(**post.dict(), user_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return build_post_response(db_post, db, current_user)


@router.get("/", response_model=List[PostResponse])
def get_all_posts(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    community_id: Optional[int] = None,
    project_group_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Post)
    if community_id is not None:
        query = query.filter(Post.community_id == community_id)
    if project_group_id is not None:
        query = query.filter(Post.project_group_id == project_group_id)

    posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    return [build_post_response(p, db, current_user) for p in posts]


@router.get("/{post_id}", response_model=PostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return build_post_response(post, db, current_user)


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    updated_post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this post")

    post.title = updated_post.title
    post.content = updated_post.content
    db.commit()
    db.refresh(post)
    return build_post_response(post, db, current_user)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this post")

    db.delete(post)
    db.commit()
```

### 5c. Modify `app/routers/likes.py`

Adds a notification to the post owner when someone likes their post.

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.like import Like
from app.models.post import Post
from app.auth import get_current_user
from app.notifications_util import create_notification

router = APIRouter(prefix="/likes", tags=["Likes"])


@router.post("/{post_id}")
def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked this post")

    new_like = Like(post_id=post_id, user_id=current_user.id)
    db.add(new_like)
    db.commit()

    if post.user_id != current_user.id:
        create_notification(
            db, post.user_id, "like",
            f"@{current_user.username} liked your post \"{post.title}\"",
            related_id=post_id
        )

    return {"message": "Post liked successfully"}


@router.delete("/{post_id}")
def unlike_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    db.delete(like)
    db.commit()
    return {"message": "Like removed successfully"}
```

### 5d. Modify `app/routers/comments.py`

Adds a notification to the post owner on new comments.

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse
from app.auth import get_current_user
from app.notifications_util import create_notification

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment: CommentCreate,
    post_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = Comment(
        content=comment.content,
        post_id=post_id,
        user_id=current_user.id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    if post.user_id != current_user.id:
        create_notification(
            db, post.user_id, "comment",
            f"@{current_user.username} commented on your post \"{post.title}\"",
            related_id=post_id
        )

    return new_comment


@router.get("/post/{post_id}", response_model=List[CommentResponse])
def get_post_comments(post_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.post_id == post_id).all()
    return comments


@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(
    comment_id: int,
    updated_comment: CommentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this comment")

    comment.content = updated_comment.content
    db.commit()
    db.refresh(comment)
    return comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this comment")

    db.delete(comment)
    db.commit()
```

### 5e. Modify `app/routers/users.py`

Adds: `full_name` / `department` / `academic_year` to `update_me`, a notification on follow,
and `is_liked` propagation into `/users/{id}/posts`. This is the **complete** file —
replace it entirely (it supersedes the version from `BACKEND_PATCH_2.md`).

```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.models.follow import Follow
from app.schemas.user import UserResponse, UserUpdate, UserPublicResponse
from app.schemas.post import PostResponse
from app.auth import get_current_user, get_current_user_optional
from app.notifications_util import create_notification

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

    if updates.full_name is not None:
        current_user.full_name = updates.full_name

    if updates.bio is not None:
        current_user.bio = updates.bio

    if updates.avatar_url is not None:
        current_user.avatar_url = updates.avatar_url

    if updates.department is not None:
        current_user.department = updates.department

    if updates.academic_year is not None:
        current_user.academic_year = updates.academic_year

    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_post_ids = [
        row.id
        for row in db.query(Post.id).filter(Post.user_id == current_user.id).all()
    ]

    if user_post_ids:
        db.query(Like).filter(Like.post_id.in_(user_post_ids)).delete(synchronize_session=False)
        db.query(Comment).filter(Comment.post_id.in_(user_post_ids)).delete(synchronize_session=False)

    db.query(Like).filter(Like.user_id == current_user.id).delete()
    db.query(Comment).filter(Comment.user_id == current_user.id).delete()
    db.query(Follow).filter(
        (Follow.follower_id == current_user.id) | (Follow.following_id == current_user.id)
    ).delete(synchronize_session=False)
    db.query(Post).filter(Post.user_id == current_user.id).delete()

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
        full_name=user.full_name,
        bio=user.bio,
        avatar_url=user.avatar_url,
        department=user.department,
        academic_year=user.academic_year,
        follower_count=follower_count,
        following_count=following_count
    )


@router.get("/{user_id}/posts", response_model=List[PostResponse])
def get_user_posts(
    user_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
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
        is_liked = False
        if current_user:
            is_liked = db.query(Like).filter(
                Like.post_id == post.id, Like.user_id == current_user.id
            ).first() is not None
        result.append(PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            user_id=post.user_id,
            community_id=post.community_id,
            project_group_id=post.project_group_id,
            created_at=post.created_at,
            updated_at=post.updated_at,
            like_count=like_count,
            comment_count=comment_count,
            is_liked=is_liked
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

    create_notification(
        db, user_id, "follow",
        f"@{current_user.username} started following you",
        related_id=current_user.id
    )

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
    followers = [{"id": f.follower.id, "username": f.follower.username} for f in follows]
    return {"followers": followers, "count": len(followers)}


@router.get("/{user_id}/following")
def get_following(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    follows = db.query(Follow).filter(Follow.follower_id == user_id).all()
    following = [{"id": f.following.id, "username": f.following.username} for f in follows]
    return {"following": following, "count": len(following)}
```

### 5f. Modify `app/routers/feed.py`

Adds `is_liked` per viewer.

```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.post import Post
from app.models.follow import Follow
from app.models.like import Like
from app.models.comment import Comment
from app.schemas.post import PostResponse
from app.auth import get_current_user

router = APIRouter(prefix="/feed", tags=["Feed"])


@router.get("/", response_model=List[PostResponse])
def get_feed(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    following_ids = db.query(Follow.following_id).filter(
        Follow.follower_id == current_user.id
    ).subquery()

    posts = db.query(Post).filter(
        Post.user_id.in_(following_ids)
    ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for post in posts:
        like_count = db.query(Like).filter(Like.post_id == post.id).count()
        comment_count = db.query(Comment).filter(Comment.post_id == post.id).count()
        is_liked = db.query(Like).filter(
            Like.post_id == post.id, Like.user_id == current_user.id
        ).first() is not None
        result.append(PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            user_id=post.user_id,
            community_id=post.community_id,
            project_group_id=post.project_group_id,
            created_at=post.created_at,
            updated_at=post.updated_at,
            like_count=like_count,
            comment_count=comment_count,
            is_liked=is_liked
        ))

    return result
```

### 5g. Modify `app/routers/search.py`

Adds `GET /search/communities?q=` alongside the existing posts/users search, and `is_liked` for post search results.

```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.post import Post
from app.models.user import User
from app.models.like import Like
from app.models.comment import Comment
from app.models.follow import Follow
from app.models.community import Community, CommunityMember
from app.schemas.post import PostResponse
from app.schemas.user import UserPublicResponse
from app.schemas.community import CommunityResponse
from app.auth import get_current_user_optional

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/posts", response_model=List[PostResponse])
def search_posts(
    q: str = Query(..., min_length=1),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    posts = db.query(Post).filter(
        Post.title.ilike(f"%{q}%") | Post.content.ilike(f"%{q}%")
    ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for post in posts:
        like_count = db.query(Like).filter(Like.post_id == post.id).count()
        comment_count = db.query(Comment).filter(Comment.post_id == post.id).count()
        is_liked = False
        if current_user:
            is_liked = db.query(Like).filter(
                Like.post_id == post.id, Like.user_id == current_user.id
            ).first() is not None
        result.append(PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            user_id=post.user_id,
            community_id=post.community_id,
            project_group_id=post.project_group_id,
            created_at=post.created_at,
            updated_at=post.updated_at,
            like_count=like_count,
            comment_count=comment_count,
            is_liked=is_liked
        ))

    return result


@router.get("/users", response_model=List[UserPublicResponse])
def search_users(
    q: str = Query(..., min_length=1),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    users = db.query(User).filter(User.username.ilike(f"%{q}%")).offset(skip).limit(limit).all()

    result = []
    for user in users:
        follower_count = db.query(Follow).filter(Follow.following_id == user.id).count()
        following_count = db.query(Follow).filter(Follow.follower_id == user.id).count()
        result.append(UserPublicResponse(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            bio=user.bio,
            avatar_url=user.avatar_url,
            department=user.department,
            academic_year=user.academic_year,
            follower_count=follower_count,
            following_count=following_count
        ))

    return result


@router.get("/communities", response_model=List[CommunityResponse])
def search_communities(
    q: str = Query(..., min_length=1),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    communities = db.query(Community).filter(
        Community.name.ilike(f"%{q}%")
    ).offset(skip).limit(limit).all()

    result = []
    for c in communities:
        member_count = db.query(CommunityMember).filter(CommunityMember.community_id == c.id).count()
        is_member = False
        if current_user:
            is_member = db.query(CommunityMember).filter(
                CommunityMember.community_id == c.id,
                CommunityMember.user_id == current_user.id
            ).first() is not None
        result.append(CommunityResponse(
            id=c.id, name=c.name, description=c.description, icon=c.icon,
            created_by=c.created_by, created_at=c.created_at,
            member_count=member_count, is_member=is_member
        ))

    return result
```

---

## 6. New Routers

### 6a. Create `app/routers/communities.py`

```python
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
```

### 6b. Create `app/routers/resources.py`

File uploads are stored under `uploads/resources/` on disk and served back via the static
mount configured in `app/main.py` (Section 7).

```python
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.resource import Resource
from app.models.community import CommunityMember
from app.models.user import User
from app.schemas.resource import ResourceResponse
from app.auth import get_current_user

router = APIRouter(prefix="/resources", tags=["Resources"])

UPLOAD_DIR = "uploads/resources"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg", ".gif", ".txt"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB


def build_resource_response(resource) -> ResourceResponse:
    return ResourceResponse(
        id=resource.id,
        title=resource.title,
        description=resource.description,
        file_name=resource.file_name,
        file_type=resource.file_type,
        file_size=resource.file_size,
        file_url=f"/uploads/resources/{os.path.basename(resource.file_path)}",
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
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' is not allowed")

    if community_id is not None:
        member = db.query(CommunityMember).filter(
            CommunityMember.community_id == community_id,
            CommunityMember.user_id == current_user.id
        ).first()
        if not member:
            raise HTTPException(status_code=403, detail="You must join this community to upload resources to it")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 20MB)")

    stored_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, stored_name)
    with open(file_path, "wb") as f:
        f.write(contents)

    resource = Resource(
        title=title,
        description=description,
        file_name=file.filename,
        file_path=file_path,
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
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    if not os.path.exists(resource.file_path):
        raise HTTPException(status_code=404, detail="File missing from storage")
    return FileResponse(resource.file_path, filename=resource.file_name)


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

    if os.path.exists(resource.file_path):
        os.remove(resource.file_path)

    db.delete(resource)
    db.commit()
```

### 6c. Create `app/routers/assignments.py`

```python
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
```

### 6d. Create `app/routers/project_groups.py`

```python
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
```

### 6e. Create `app/routers/announcements.py`

Community-scoped announcements can only be posted by that community's admins.
Platform-wide announcements (`community_id = null`) can only be posted by platform
admins (`is_admin = true`, see `BACKEND_PATCH_2.md` Section 5).

```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.announcement import Announcement
from app.models.community import CommunityMember
from app.models.user import User
from app.schemas.announcement import AnnouncementCreate, AnnouncementResponse
from app.auth import get_current_user
from app.notifications_util import create_notification

router = APIRouter(prefix="/announcements", tags=["Announcements"])


@router.post("/", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
def create_announcement(
    announcement: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if announcement.community_id is not None:
        member = db.query(CommunityMember).filter(
            CommunityMember.community_id == announcement.community_id,
            CommunityMember.user_id == current_user.id
        ).first()
        if not member or member.role != "admin":
            raise HTTPException(status_code=403, detail="Only community admins can post announcements here")

        members = db.query(CommunityMember).filter(CommunityMember.community_id == announcement.community_id).all()
        recipients = [m.user_id for m in members if m.user_id != current_user.id]
    else:
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Only platform admins can post platform-wide announcements")
        recipients = [u.id for u in db.query(User).filter(User.id != current_user.id).all()]

    new_announcement = Announcement(
        title=announcement.title,
        content=announcement.content,
        community_id=announcement.community_id,
        pinned=announcement.pinned,
        created_by=current_user.id
    )
    db.add(new_announcement)
    db.commit()
    db.refresh(new_announcement)

    for user_id in recipients:
        create_notification(
            db, user_id, "announcement",
            f"New announcement: {announcement.title}",
            related_id=new_announcement.id
        )

    return new_announcement


@router.get("/", response_model=List[AnnouncementResponse])
def get_announcements(
    community_id: Optional[int] = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Announcement)
    if community_id is not None:
        query = query.filter(Announcement.community_id == community_id)
    else:
        query = query.filter(Announcement.community_id.is_(None))

    return query.order_by(Announcement.pinned.desc(), Announcement.created_at.desc()).offset(skip).limit(limit).all()


@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    if announcement.created_by != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this announcement")

    db.delete(announcement)
    db.commit()
```

### 6f. Create `app/routers/notifications.py`

```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationResponse
from app.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    return {"count": count}


@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif


@router.put("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}
```

### 6g. Create `app/routers/dashboard.py`

A single aggregate endpoint that powers the dashboard home screen — greeting data, the
user's communities, upcoming assignments, recent resources, recent discussions,
announcements, and unread notification count, all in one request.

```python
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.community import Community, CommunityMember
from app.models.resource import Resource
from app.models.assignment import Assignment
from app.models.announcement import Announcement
from app.models.post import Post
from app.models.like import Like
from app.models.comment import Comment
from app.models.notification import Notification
from app.auth import get_current_user
from app.schemas.community import CommunityResponse
from app.schemas.resource import ResourceResponse
from app.schemas.post import PostResponse
from app.schemas.dashboard import DashboardResponse, DashboardUser

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memberships = db.query(CommunityMember).filter(CommunityMember.user_id == current_user.id).all()
    community_ids = [m.community_id for m in memberships]

    communities = db.query(Community).filter(Community.id.in_(community_ids)).all()
    my_communities = [
        CommunityResponse(
            id=c.id, name=c.name, description=c.description, icon=c.icon,
            created_by=c.created_by, created_at=c.created_at,
            member_count=db.query(CommunityMember).filter(CommunityMember.community_id == c.id).count(),
            is_member=True
        )
        for c in communities
    ]

    upcoming_assignments = db.query(Assignment).filter(
        Assignment.community_id.in_(community_ids),
        Assignment.due_date >= datetime.utcnow()
    ).order_by(Assignment.due_date.asc()).limit(5).all()

    resources = db.query(Resource).filter(
        Resource.community_id.in_(community_ids)
    ).order_by(Resource.created_at.desc()).limit(5).all()
    recent_resources = [
        ResourceResponse(
            id=r.id, title=r.title, description=r.description, file_name=r.file_name,
            file_type=r.file_type, file_size=r.file_size,
            file_url=f"/uploads/resources/{os.path.basename(r.file_path)}",
            community_id=r.community_id, uploaded_by=r.uploaded_by, created_at=r.created_at
        )
        for r in resources
    ]

    posts = db.query(Post).filter(
        Post.community_id.in_(community_ids)
    ).order_by(Post.created_at.desc()).limit(5).all()
    recent_discussions = []
    for p in posts:
        like_count = db.query(Like).filter(Like.post_id == p.id).count()
        comment_count = db.query(Comment).filter(Comment.post_id == p.id).count()
        is_liked = db.query(Like).filter(
            Like.post_id == p.id, Like.user_id == current_user.id
        ).first() is not None
        recent_discussions.append(PostResponse(
            id=p.id, title=p.title, content=p.content, user_id=p.user_id,
            community_id=p.community_id, project_group_id=p.project_group_id,
            created_at=p.created_at, updated_at=p.updated_at,
            like_count=like_count, comment_count=comment_count, is_liked=is_liked
        ))

    announcements = db.query(Announcement).filter(
        (Announcement.community_id.is_(None)) | (Announcement.community_id.in_(community_ids))
    ).order_by(Announcement.pinned.desc(), Announcement.created_at.desc()).limit(5).all()

    unread_notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()

    return DashboardResponse(
        user=DashboardUser(username=current_user.username, full_name=current_user.full_name),
        my_communities=my_communities,
        upcoming_assignments=upcoming_assignments,
        recent_resources=recent_resources,
        recent_discussions=recent_discussions,
        announcements=announcements,
        unread_notifications=unread_notifications
    )
```

---

## 7. Modify `app/main.py`

Registers every new model and router, and mounts `/uploads` as a static directory so
uploaded resource files can be downloaded directly by URL.

Replace the entire file with:

```python
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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
import app.models.community
import app.models.resource
import app.models.assignment
import app.models.project_group
import app.models.announcement
import app.models.notification

from app.routers.auth import router as auth_router
from app.routers.posts import router as posts_router
from app.routers.comments import router as comments_router
from app.routers.likes import router as likes_router
from app.routers.users import router as users_router
from app.routers.feed import router as feed_router
from app.routers.search import router as search_router
from app.routers.admin import router as admin_router
from app.routers.communities import router as communities_router
from app.routers.resources import router as resources_router
from app.routers.assignments import router as assignments_router
from app.routers.project_groups import router as project_groups_router
from app.routers.announcements import router as announcements_router
from app.routers.notifications import router as notifications_router
from app.routers.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

os.makedirs("uploads/resources", exist_ok=True)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Study Circle API",
    version="2.0",
    description="Academic Collaboration Platform for Students"
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

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(likes_router)
app.include_router(users_router)
app.include_router(feed_router)
app.include_router(search_router)
app.include_router(admin_router)
app.include_router(communities_router)
app.include_router(resources_router)
app.include_router(assignments_router)
app.include_router(project_groups_router)
app.include_router(announcements_router)
app.include_router(notifications_router)
app.include_router(dashboard_router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Study Circle API",
        "description": "Academic Collaboration Platform for Students"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
```

---

## 8. New / Changed Endpoint Reference

This table is the new ground truth — the frontend rebuild spec is built against it.

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/communities/` | Yes | Creator auto-joins as `admin` |
| GET | `/communities/?skip&limit` | Optional | `is_member` populated if logged in |
| GET | `/communities/mine` | Yes | Communities the user has joined |
| GET | `/communities/{id}` | Optional | |
| POST | `/communities/{id}/join` | Yes | |
| DELETE | `/communities/{id}/leave` | Yes | Blocked if sole admin |
| GET | `/communities/{id}/members` | No | |
| POST | `/resources/` | Yes | `multipart/form-data`: `title`, `description?`, `community_id?`, `file` |
| GET | `/resources/?community_id&skip&limit` | No | |
| GET | `/resources/{id}` | No | Metadata only |
| GET | `/resources/{id}/download` | No | Returns the file |
| DELETE | `/resources/{id}` | Yes (owner/admin) | |
| POST | `/assignments/` | Yes (community member) | Notifies all community members |
| GET | `/assignments/?community_id&upcoming&skip&limit` | No | |
| GET | `/assignments/{id}` | No | |
| PUT | `/assignments/{id}` | Yes (creator) | |
| DELETE | `/assignments/{id}` | Yes (creator) | |
| POST | `/project-groups/` | Yes | Creator auto-joins as `admin` |
| GET | `/project-groups/?skip&limit` | Optional | |
| GET | `/project-groups/mine` | Yes | |
| GET | `/project-groups/{id}` | Optional | |
| POST | `/project-groups/{id}/join` | Yes | |
| DELETE | `/project-groups/{id}/leave` | Yes | |
| GET | `/project-groups/{id}/members` | No | |
| POST | `/announcements/` | Yes | Community admin OR platform admin (if `community_id` null) |
| GET | `/announcements/?community_id&skip&limit` | No | Omit `community_id` for platform-wide |
| DELETE | `/announcements/{id}` | Yes (creator/admin) | |
| GET | `/notifications/?skip&limit` | Yes | |
| GET | `/notifications/unread-count` | Yes | |
| PUT | `/notifications/{id}/read` | Yes | |
| PUT | `/notifications/read-all` | Yes | |
| GET | `/dashboard/` | Yes | Aggregate home-screen payload |
| GET | `/search/communities?q=` | Optional | |

**Changed:**
- `GET /posts/?community_id=&project_group_id=` — both optional filters
- `POST /posts/` — body may now include `community_id` / `project_group_id` (must be a member to post into either)
- All `PostResponse` objects now include `is_liked: bool`
- `UserResponse` / `UserPublicResponse` now include `full_name`, `department`, `academic_year`

---

## 9. Apply Order

```bash
# 1. Apply all file changes above

# 2. Restart the server — create_all() will create the new tables
python main.py
```

No new SQL triggers are needed for this patch — the archive triggers from
`BACKEND_PATCH_2.md` remain unchanged and continue to apply to `users`, `posts`,
and `comments` only.

---

## 10. Seeding Note for the Agent

The platform is empty on first run — there are no communities yet. After applying
this patch, register at least one user and call:

```
POST /communities/  { "name": "Software Engineering", "icon": "💻" }
POST /communities/  { "name": "Database Systems", "icon": "🗄️" }
POST /communities/  { "name": "Networking", "icon": "🌐" }
```

so the frontend has real communities to display instead of an empty state.
