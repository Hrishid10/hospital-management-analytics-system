import axios from "axios"

const API_URL = "http://127.0.0.1:8000"


// Create Axios instance
const api = axios.create({
    baseURL: API_URL
})


// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("access_token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})


export const getHospitalOverview = () => {
    return api.get("/hospital-overview")
}


export const getPatients = () => {
    return api.get("/get-patients")
}

export const addPatient = (patient) => {
    return api.post("/add-patient", patient)
}

export const updatePatient = (patientId, patient) => {
    return api.put(
        `/update-patient-by-id/${patientId}`,
        patient
    )
}

export const deletePatient = (patientId) => {
    return api.delete(
        `/patients/${patientId}`
    )
}


export const getDoctors = () => {
    return api.get("/get-doctors")
}

export const addDoctor = (doctor) => {
    return api.post("/add-doctor", doctor)
}

export const updateDoctor = (doctorId, doctor) => {
    return api.put(
        `/update-doctor-by-id/${doctorId}`,
        doctor
    )
}

export const deleteDoctor = (doctorId) => {
    return api.delete(
        `/doctors/${doctorId}`
    )
}


export const getAppointments = () => {
    return api.get("/get-appointments")
}

export const addAppointment = (appointment) => {
    return api.post(
        "/add-appointment",
        appointment
    )
}

export const updateAppointment = (
    appointmentId,
    appointment
) => {
    return api.put(
        `/update-appointment-by-id/${appointmentId}`,
        appointment
    )
}

export const deleteAppointment = (appointmentId) => {
    return api.delete(
        `/appointments/${appointmentId}`
    )
}


export const getMedicalRecords = () => {
    return api.get("/get-medical-records")
}

export const addMedicalRecord = (medicalRecord) => {
    return api.post(
        "/add-medical-record",
        medicalRecord
    )
}

export const getMyMedicalRecords = () => {
    return api.get("/my-medical-records")
}


export const updateMedicalRecord = (
    medicalRecordId,
    medicalRecord
) => {
    return api.put(
        `/update-medical-record-by-id/${medicalRecordId}`,
        medicalRecord
    )
}

export const deleteMedicalRecord = (
    medicalRecordId
) => {
    return api.delete(
        `/medical-records/${medicalRecordId}`
    )
}


export const getPrescriptions = () => {
    return api.get("/get-prescriptions")
}

export const addPrescription = (prescription) => {
    return api.post(
        "/add-prescription",
        prescription
    )
}

export const updatePrescription = (
    prescriptionId,
    prescription
) => {
    return api.put(
        `/update-prescription-by-id/${prescriptionId}`,
        prescription
    )
}

export const deletePrescription = (
    prescriptionId
) => {
    return api.delete(
        `/prescriptions/${prescriptionId}`
    )
}


export const getBills = () => {
    return api.get("/get-bills")
}

export const addBill = (bill) => {
    return api.post(
        "/add-bill",
        bill
    )
}

export const updateBill = (
    billId,
    bill
) => {
    return api.put(
        `/update-bill-by-id/${billId}`,
        bill
    )
}

export const deleteBill = (billId) => {
    return api.delete(
        `/bills/${billId}`
    )
}


export const getDoctorAppointmentAnalytics = () => {
    return api.get(
        "/doctor-appointment-analytics"
    )
}

export const getAppointmentStatusAnalytics = () => {
    return api.get(
        "/appointment-status-analytics"
    )
}

export const getRevenueAnalytics = () => {
    return api.get(
        "/revenue-analytics"
    )
}

export const getAppointmentTrendAnalytics = () => {
    return api.get(
        "/appointment-trend-analytics"
    )
}

export const getPatientAppointmentAnalytics = () => {
    return api.get(
        "/patient-appointment-analytics"
    )

}