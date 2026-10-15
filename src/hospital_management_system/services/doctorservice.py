from hospital_management_system.models.doctordbmodel import DoctorDB

# get all doctors data
def get_all_doctors(db):
    return db.query(DoctorDB).order_by(
        DoctorDB.id.desc()
    ).all()

# add doctor to data
def add_doctor(db, doctor):
    new_doctor = DoctorDB(**doctor.model_dump())
        
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
        
    return new_doctor

# get any doctor data by its id
def get_doctor_by_id(doctor_id, db):
    doctor = db.query(DoctorDB).filter(DoctorDB.id == doctor_id).first()
    return doctor

# update doctor
def update_doctor(db, doctor_id, doctor):
    existing_doctor = db.query(DoctorDB).filter(
        DoctorDB.id == doctor_id
    ).first()

    if existing_doctor is None:
        return None

    existing_doctor.name = doctor.name
    existing_doctor.specialization = doctor.specialization
    existing_doctor.phone = doctor.phone
    existing_doctor.email = doctor.email
    existing_doctor.department = doctor.department

    db.commit()
    db.refresh(existing_doctor)

    return existing_doctor


# delete doctor
def delete_doctor(db, doctor_id):
    doctor = db.query(DoctorDB).filter(
        DoctorDB.id == doctor_id
    ).first()

    if doctor is None:
        return None

    db.delete(doctor)
    db.commit()

    return {"message": "Doctor deleted successfully"}