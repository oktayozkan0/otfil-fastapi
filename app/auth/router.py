from fastapi import APIRouter, Depends

from auth.schemas import UserSignupRequest
from auth.service import AuthService

router = APIRouter(prefix="/auth")

@router.post('/signup', summary="Create new user")
async def create_user(data: UserSignupRequest, service: AuthService = Depends(AuthService)):
    return await service.create_user(data)
