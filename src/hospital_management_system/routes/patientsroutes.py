from fastapi import APIRouter, HTTPException, Depends
from hospital_management_system.models.patientsmodel import Patient, PatientCreate, PatientUpdate
from hospital_management_system.database import get_db
from hospital_management_system.models.patientdbmodel import PatientDB
from hospital_management_system.services.patientservice import get_all_patients, add_patient, get_patient_by_id, update_patient, delete_patient

patient_router = APIRouter()

@patient_router.get("/get-patients")
def hospital_get_patients(db = Depends(get_db)):
    return get_all_patients(db)

@patient_router.post("/add-patient")
def hospital_add_patients(patient: PatientCreate, db = Depends(get_db)):
    return add_patient(db, patient)

@patient_router.get("/get-patient-by-id/{patient_id}")
def hospital_get_patient_by_id(patient_id: int, db = Depends(get_db)):
    patient = get_patient_by_id(patient_id, db)

    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient

@patient_router.put("/update-patient-by-id/{patient_id}")
def hospital_update_patient(patient_id: int, patient: PatientUpdate, db = Depends(get_db)):
    existing_patient = update_patient(db, patient_id, patient)

    if existing_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return existing_patient

@patient_router.delete("/patients/{patient_id}")
def hospital_delete_patient(patient_id: int, db = Depends(get_db)):
    result = delete_patient(db, patient_id)

    if result is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return result
    