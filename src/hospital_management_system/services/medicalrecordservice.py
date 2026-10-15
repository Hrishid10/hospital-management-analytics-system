from hospital_management_system.models.medicalrecorddbmodel import MedicalRecordDB


def get_all_medical_records(db):
    return db.query(MedicalRecordDB).order_by(
        MedicalRecordDB.id.desc()
    ).all()


def add_medical_record(db, medical_record):
    new_medical_record = MedicalRecordDB(
        **medical_record.model_dump()
    )

    db.add(new_medical_record)
    db.commit()
    db.refresh(new_medical_record)

    return new_medical_record


def get_medical_record_by_id(medical_record_id, db):
    return db.query(MedicalRecordDB).filter(
        MedicalRecordDB.id == medical_record_id
    ).first()


def update_medical_record(db, medical_record_id, medical_record):
    existing_record = db.query(MedicalRecordDB).filter(
        MedicalRecordDB.id == medical_record_id
    ).first()

    if existing_record is None:
        return None

    existing_record.patient_id = medical_record.patient_id
    existing_record.doctor_id = medical_record.doctor_id
    existing_record.appointment_id = medical_record.appointment_id
    existing_record.diagnosis = medical_record.diagnosis
    existing_record.symptoms = medical_record.symptoms
    existing_record.treatment = medical_record.treatment
    existing_record.notes = medical_record.notes

    db.commit()
    db.refresh(existing_record)

    return existing_record


def delete_medical_record(db, medical_record_id):
    medical_record = db.query(MedicalRecordDB).filter(
        MedicalRecordDB.id == medical_record_id
    ).first()

    if medical_record is None:
        return None

    db.delete(medical_record)
    db.commit()

    return {"message": "Medical record deleted successfully"}

def get_medical_records_for_patient(db, patient_id):

    return db.query(MedicalRecordDB).filter(
        MedicalRecordDB.patient_id == patient_id
    ).order_by(
        MedicalRecordDB.id.desc()
    ).all()

def get_medical_records_by_patient_id(db, patient_id: int):
    return (
        db.query(MedicalRecordDB)
        .filter(MedicalRecordDB.patient_id == patient_id)
        .all()
    )