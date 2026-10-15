from fastapi import APIRouter, HTTPException, Depends
from hospital_management_system.models.doctorsmodel import DoctorCreate, DoctorUpdate
from hospital_management_system.database import get_db
from hospital_management_system.models.doctordbmodel import DoctorDB
from hospital_management_system.services.doctorservice import get_all_doctors, add_doctor, get_doctor_by_id, update_doctor, delete_doctor
from hospital_management_system.utils.authorization import require_roles

doctor_router = APIRouter()

@doctor_router.get("/get-doctors")
def hospital_get_doctors(
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor", "Patient")
    )
):
    return get_all_doctors(db)


@doctor_router.post("/add-doctor")
def hospital_add_doctor(doctor: DoctorCreate, db = Depends(get_db)):
    return add_doctor(db, doctor)

@doctor_router.get("/get-doctor-by-id/{doctor_id}")
def hospital_get_doctor_by_id(doctor_id: int, db = Depends(get_db)):
    doctor = get_doctor_by_id(doctor_id, db)

    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return doctor

@doctor_router.put("/update-doctor-by-id/{doctor_id}")
def hospital_update_doctor(
    doctor_id: int,
    doctor: DoctorUpdate,
    db=Depends(get_db)
):
    existing_doctor = update_doctor(
        db,
        doctor_id,
        doctor
    )

    if existing_doctor is None:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    return existing_doctor


@doctor_router.delete("/doctors/{doctor_id}")
def hospital_delete_doctor(
    doctor_id: int,
    db=Depends(get_db)
):
    result = delete_doctor(db, doctor_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    return result

