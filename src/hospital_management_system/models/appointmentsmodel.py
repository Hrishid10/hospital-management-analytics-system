from pydantic import BaseModel
from datetime import date, time
from enum import Enum

class AppointmentStatus(str, Enum):
    SCHEDULED = "Scheduled"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class AppointmentCreate(BaseModel):

    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    reason: str

class AppointmentUpdate(BaseModel):

    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    reason: str
    status: AppointmentStatus

