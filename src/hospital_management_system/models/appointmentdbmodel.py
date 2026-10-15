from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from hospital_management_system.database import Base


class AppointmentDB(Base):
    __tablename__ = "appointments"

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

    appointment_date = Column(Date, nullable=False)

    appointment_time = Column(Time, nullable=False)

    reason = Column(String(255), nullable=True)

    status = Column(
        String(30),
        nullable=False,
        default="Scheduled"
    )