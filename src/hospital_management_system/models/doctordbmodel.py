from sqlalchemy import Column, Integer, String, ForeignKey
from hospital_management_system.database import Base

class DoctorDB(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False)
    email = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)
