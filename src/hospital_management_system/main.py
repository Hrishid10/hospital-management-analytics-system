from fastapi import FastAPI
from hospital_management_system.database import Base, engine
from hospital_management_system.routes.patientsroutes import patient_router
from hospital_management_system.routes.doctorsroutes import doctor_router
from hospital_management_system.routes.appointmentsroutes import appointment_router
from hospital_management_system.routes.medicalrecordsroute import medical_record_router
from hospital_management_system.routes.prescriptionsroute import prescription_router
from hospital_management_system.routes.billsrouter import bill_router
from hospital_management_system.routes.analyticsroute import analytics_router
from fastapi.middleware.cors import CORSMiddleware
from hospital_management_system.routes.userroutes import router as user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def hospital_management():
    return "Hospital Management System API is running"

app.include_router(patient_router)
app.include_router(doctor_router)
app.include_router(appointment_router)
app.include_router(medical_record_router)
app.include_router(prescription_router)
app.include_router(bill_router)
app.include_router(analytics_router)
app.include_router(user_router)

Base.metadata.create_all(bind=engine)




