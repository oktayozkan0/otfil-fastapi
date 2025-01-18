from typing import Optional
import string

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    model_validator
)

from auth.exceptions import PasswordsDoesNotMatchException
from auth.constants import UserTypes

from core.config import get_app_settings


settings = get_app_settings()


class UserSignupRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=5, max_length=25)
    password: str = Field(..., min_length=8)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar: str | None = None

    @field_validator("username")
    def username_validator(cls, v: str):
        combined: str = string.ascii_lowercase + string.digits + string.ascii_uppercase # noqa
        combined = combined + "_.-"
        for c in v:
            if c not in combined:
                raise ValueError("Username can not contain special letters")
        return v


class UserSignupResponse(BaseModel):
    email: EmailStr
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar: str | None = None


class UserGetResponse(BaseModel):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    access_token_expire_min: int = settings.access_token_expire_minutes
    refresh_token_expire_min: int = settings.refresh_token_expire_minutes


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
    avatar: str | None = None


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)
    confirm_new_password: str = Field(..., min_length=8)

    @model_validator(mode="after")
    def new_pass_and_confirm_new_pass_same(self):
        if self.new_password != self.confirm_new_password:
            raise PasswordsDoesNotMatchException
        return self


class VerificationCodeRequest(BaseModel):
    code: str = Field(..., max_length=6, min_length=6)


class UserGetMeResponse(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str
    is_approved: bool
    is_active: bool
    user_type: UserTypes
    avatar: str | None = None


class UserUpdateRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    avatar: str | None = None
