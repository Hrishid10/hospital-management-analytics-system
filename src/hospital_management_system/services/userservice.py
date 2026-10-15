from hospital_management_system.models.userdbmodel import UserDB
from hospital_management_system.utils.security import (
    hash_password,
    verify_password
)
from hospital_management_system.models.doctordbmodel import DoctorDB
from hospital_management_system.models.patientdbmodel import PatientDB


def create_user(db, user):

    existing_username = db.query(UserDB).filter(
        UserDB.username == user.username
    ).first()

    if existing_username is not None:
        return "username_exists"

    existing_email = db.query(UserDB).filter(
        UserDB.email == user.email
    ).first()

    if existing_email is not None:
        return "email_exists"

    hashed_password = hash_password(user.password)

    new_user = UserDB(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

def authenticate_user(db, username, password):

    user = db.query(UserDB).filter(
        UserDB.username == username
    ).first()

    if user is None:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user

def get_doctor_for_user(db, user_id):

    doctor = db.query(DoctorDB).filter(
        DoctorDB.user_id == user_id
    ).first()

    return doctor

def get_patient_for_user(db, user_id):

    patient = db.query(PatientDB).filter(
        PatientDB.user_id == user_id
    ).first()

    return patient

def get_patient_id_for_user(db, user_id):

    patient = db.query(PatientDB).filter(
        PatientDB.user_id == user_id
    ).first()

    if patient is None:
        return None

    return patient.id