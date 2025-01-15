from fastapi import APIRouter, Depends

from users.service import UserService


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{username}")
async def get_user(
    username: str,
    service: UserService = Depends(UserService)
):
    return await service.get_user(username)
