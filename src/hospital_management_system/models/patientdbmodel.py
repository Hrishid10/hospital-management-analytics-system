from sqlalchemy import Column, Integer, String, ForeignKey
from hospital_management_system.database import Base

class PatientDB(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    phone = Column(String(15), nullable=False)
    blood_group = Column(String(5), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)