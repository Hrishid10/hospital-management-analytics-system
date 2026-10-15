from hospital_management_system.models.patientdbmodel import PatientDB

# get all patients data
def get_all_patients(db):
    return db.query(PatientDB).order_by(
        PatientDB.id.desc()
    ).all()

# add patient to data
def add_patient(db, patient):
    new_patient = PatientDB(**patient.model_dump())
    
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    
    return new_patient

# get any patient by its id
def get_patient_by_id(patient_id, db):
    patient = db.query(PatientDB).filter(PatientDB.id == patient_id).first()
    return patient

# update or modify any patient data by its id
def update_patient(db, patient_id, patient):
    existing_patient = db.query(PatientDB).filter(
        PatientDB.id == patient_id
    ).first()

    if existing_patient is None:
        return None

    existing_patient.name = patient.name
    existing_patient.age = patient.age
    existing_patient.gender = patient.gender
    existing_patient.phone = patient.phone
    existing_patient.blood_group = patient.blood_group

    db.commit()
    db.refresh(existing_patient)

    return existing_patient

# remove or delete any patient data by its id
def delete_patient(db, patient_id):
    patient = db.query(PatientDB).filter(PatientDB.id == patient_id).first()

    if patient is None:
        return None
    
    db.delete(patient)
    db.commit()
    
    return {"message": "Patient deleted successfully"}
    