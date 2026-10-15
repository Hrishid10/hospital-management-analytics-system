from sqlalchemy import Column, Integer, String, ForeignKey
from hospital_management_system.database import Base


class PrescriptionDB(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, autoincrement=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    doctor_id = Column(
        Integer,
        ForeignKey("doctors.id"),
        nullable=False
    )

    medical_record_id = Column(
        Integer,
        ForeignKey("medical_records.id"),
        nullable=False
    )

    medicine = Column(String(100), nullable=False)
    dosage = Column(String(100), nullable=False)
    frequency = Column(String(100), nullable=False)
    duration = Column(String(100), nullable=False)
    instructions = Column(String(255), nullable=True)