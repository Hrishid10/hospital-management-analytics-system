from pydantic import BaseModel

class PrescriptionCreate(BaseModel):
    patient_id: int
    doctor_id: int
    medical_record_id: int
    medicine: str
    dosage: str
    frequency: str
    duration: str
    instructions: str

class PrescriptionUpdate(BaseModel):
    patient_id: int
    doctor_id: int
    medical_record_id: int
    medicine: str
    dosage: str
    frequency: str
    duration: str
    instructions: str