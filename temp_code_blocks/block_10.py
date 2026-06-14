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