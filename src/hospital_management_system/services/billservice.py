from hospital_management_system.models.billsdbmodel import BillDB


def get_all_bills(db):
    return db.query(BillDB).order_by(
        BillDB.id.desc()
    ).all()


def add_bill(db, bill):
    new_bill = BillDB(
        **bill.model_dump()
    )

    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)

    return new_bill


def get_bill_by_id(bill_id, db):
    return db.query(BillDB).filter(
        BillDB.id == bill_id
    ).first()


def update_bill(db, bill_id, bill):
    existing_bill = db.query(BillDB).filter(
        BillDB.id == bill_id
    ).first()

    if existing_bill is None:
        return None

    existing_bill.patient_id = bill.patient_id
    existing_bill.appointment_id = bill.appointment_id
    existing_bill.consultation_fee = bill.consultation_fee
    existing_bill.medicine_charges = bill.medicine_charges
    existing_bill.test_charges = bill.test_charges
    existing_bill.total_amount = bill.total_amount
    existing_bill.payment_status = bill.payment_status
    existing_bill.payment_date = bill.payment_date

    db.commit()
    db.refresh(existing_bill)

    return existing_bill


def delete_bill(db, bill_id):
    bill = db.query(BillDB).filter(
        BillDB.id == bill_id
    ).first()

    if bill is None:
        return None

    db.delete(bill)
    db.commit()

    return {"message": "Bill deleted successfully"}

def get_bills_for_patient(db, patient_id):
    return db.query(BillDB).filter(
        BillDB.patient_id == patient_id
    ).order_by(BillDB.id.desc()).all()