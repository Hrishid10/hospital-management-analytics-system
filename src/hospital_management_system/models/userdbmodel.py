from sqlalchemy import Column, Integer, String
from hospital_management_system.database import Base


class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)

    username = Column(String(50), nullable=False, unique=True)

    email = Column(String(100), nullable=False, unique=True)

    password_hash = Column(String(255), nullable=False)

    role = Column(String(20), nullable=False)