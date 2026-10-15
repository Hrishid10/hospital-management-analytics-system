from fastapi import APIRouter, HTTPException, Depends

from hospital_management_system.models.billsmodel import (
    BillCreate,
    BillUpdate
)

from hospital_management_system.database import get_db

from hospital_management_system.services.billservice import (
    get_all_bills,
    add_bill,
    get_bill_by_id,
    update_bill,
    delete_bill,
    get_bills_for_patient
)

from hospital_management_system.utils.authorization import require_roles
from hospital_management_system.services.userservice import get_patient_id_for_user

bill_router = APIRouter()


@bill_router.get("/get-bills")
def hospital_get_bills(
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor", "Patient")
    )
):
    if current_user["role"] in ["Admin", "Doctor"]:
        return get_all_bills(db)

    patient_id = get_patient_id_for_user(
        db,
        current_user["user_id"]
    )

    if patient_id is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not linked"
        )

    return get_bills_for_patient(
        db,
        patient_id
    )


@bill_router.post("/add-bill")
def hospital_add_bill(
    bill: BillCreate,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor")
    )
):
    return add_bill(db, bill)


@bill_router.get("/get-bill-by-id/{bill_id}")
def hospital_get_bill_by_id(
    bill_id: int,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin", "Doctor", "Patient")
    )
):
    bill = get_bill_by_id(
        bill_id,
        db
    )

    if bill is None:
        raise HTTPException(
            status_code=404,
            detail="Bill not found"
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

        if bill.patient_id != patient_id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to view this bill"
            )

    return bill


@bill_router.put("/update-bill-by-id/{bill_id}")
def hospital_update_bill(
    bill_id: int,
    bill: BillUpdate,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin")
    )
):
    existing_bill = update_bill(
        db,
        bill_id,
        bill
    )

    if existing_bill is None:
        raise HTTPException(
            status_code=404,
            detail="Bill not found"
        )

    return existing_bill


@bill_router.delete("/bills/{bill_id}")
def hospital_delete_bill(
    bill_id: int,
    db=Depends(get_db),
    current_user: dict = Depends(
        require_roles("Admin")
    )
):
    result = delete_bill(db, bill_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Bill not found"
        )

    return result