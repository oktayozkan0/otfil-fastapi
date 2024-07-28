from sqlalchemy import Column, String

from core.models import Base


class Users(Base):
    email = Column(String(254))
    username = Column(String(25))
    password = Column(String)
