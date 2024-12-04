from sqlalchemy import Boolean, Column, String, Enum
from sqlalchemy.orm import relationship
from auth.constants import UserTypes
from core.models import Base


class Users(Base):
    email = Column(String(254), unique=True)
    username = Column(String(25), unique=True)
    password = Column(String)
    first_name = Column(String(254), nullable=True)
    last_name = Column(String(254), nullable=True)
    is_approved = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    user_type = Column(Enum(UserTypes), nullable=True, default=UserTypes.USER)

    stories = relationship("Stories", back_populates="user")
