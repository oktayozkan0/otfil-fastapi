from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from auth.schemas import UserSignupRequest
from auth.service import AuthService


router = APIRouter(prefix="/auth")

@router.post("/signup")
async def create_user(data: UserSignupRequest, service: AuthService = Depends(AuthService)):
    return await service.create_user(data)

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), service: AuthService = Depends(AuthService)):
    return await service.login_user(form_data)
