from core.models import Base
from sqlalchemy import Boolean, Column, String


class Users(Base):
    email = Column(String(254), unique=True)
    username = Column(String(25), unique=True)
    password = Column(String)
    first_name = Column(String(254), nullable=True)
    last_name = Column(String(254), nullable=True)
    is_approved = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
