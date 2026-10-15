from hospital_management_system.models.prescriptiondbmodel import PrescriptionDB


def get_all_prescriptions(db):
    return db.query(PrescriptionDB).order_by(
        PrescriptionDB.id.desc()
    ).all()


def add_prescription(db, prescription):
    new_prescription = PrescriptionDB(
        **prescription.model_dump()
    )

    db.add(new_prescription)
    db.commit()
    db.refresh(new_prescription)

    return new_prescription


def get_prescription_by_id(prescription_id, db):
    return db.query(PrescriptionDB).filter(
        PrescriptionDB.id == prescription_id
    ).first()


def update_prescription(db, prescription_id, prescription):
    existing_prescription = db.query(PrescriptionDB).filter(
        PrescriptionDB.id == prescription_id
    ).first()

    if existing_prescription is None:
        return None

    existing_prescription.patient_id = prescription.patient_id
    existing_prescription.doctor_id = prescription.doctor_id
    existing_prescription.medical_record_id = prescription.medical_record_id
    existing_prescription.medicine = prescription.medicine
    existing_prescription.dosage = prescription.dosage
    existing_prescription.frequency = prescription.frequency
    existing_prescription.duration = prescription.duration
    existing_prescription.instructions = prescription.instructions

    db.commit()
    db.refresh(existing_prescription)

    return existing_prescription


def delete_prescription(db, prescription_id):
    prescription = db.query(PrescriptionDB).filter(
        PrescriptionDB.id == prescription_id
    ).first()

    if prescription is None:
        return None

    db.delete(prescription)
    db.commit()

    return {"message": "Prescription deleted successfully"}

def get_prescriptions_for_patient(db, patient_id):

    return db.query(PrescriptionDB).filter(
        PrescriptionDB.patient_id == patient_id
    ).order_by(
        PrescriptionDB.id.desc()
    ).all()