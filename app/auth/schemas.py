from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from auth.exceptions import PasswordsDoesNotMatchException
from auth.constants import UserTypes


class UserSignupRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=5, max_length=25)
    password: str = Field(..., min_length=8)
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    @field_validator("username")
    def reject_email(cls, v):
        if "@" in v:
            raise ValueError("Username can not contain '@' symbol")
        return v

class UserSignupResponse(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=5, max_length=25)
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None

class UserSystem(BaseModel):
    id: int
    email: EmailStr
    username: str
    password: str
    first_name: str | None = None
    last_name: str | None = None
    user_type: UserTypes | None = None

class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)
    confirm_new_password: str = Field(..., min_length=8)

    @model_validator(mode="after")
    def new_pass_and_confirm_new_pass_same(self):
        if self.new_password != self.confirm_new_password:
            raise PasswordsDoesNotMatchException
        return self
