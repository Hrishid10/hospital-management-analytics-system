from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from enum import Enum


class PaymentStatus(str, Enum):
    PENDING = "Pending"
    PAID = "Paid"


class BillCreate(BaseModel):
    patient_id: int
    appointment_id: int
    consultation_fee: Decimal
    medicine_charges: Decimal = Decimal("0")
    test_charges: Decimal = Decimal("0")
    total_amount: Decimal
    payment_status: PaymentStatus = PaymentStatus.PENDING
    payment_date: date | None = None


class BillUpdate(BaseModel):
    patient_id: int
    appointment_id: int
    consultation_fee: Decimal
    medicine_charges: Decimal
    test_charges: Decimal
    total_amount: Decimal
    payment_status: PaymentStatus
    payment_date: date | None = None