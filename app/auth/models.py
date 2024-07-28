from sqlalchemy import Column, String

from core.models import Base


class Users(Base):
    email = Column(String(254), unique=True)
    username = Column(String(25), unique=True)
    password = Column(String)
    first_name = Column(String(254), nullable=True)
    last_name = Column(String(254), nullable=True)
