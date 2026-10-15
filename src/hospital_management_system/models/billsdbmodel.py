from sqlalchemy import Column, Integer, Numeric, String, Date, ForeignKey
from hospital_management_system.database import Base


class BillDB(Base):
    __tablename__ = "bills"

    id = Column(Integer, primary_key=True, autoincrement=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    appointment_id = Column(
        Integer,
        ForeignKey("appointments.id"),
        nullable=False
    )

    consultation_fee = Column(Numeric(10, 2), nullable=False)
    medicine_charges = Column(Numeric(10, 2), nullable=False, default=0)
    test_charges = Column(Numeric(10, 2), nullable=False, default=0)
    total_amount = Column(Numeric(10, 2), nullable=False)

    payment_status = Column(
        String(30),
        nullable=False,
        default="Pending"
    )

    payment_date = Column(Date, nullable=True)