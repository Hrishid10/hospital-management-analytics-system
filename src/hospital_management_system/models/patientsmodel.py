from pydantic import BaseModel

class Patient(BaseModel):

    id: int
    name: str
    age: int
    gender: str
    phone: str
    blood_group: str

class PatientCreate(BaseModel):
    
    name: str
    age: int
    gender: str
    phone: str
    blood_group: str

class PatientUpdate(BaseModel):
    
    name: str
    age: int
    gender: str
    phone: str
    blood_group: str
