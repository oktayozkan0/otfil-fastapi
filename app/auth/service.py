from sqlalchemy import select

from core.services import BaseService
from schemas import UserSignupRequest


class AuthService(BaseService):
    async def create_user(self, payload: UserSignupRequest):
        user = select
