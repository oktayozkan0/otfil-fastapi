import redis
import json

from core.config import get_app_settings


settings = get_app_settings()

redis_conn = redis.from_url(settings.redis_url.unicode_string())

async def get_user_refresh_token(email: str) -> str:
    key = f"refresh_token:{email}"
    token = redis_conn.get(key)
    return token

async def set_user_refresh_token(token: str, email: str) -> None:
    key = f"refresh_token:{email}"
    redis_conn.set(key, token, ex=settings.refresh_token_expire_minutes*60)