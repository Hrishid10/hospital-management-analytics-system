from fastapi import APIRouter, HTTPException, Depends

from hospital_management_system.models.appointmentsmodel import (
    AppointmentCreate,
    AppointmentUpdate
)

from hospital_management_system.database import get_db

from hospital_management_system.services.appointmentservice import (
    get_all_appointments,
    get_appointments_for_patient,
    add_appointment,
    get_appointment_by_id,
    update_appointment,
    delete_appointment
)

from hospital_management_system.utils.authorization import require_roles
from hospital_management_system.services.userservice import get_patient_id_for_user

appointment_router = APIRouter()

@appointment_router.get("/get-appointments")
def hospital_get_appointments(
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor", "Patient")
    )
):
    if current_user["role"] in ["Admin", "Doctor"]:
        return get_all_appointments(db)

    patient_id = get_patient_id_for_user(
        db,
        current_user["user_id"]
    )

    if patient_id is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not linked"
        )

    return get_appointments_for_patient(
        db,
        patient_id
    )

@appointment_router.post("/add-appointment")
def hospital_add_appointment(
    appointment: AppointmentCreate,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Patient", "Doctor")
    )
):
    result = add_appointment(db, appointment)

    if result is None:
        raise HTTPException(
            status_code=409,
            detail="Doctor already has an appointment at this date and time"
        )

    return result

@appointment_router.get("/get-appointment-by-id/{appointment_id}")
def hospital_get_appointment_by_id(
    appointment_id: int,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor", "Patient")
    )
):
    appointment = get_appointment_by_id(
        appointment_id,
        db
    )

    if appointment is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    if current_user["role"] == "Patient":

        patient_id = get_patient_id_for_user(
            db,
            current_user["user_id"]
        )

        if patient_id is None:
            raise HTTPException(
                status_code=404,
                detail="Patient profile not linked"
            )

        if appointment.patient_id != patient_id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to view this appointment"
            )

    return appointment

@appointment_router.put("/update-appointment-by-id/{appointment_id}")
def hospital_update_appointment(
    appointment_id: int,
    appointment: AppointmentUpdate,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    result = update_appointment(
        db,
        appointment_id,
        appointment
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    if result == "completed":
        raise HTTPException(
            status_code=409,
            detail="Completed appointment cannot be changed"
        )

    if result == "cancelled":
        raise HTTPException(
            status_code=409,
            detail="Cancelled appointment cannot be changed"
        )

    if result == "conflict":
        raise HTTPException(
            status_code=409,
            detail="Doctor already has an appointment at this date and time"
        )

    return result

@appointment_router.delete("/appointments/{appointment_id}")
def hospital_delete_appointment(
    appointment_id: int,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    result = delete_appointment(
        db,
        appointment_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    return result