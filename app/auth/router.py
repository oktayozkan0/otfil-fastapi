from auth.dependencies import get_current_user
from auth.schemas import (
    RefreshTokenRequest,
    UserSignupRequest,
    UserSystem,
    ChangePasswordRequest,
    UserSignupResponse
)
from auth.service import AuthService
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/signup",
    summary="Sign up for users",
    name="Sign Up",
    response_model=UserSignupResponse
)
async def create_user(
    data: UserSignupRequest,
    service: AuthService = Depends(AuthService)
):
    return await service.create_user(data)


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(AuthService)
):
    return await service.login_user(form_data)


@router.get("/me")
async def get_me(user: UserSystem = Depends(get_current_user)):
    return user


@router.post("/refresh")
async def refresh_access_token(
    refresh_token: RefreshTokenRequest,
    service: AuthService = Depends(AuthService)
):
    "send your refresh token and it gives you a new access token"
    return await service.refresh_access_token(token=refresh_token)


@router.post("/change-password")
async def change_password(
    password: ChangePasswordRequest,
    user: UserSystem = Depends(get_current_user),
    service: AuthService = Depends(AuthService)
):
    return await service.change_password(password=password, user=user)
