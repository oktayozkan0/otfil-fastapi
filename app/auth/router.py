from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from auth.schemas import UserSignupRequest, UserSystem, RefreshTokenRequest
from auth.service import AuthService
from auth.dependencies import get_current_user


router = APIRouter(prefix="/auth")

@router.post("/signup")
async def create_user(data: UserSignupRequest, service: AuthService = Depends(AuthService)):
    return await service.create_user(data)

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), service: AuthService = Depends(AuthService)):
    return await service.login_user(form_data)

@router.get("/me")
async def get_me(user: UserSystem = Depends(get_current_user)):
    return user

@router.post("/refresh")
async def refresh_access_token(refresh_token: RefreshTokenRequest, service: AuthService = Depends(AuthService)):
    return await service.refresh_access_token(token=refresh_token)
