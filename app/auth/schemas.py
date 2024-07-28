from pydantic import BaseModel, EmailStr, Field, field_validator


class UserSignupRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=5, max_length=25)
    password: str

    @field_validator("username")
    def reject_email(cls, v):
        if "@" in v:
            raise ValueError("Username can not contain '@' symbol")
        return v
