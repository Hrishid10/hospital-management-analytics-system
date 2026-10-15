from hospital_management_system.models.appointmentdbmodel import AppointmentDB

# get all appointment data
def get_all_appointments(db):
    return db.query(AppointmentDB).order_by(
        AppointmentDB.id.desc()
    ).all()

# add new appointment data 
def add_appointment(db, appointment):
    appointment_check = db.query(AppointmentDB).filter(
        AppointmentDB.doctor_id == appointment.doctor_id,
        AppointmentDB.appointment_date == appointment.appointment_date,
        AppointmentDB.appointment_time == appointment.appointment_time
    ).first()

    if appointment_check is not None:
        return None

    new_appointment = AppointmentDB(**appointment.model_dump())

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return new_appointment

# get any appointment data by its id
def get_appointment_by_id(appointment_id, db):
    appointment = db.query(AppointmentDB).filter(
        AppointmentDB.id == appointment_id
    ).first()

    return appointment

# update any appointment data by its id
def update_appointment(db, appointment_id, appointment):
    existing_appointment = db.query(AppointmentDB).filter(
        AppointmentDB.id == appointment_id
    ).first()

    if existing_appointment is None:
        return None

    if existing_appointment.status == "Completed":
        return "completed"

    if existing_appointment.status == "Cancelled":
        return "cancelled"

    conflicting_appointment = db.query(AppointmentDB).filter(
    AppointmentDB.doctor_id == appointment.doctor_id,
    AppointmentDB.appointment_date == appointment.appointment_date,
    AppointmentDB.appointment_time == appointment.appointment_time,
    AppointmentDB.id != appointment_id
    ).first()

    if conflicting_appointment is not None:
        return "conflict"

    existing_appointment.patient_id = appointment.patient_id
    existing_appointment.doctor_id = appointment.doctor_id
    existing_appointment.appointment_date = appointment.appointment_date
    existing_appointment.appointment_time = appointment.appointment_time
    existing_appointment.reason = appointment.reason
    existing_appointment.status = appointment.status

    db.commit()
    db.refresh(existing_appointment)

    return existing_appointment

# delete any appointment data 
def delete_appointment(db, appointment_id):
    appointment = db.query(AppointmentDB).filter(
        AppointmentDB.id == appointment_id
    ).first()

    if appointment is None:
        return None

    db.delete(appointment)
    db.commit()

    return {"message": "Appointment deleted successfully"}

def get_appointments_for_patient(db, patient_id):

    return db.query(AppointmentDB).filter(
        AppointmentDB.patient_id == patient_id
    ).order_by(
        AppointmentDB.id.desc()
    ).all()