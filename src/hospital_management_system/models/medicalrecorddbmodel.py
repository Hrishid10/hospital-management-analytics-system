from sqlalchemy import Column, Integer, String, Text, ForeignKey
from hospital_management_system.database import Base


class MedicalRecordDB(Base):
    __tablename__ = "medical_records"

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

    appointment_id = Column(
        Integer,
        ForeignKey("appointments.id"),
        nullable=False
    )

    diagnosis = Column(String(255), nullable=False)
    symptoms = Column(String(255), nullable=True)
    treatment = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)