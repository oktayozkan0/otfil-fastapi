from core.config import get_app_settings
from redis.asyncio import Redis


settings = get_app_settings()

redis_conn = Redis.from_url(settings.redis_url.unicode_string())


async def get_user_refresh_token(email: str) -> str:
    key = f"refresh_token:{email}"
    token = await redis_conn.get(key)
    return token


async def set_user_refresh_token(token: str, email: str) -> None:
    key = f"refresh_token:{email}"
    await redis_conn.set(
        key,
        token,
        ex=settings.refresh_token_expire_minutes * 60
    )


async def set_user_verification_code(code: str, email: str) -> None:
    key = f"verification_code:{email}"
    await redis_conn.set(key, code, ex=1800)


async def get_user_verification_code(email: str) -> str:
    key = f"verification_code:{email}"
    code = await redis_conn.get(key)
    return code
