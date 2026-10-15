from fastapi import APIRouter, Depends

from hospital_management_system.database import get_db
from hospital_management_system.services.analyticsservice import (
    get_hospital_overview, get_doctor_appointment_analytics, get_appointment_status_analytics, get_revenue_analytics, get_appointment_trend_analytics, get_patient_appointment_analytics
)


analytics_router = APIRouter()


@analytics_router.get("/hospital-overview")
def hospital_overview(db=Depends(get_db)):
    return get_hospital_overview(db)

@analytics_router.get("/doctor-appointment-analytics")
def doctor_appointment_analytics(db=Depends(get_db)):
    return get_doctor_appointment_analytics(db)

@analytics_router.get("/appointment-status-analytics")
def appointment_status_analytics(db=Depends(get_db)):
    return get_appointment_status_analytics(db)

@analytics_router.get("/revenue-analytics")
def revenue_analytics(db=Depends(get_db)):
    return get_revenue_analytics(db)

@analytics_router.get("/appointment-trend-analytics")
def appointment_trend_analytics(db=Depends(get_db)):
    return get_appointment_trend_analytics(db)

@analytics_router.get("/patient-appointment-analytics")
def patient_appointment_analytics(db=Depends(get_db)):
    return get_patient_appointment_analytics(db)