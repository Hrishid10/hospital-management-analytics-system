from fastapi import APIRouter, HTTPException, Depends

from hospital_management_system.models.medicalrecordsmodel import (
    MedicalRecordCreate,
    MedicalRecordUpdate
)

from hospital_management_system.database import get_db

from hospital_management_system.services.medicalrecordservice import (
    get_all_medical_records,
    add_medical_record,
    get_medical_record_by_id,
    update_medical_record,
    delete_medical_record,
    get_medical_records_by_patient_id
)

from hospital_management_system.utils.authorization import require_roles

from hospital_management_system.utils.authorization import require_roles
from hospital_management_system.services.userservice import get_patient_id_for_user
from hospital_management_system.services.medicalrecordservice import (
    get_medical_records_for_patient
)

medical_record_router = APIRouter()

@medical_record_router.get("/get-medical-records")
def hospital_get_medical_records(
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    return get_all_medical_records(db)

@medical_record_router.post("/add-medical-record")
def hospital_add_medical_record(
    medical_record: MedicalRecordCreate,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    return add_medical_record(
        db,
        medical_record
    )

@medical_record_router.get("/get-medical-record-by-id/{medical_record_id}")
def hospital_get_medical_record_by_id(
    medical_record_id: int,
    db=Depends(get_db)
):
    medical_record = get_medical_record_by_id(
        medical_record_id,
        db
    )

    if medical_record is None:
        raise HTTPException(
            status_code=404,
            detail="Medical record not found"
        )

    return medical_record

@medical_record_router.put(
    "/update-medical-record-by-id/{medical_record_id}"
)
def hospital_update_medical_record(
    medical_record_id: int,
    medical_record: MedicalRecordUpdate,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    result = update_medical_record(
        db,
        medical_record_id,
        medical_record
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Medical record not found"
        )

    return result

@medical_record_router.delete(
    "/medical-records/{medical_record_id}"
)
def hospital_delete_medical_record(
    medical_record_id: int,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    result = delete_medical_record(
        db,
        medical_record_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Medical record not found"
        )

    return result

@medical_record_router.get("/my-medical-records")
def hospital_get_my_medical_records(
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Patient")
    )
):
    patient_id = get_patient_id_for_user(
        db,
        current_user["user_id"]
    )

    if patient_id is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not linked"
        )

    return get_medical_records_for_patient(
        db,
        patient_id
    )

@medical_record_router.get("/my-medical-records")
def hospital_get_my_medical_records(
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Patient")
    )
):
    patient_id = get_patient_id_for_user(
        db,
        current_user["user_id"]
    )

    if patient_id is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    return get_medical_records_by_patient_id(
        db,
        patient_id
    )