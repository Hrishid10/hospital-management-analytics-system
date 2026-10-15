from pydantic import BaseModel

class MedicalRecordCreate(BaseModel):
    
    patient_id: int
    doctor_id: int
    appointment_id: int
    diagnosis: str
    symptoms: str
    treatment: str
    notes: str

class MedicalRecordUpdate(BaseModel):

    patient_id: int
    doctor_id: int
    appointment_id: int
    diagnosis: str
    symptoms: str
    treatment: str
    notes: str