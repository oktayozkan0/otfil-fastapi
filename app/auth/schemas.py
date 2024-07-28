from pydantic import BaseModel, EmailStr, Field


class UserSignupRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=5, max_length=25)
    password: str
