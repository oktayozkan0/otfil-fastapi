from pydantic import BaseModel

from auth.constants import UserTypes


class UserSearchParams(BaseModel):
    email: str | None = None
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    user_type: UserTypes | None = None


class UserListResponse(BaseModel):
    email: str | None
    username: str | None
    first_name: str | None
    last_name: str | None
    user_type: UserTypes | None
    is_approved: bool | None
    is_active: bool | None
    avatar: str | None


class UserEditRequest(BaseModel):
    email: str | None = None
    username: str | None = None
    password: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    is_approved: bool | None = None
    is_active: bool | None = None
    user_type: UserTypes | None = None
    avatar: str | None = None
