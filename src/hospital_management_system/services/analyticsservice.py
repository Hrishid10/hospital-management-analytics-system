from sqlalchemy import func
import pandas as pd
from hospital_management_system.models.patientdbmodel import PatientDB
from hospital_management_system.models.doctordbmodel import DoctorDB
from hospital_management_system.models.appointmentdbmodel import AppointmentDB
from hospital_management_system.models.billsdbmodel import BillDB

def get_hospital_overview(db):

    total_patients = db.query(func.count(PatientDB.id)).scalar()

    total_doctors = db.query(func.count(DoctorDB.id)).scalar()

    total_appointments = db.query(
        func.count(AppointmentDB.id)
    ).scalar()

    scheduled_appointments = db.query(
        func.count(AppointmentDB.id)
    ).filter(
        AppointmentDB.status == "Scheduled"
    ).scalar()

    completed_appointments = db.query(
        func.count(AppointmentDB.id)
    ).filter(
        AppointmentDB.status == "Completed"
    ).scalar()

    cancelled_appointments = db.query(
        func.count(AppointmentDB.id)
    ).filter(
        AppointmentDB.status == "Cancelled"
    ).scalar()

    total_bills = db.query(
        func.count(BillDB.id)
    ).scalar()

    total_revenue = db.query(
        func.sum(BillDB.total_amount)
    ).filter(
        BillDB.payment_status == "Paid"
    ).scalar()

    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "scheduled_appointments": scheduled_appointments,
        "completed_appointments": completed_appointments,
        "cancelled_appointments": cancelled_appointments,
        "total_bills": total_bills,
        "total_revenue": total_revenue or 0
    }

def get_doctor_appointment_analytics(db):

    results = db.query(
        DoctorDB.name,
        AppointmentDB.id
    ).join(
        AppointmentDB,
        DoctorDB.id == AppointmentDB.doctor_id
    ).all()

    df = pd.DataFrame(
        results,
        columns=["doctor_name", "appointment_id"]
    )

    if df.empty:
        return []

    analytics = (
        df.groupby("doctor_name")
        .size()
        .reset_index(name="total_appointments")
    )

    return analytics.to_dict(orient="records")

def get_appointment_status_analytics(db):

    results = db.query(
        AppointmentDB.status
    ).all()

    df = pd.DataFrame(
        results,
        columns=["status"]
    )

    if df.empty:
        return []

    analytics = (
        df.groupby("status")
        .size()
        .reset_index(name="total_appointments")
    )

    return analytics.to_dict(orient="records")

def get_revenue_analytics(db):

    results = db.query(
        BillDB.payment_status,
        BillDB.total_amount
    ).all()

    df = pd.DataFrame(
        results,
        columns=["payment_status", "total_amount"]
    )

    if df.empty:
        return []

    analytics = (
        df.groupby("payment_status")["total_amount"]
        .sum()
        .reset_index()
    )

    analytics["total_amount"] = analytics["total_amount"].astype(float)

    return analytics.to_dict(orient="records")

def get_appointment_trend_analytics(db):

    results = db.query(
        AppointmentDB.appointment_date
    ).all()

    df = pd.DataFrame(
        results,
        columns=["appointment_date"]
    )

    if df.empty:
        return []

    analytics = (
        df.groupby("appointment_date")
        .size()
        .reset_index(name="total_appointments")
    )

    analytics["appointment_date"] = (
        analytics["appointment_date"].astype(str)
    )

    return analytics.to_dict(orient="records")

def get_patient_appointment_analytics(db):

    results = db.query(
        PatientDB.name,
        AppointmentDB.id
    ).join(
        AppointmentDB,
        PatientDB.id == AppointmentDB.patient_id
    ).all()

    df = pd.DataFrame(
        results,
        columns=["patient_name", "appointment_id"]
    )

    if df.empty:
        return []

    analytics = (
        df.groupby("patient_name")
        .size()
        .reset_index(name="total_appointments")
    )

    return analytics.to_dict(orient="records")