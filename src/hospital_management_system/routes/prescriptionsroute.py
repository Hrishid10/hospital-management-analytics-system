from fastapi import APIRouter, HTTPException, Depends

from hospital_management_system.models.prescriptionsmodel import (
    PrescriptionCreate,
    PrescriptionUpdate
)

from hospital_management_system.database import get_db

from hospital_management_system.services.prescriptionservice import (
    get_all_prescriptions,
    add_prescription,
    get_prescription_by_id,
    update_prescription,
    delete_prescription
)

from hospital_management_system.utils.authorization import require_roles
from hospital_management_system.services.userservice import get_patient_id_for_user
from hospital_management_system.services.prescriptionservice import (
    get_prescriptions_for_patient
)

prescription_router = APIRouter()

@prescription_router.get("/get-prescriptions")
def hospital_get_prescriptions(
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor", "Patient")
    )
):
    if current_user["role"] in ["Admin", "Doctor"]:
        return get_all_prescriptions(db)

    patient_id = get_patient_id_for_user(
        db,
        current_user["user_id"]
    )

    if patient_id is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not linked"
        )

    return get_prescriptions_for_patient(
        db,
        patient_id
    )


@prescription_router.post("/add-prescription")
def hospital_add_prescription(
    prescription: PrescriptionCreate,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    return add_prescription(
        db,
        prescription
    )


@prescription_router.get(
    "/get-prescription-by-id/{prescription_id}"
)
def hospital_get_prescription_by_id(
    prescription_id: int,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor", "Patient")
    )
):
    prescription = get_prescription_by_id(
        prescription_id,
        db
    )

    if prescription is None:
        raise HTTPException(
            status_code=404,
            detail="Prescription not found"
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

        if prescription.patient_id != patient_id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to view this prescription"
            )

    return prescription


@prescription_router.put("/update-prescription-by-id/{prescription_id}")
def hospital_update_prescription(
    prescription_id: int,
    prescription: PrescriptionUpdate,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    existing_prescription = update_prescription(
        db,
        prescription_id,
        prescription
    )

    if existing_prescription is None:
        raise HTTPException(
            status_code=404,
            detail="Prescription not found"
        )

    return existing_prescription


@prescription_router.delete("/prescriptions/{prescription_id}")
def hospital_delete_prescription(
    prescription_id: int,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    result = delete_prescription(
        db,
        prescription_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Prescription not found"
        )

    return result