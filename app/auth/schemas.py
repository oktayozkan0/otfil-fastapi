from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserSignupRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=5, max_length=25)
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    @field_validator("username")
    def reject_email(cls, v):
        if "@" in v:
            raise ValueError("Username can not contain '@' symbol")
        return v

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str

class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None

class UserSystem(BaseModel):
    email: EmailStr
    username: str
    first_name: str | None = None
    last_name: str | None = None
