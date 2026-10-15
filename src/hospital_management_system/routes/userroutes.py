from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hospital_management_system.database import get_db
from hospital_management_system.schemas.user import (
    UserCreate,
    UserLogin
)
from hospital_management_system.services.userservice import (
    create_user,
    authenticate_user,
    get_doctor_for_user,
    get_patient_for_user
)
from hospital_management_system.utils.jwt import create_access_token
from hospital_management_system.utils.auth import get_current_user
from hospital_management_system.utils.authorization import require_role

router = APIRouter()



@router.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # Public registration must always create a Patient account
    patient_user = UserCreate(
        username=user.username,
        email=user.email,
        password=user.password,
        role="Patient"
    )

    result = create_user(db, patient_user)

    if result == "username_exists":
        raise HTTPException(
            status_code=409,
            detail="Username already exists"
        )

    if result == "email_exists":
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    return {
        "message": "User registered successfully",
        "user_id": result.id,
        "username": result.username,
        "email": result.email,
        "role": result.role
    }


@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    authenticated_user = authenticate_user(
        db,
        user.username,
        user.password
    )

    if authenticated_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        authenticated_user.id,
        authenticated_user.username,
        authenticated_user.role
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_my_profile(
    current_user: dict = Depends(get_current_user)
):
    return {
        "message": "Authenticated successfully",
        "user": current_user
    }

@router.get("/admin-only")
def admin_only(
    current_user: dict = Depends(require_role("Admin"))
):
    return {
        "message": "Admin access granted",
        "user": current_user
    }

@router.get("/my-doctor")
def get_my_doctor(
    current_user: dict = Depends(
        require_role("Doctor")
    ),
    db: Session = Depends(get_db)
):
    doctor = get_doctor_for_user(
        db,
        current_user["user_id"]
    )

    if doctor is None:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not linked"
        )

    return {
        "id": doctor.id,
        "name": doctor.name,
        "specialization": doctor.specialization,
        "department": doctor.department
    }

@router.get("/my-patient")
def get_my_patient(
    current_user: dict = Depends(
        require_role("Patient")
    ),
    db: Session = Depends(get_db)
):
    patient = get_patient_for_user(
        db,
        current_user["user_id"]
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not linked"
        )

    return {
        "id": patient.id,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender,
        "phone": patient.phone,
        "blood_group": patient.blood_group
    }