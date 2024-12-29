from datetime import UTC, datetime
from auth.exceptions import (
    AlreadyExistsException,
    InvalidCredentialsException,
    UnauthorizedException,
    WrongPasswordException,
    UserNotFoundException
)
from auth.models import Users
from auth.schemas import (
    RefreshTokenRequest,
    TokenPayload,
    TokenResponse,
    UserSignupRequest,
    ChangePasswordRequest,
    UserSystem,
    VerificationCodeRequest
)
from auth.utils import (
    ALGORITHM,
    JWT_REFRESH_SECRET_KEY,
    create_access_token,
    create_refresh_token,
    get_hashed_password,
    verify_password
)
from core.redis import (
    get_user_refresh_token,
    set_user_refresh_token,
    get_user_verification_code,
    set_user_verification_code
)
from core.services import BaseService
from fastapi.security import OAuth2PasswordRequestForm
from starlette.responses import JSONResponse
from jose import jwt
from sqlalchemy import select, update
from auth.utils import generate_verification_code
from mailing.mail import fm
from fastapi_mail import MessageSchema, MessageType
from core.templating import templates


class AuthService(BaseService):
    async def create_user(self, payload: UserSignupRequest):
        # Check if email or username is already in use
        stmt = select(Users).where(
            (
                Users.email == payload.email
            ) | (
                Users.username == payload.username
            )
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        in_uses = []

        if instances:
            for instance in instances:
                if payload.email == instance.email and "email" not in in_uses:
                    in_uses.append("email")
                if payload.username == instance.username and "username" not in in_uses: # noqa
                    in_uses.append("username")

        # Raise an exception if email or username is already taken
        if in_uses:
            detail = " and ".join(in_uses)
            verb = "are" if len(in_uses) == 2 else "is"
            raise AlreadyExistsException(
                detail=f"{detail} {verb} already in use"
            )

        # Hash password and create the user
        payload.password = get_hashed_password(payload.password)
        new_user = Users(**payload.model_dump())
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)  # Refresh to get the new user's ID and other auto-filled fields # noqa

        return new_user  # Return the newly created user

    async def login_user(self, form_data: OAuth2PasswordRequestForm):
        stmt = (
            select(Users)
            .where(
                (
                    Users.username == form_data.username
                ) | (
                    Users.email == form_data.username
                )
            )
        )
        result = await self.db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user or not verify_password(form_data.password, user.password):
            raise InvalidCredentialsException

        # Generate tokens
        access_token = create_access_token(user.email)
        refresh_token = await get_user_refresh_token(email=user.email)

        if not refresh_token:
            refresh_token = create_refresh_token(user.email)
            await set_user_refresh_token(refresh_token, user.email)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )

    async def refresh_access_token(self, token: RefreshTokenRequest):
        # Decode and validate refresh token
        try:
            payload = jwt.decode(
                token=token.refresh_token,
                key=JWT_REFRESH_SECRET_KEY,
                algorithms=[ALGORITHM]
            )
            token_data = TokenPayload(**payload)
            token_timestamp = datetime.fromtimestamp(token_data.exp, UTC)
            now = datetime.now(UTC)
            if token_timestamp < now:
                raise UnauthorizedException
        except jwt.JWTError:
            raise InvalidCredentialsException

        # Compare token in Redis
        db_refresh_token = await get_user_refresh_token(token_data.sub)
        if db_refresh_token.decode("utf-8") != token.refresh_token:
            raise InvalidCredentialsException

        # Generate a new access token
        new_access_token = create_access_token(token_data.sub)
        return TokenResponse(
            access_token=new_access_token,
            refresh_token=db_refresh_token
        )

    async def change_password(
            self,
            password: ChangePasswordRequest,
            user: UserSystem
    ):
        # Verify current password
        if not verify_password(password.old_password, user.password):
            raise WrongPasswordException

        # Hash new password and update it in the database
        hashed_password = get_hashed_password(password.new_password)
        stmt = (
            update(Users)
            .where(Users.id == user.id)
            .values(password=hashed_password)
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def get_user(self, user: UserSystem):
        stmt = select(Users).where(Users.email == user.email)
        results = await self.db.execute(stmt)
        instance = results.scalar_one_or_none()
        if not instance:
            raise UserNotFoundException
        return instance

    async def send_user_verification_code(self, user: UserSystem):
        user_db = await self.get_user(user)

        if user_db.is_active:
            JSONResponse({"message": "user already active"}, status_code=200)

        code = generate_verification_code()

        template = templates.get_template("verification_code.html")
        content = template.render(code=code)
        message = MessageSchema(
            subject="OTFIL - Verify Your Account",
            recipients=[user.email],
            body=content,
            subtype=MessageType.html
        )
        await fm.send_message(message)
        await set_user_verification_code(code, user.email)

    async def verify_user_code(
            self,
            user: UserSystem,
            code: VerificationCodeRequest
    ):
        user_db = await self.get_user(user)

        if not user_db.is_active:
            return JSONResponse(
                {"message": "user deactivated"},
                status_code=200
            )
        if user_db.is_approved:
            return JSONResponse(
                {"message": "user is already approved"},
                status_code=200
            )

        rds_code: bytes = await get_user_verification_code(user.email)
        rds_code = rds_code.decode("utf-8")
        if not rds_code:
            return JSONResponse({"message": "code expired"}, status_code=400)

        if rds_code != code.code:
            return JSONResponse({"message": "invalid code"}, status_code=400)

        user_db.is_active = True
        user_db.is_approved = True
        await self.db.commit()
        return JSONResponse({"message": "user verified"}, status_code=200)
