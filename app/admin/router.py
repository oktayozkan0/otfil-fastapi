from fastapi import APIRouter, Depends

from admin.service import AdminService
from admin.dependencies import get_admin
from admin.schemas import UserSearchParams, UserListResponse, UserEditRequest
from auth.constants import UserTypes
from core.pagination import LimitOffsetPage


router = APIRouter(
    prefix="/admin",
    dependencies=[Depends(get_admin)],
    tags=["Admin"]
)


@router.get("/users")
async def get_users(
    email: str | None = None,
    username: str | None = None,
    first_name: str | None = None,
    last_name: str | None = None,
    user_type: UserTypes | None = None,
    service: AdminService = Depends(AdminService)
) -> LimitOffsetPage[UserListResponse]:
    params = UserSearchParams(
        email=email,
        username=username,
        first_name=first_name,
        last_name=last_name,
        user_type=user_type
    )
    return await service.get_users(params=params)


@router.post("/users/{username}")
async def edit_user(
    username: str,
    data: UserEditRequest,
    service: AdminService = Depends(AdminService)
):
    return await service.edit_user(username=username, data=data)
