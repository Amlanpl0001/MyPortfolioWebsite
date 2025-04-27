from pydantic import BaseModel, EmailStr, Field, validator
import re
from typing import Optional
from datetime import datetime

# Password validation regex
PASSWORD_PATTERN = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    role: str = "practice"

    @validator("password")
    def password_strength(cls, v):
        """Validate password strength"""
        if not re.match(PASSWORD_PATTERN, v):
            raise ValueError(
                "Password must be at least 8 characters and contain at least one uppercase letter, "
                "one lowercase letter, one number, and one special character"
            )
        return v

    @validator("role")
    def validate_role(cls, v):
        """Validate user role"""
        allowed_roles = ["admin", "practice"]
        if v not in allowed_roles:
            raise ValueError(f"Role must be one of: {', '.join(allowed_roles)}")
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    password: Optional[str] = Field(None, min_length=8, max_length=100)
    is_active: Optional[bool] = None

    @validator("password")
    def password_strength(cls, v):
        """Validate password strength if provided"""
        if v is not None and not re.match(PASSWORD_PATTERN, v):
            raise ValueError(
                "Password must be at least 8 characters and contain at least one uppercase letter, "
                "one lowercase letter, one number, and one special character"
            )
        return v

class UserInDBBase(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        orm_mode = True

class User(UserInDBBase):
    """User model returned to client"""
    pass

class UserLogin(BaseModel):
    username: str
    password: str

    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "password": "StrongP@ssw0rd"
            }
        }

class PasswordReset(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)

    @validator("new_password")
    def password_strength(cls, v):
        """Validate password strength"""
        if not re.match(PASSWORD_PATTERN, v):
            raise ValueError(
                "Password must be at least 8 characters and contain at least one uppercase letter, "
                "one lowercase letter, one number, and one special character"
            )
        return v

    class Config:
        schema_extra = {
            "example": {
                "token": "abcdef123456",
                "new_password": "NewStrongP@ssw0rd"
            }
        }