import { useEffect, useState } from "react"

import {
    getMedicalRecords,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    getPatients,
    getDoctors,
    getAppointments,
    getMyMedicalRecords
} from "../services/hospitalApi"


function MedicalRecords() {

    const [medicalRecords, setMedicalRecords] = useState([])
    const [patients, setPatients] = useState([])
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])

    const [showForm, setShowForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        patient_id: "",
        doctor_id: "",
        appointment_id: "",
        diagnosis: "",
        symptoms: "",
        treatment: "",
        notes: ""
    })

    const [editingRecordId, setEditingRecordId] = useState(null)


    const loadMedicalRecords = async () => {
        try {
            const token = localStorage.getItem("access_token")
            let userRole = null

            if (token) {
                try {
                    const payload = token.split(".")[1]
                    const base64 = payload
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")

                    userRole = JSON.parse(atob(base64)).role
                } catch {
                    userRole = null
                }
            }

            const response = userRole === "Patient"
                ? await getMyMedicalRecords()
                : await getMedicalRecords()

            setMedicalRecords(response.data)
        } catch (error) {
            console.error(
                "Error fetching medical records:",
                error
            )
        }
    }


    const loadPatients = () => {

        getPatients()
            .then((response) => {
                setPatients(response.data)
            })
            .catch((error) => {
                console.error(
                    "Error fetching patients:",
                    error
                )
            })
    }


    const loadDoctors = () => {

        getDoctors()
            .then((response) => {
                setDoctors(response.data)
            })
            .catch((error) => {
                console.error(
                    "Error fetching doctors:",
                    error
                )
            })
    }


    const loadAppointments = () => {

        getAppointments()
            .then((response) => {
                setAppointments(response.data)
            })
            .catch((error) => {
                console.error(
                    "Error fetching appointments:",
                    error
                )
            })
    }


    useEffect(() => {

        loadMedicalRecords()
        loadPatients()
        loadDoctors()
        loadAppointments()

    }, [])


    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })

    }


    const resetForm = () => {

        setFormData({
            patient_id: "",
            doctor_id: "",
            appointment_id: "",
            diagnosis: "",
            symptoms: "",
            treatment: "",
            notes: ""
        })

        setEditingRecordId(null)
        setShowForm(false)

    }


    const handleSubmit = (event) => {

        event.preventDefault()

        const medicalRecordData = {

            patient_id: Number(formData.patient_id),
            doctor_id: Number(formData.doctor_id),
            appointment_id: Number(formData.appointment_id),

            diagnosis: formData.diagnosis,
            symptoms: formData.symptoms,
            treatment: formData.treatment,
            notes: formData.notes

        }


        if (editingRecordId === null) {

            addMedicalRecord(medicalRecordData)

                .then(() => {

                    resetForm()
                    loadMedicalRecords()

                })

                .catch((error) => {

                    console.error(
                        "Error adding medical record:",
                        error
                    )

                })

        } else {

            updateMedicalRecord(
                editingRecordId,
                medicalRecordData
            )

                .then(() => {

                    resetForm()
                    loadMedicalRecords()

                })

                .catch((error) => {

                    console.error(
                        "Error updating medical record:",
                        error
                    )

                })

        }

    }


    const handleEdit = (record) => {

        setEditingRecordId(record.id)

        setFormData({

            patient_id: record.patient_id,
            doctor_id: record.doctor_id,
            appointment_id: record.appointment_id,

            diagnosis: record.diagnosis,
            symptoms: record.symptoms || "",
            treatment: record.treatment || "",
            notes: record.notes || ""

        })

        setShowForm(true)

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })

    }


    const handleDelete = (recordId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this medical record?"
        )

        if (!confirmed) {
            return
        }

        deleteMedicalRecord(recordId)

            .then(() => {
                loadMedicalRecords()
            })

            .catch((error) => {

                console.error(
                    "Error deleting medical record:",
                    error
                )

            })

    }


    const getPatientName = (patientId) => {

        const patient = patients.find(
            (patient) => patient.id === patientId
        )

        return patient ? patient.name : String(patientId)

    }


    const getDoctorName = (doctorId) => {

        const doctor = doctors.find(
            (doctor) => doctor.id === doctorId
        )

        return doctor ? doctor.name : String(doctorId)

    }


    const filteredRecords = medicalRecords.filter((record) => {

        const patientName = getPatientName(
            record.patient_id
        ).toString().toLowerCase()

        const doctorName = getDoctorName(
            record.doctor_id
        ).toString().toLowerCase()

        const diagnosis = record.diagnosis
            ? record.diagnosis.toLowerCase()
            : ""

        const search = searchTerm.toLowerCase()

        return (
            patientName.includes(search) ||
            doctorName.includes(search) ||
            diagnosis.includes(search)
        )

    })


    return (

        <div className="page">

            {/* PAGE HEADER */}

            <div className="page-header">

                <div>

                    <h1>Medical Records</h1>

                    <p>
                        Manage patient diagnoses, treatments and clinical records.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={() => {

                        if (showForm) {
                            resetForm()
                        } else {
                            setShowForm(true)
                        }

                    }}
                >

                    {showForm
                        ? "Close Form"
                        : "+ Add Medical Record"}

                </button>

            </div>


            {/* FORM */}

            {showForm && (

                <div className="management-form">

                    <div className="form-header">

                        <div>

                            <h2>
                                {editingRecordId === null
                                    ? "Add Medical Record"
                                    : "Update Medical Record"}
                            </h2>

                            <p>
                                Enter the patient's clinical information below.
                            </p>

                        </div>

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">


                            {/* PATIENT */}

                            <div className="form-field">

                                <label>
                                    Patient
                                </label>

                                <select
                                    name="patient_id"
                                    value={formData.patient_id}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Patient
                                    </option>

                                    {patients.map((patient) => (

                                        <option
                                            key={patient.id}
                                            value={patient.id}
                                        >

                                            {patient.name}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* DOCTOR */}

                            <div className="form-field">

                                <label>
                                    Doctor
                                </label>

                                <select
                                    name="doctor_id"
                                    value={formData.doctor_id}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Doctor
                                    </option>

                                    {doctors.map((doctor) => (

                                        <option
                                            key={doctor.id}
                                            value={doctor.id}
                                        >

                                            {doctor.name}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* APPOINTMENT */}

                            <div className="form-field">

                                <label>
                                    Appointment
                                </label>

                                <select
                                    name="appointment_id"
                                    value={formData.appointment_id}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Appointment
                                    </option>

                                    {appointments.map((appointment) => (

                                        <option
                                            key={appointment.id}
                                            value={appointment.id}
                                        >

                                            Appointment #{appointment.id}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* DIAGNOSIS */}

                            <div className="form-field">

                                <label>
                                    Diagnosis
                                </label>

                                <input
                                    type="text"
                                    name="diagnosis"
                                    placeholder="Enter diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* SYMPTOMS */}

                            <div className="form-field">

                                <label>
                                    Symptoms
                                </label>

                                <input
                                    type="text"
                                    name="symptoms"
                                    placeholder="Enter symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* TREATMENT */}

                            <div className="form-field">

                                <label>
                                    Treatment
                                </label>

                                <input
                                    type="text"
                                    name="treatment"
                                    placeholder="Enter treatment"
                                    value={formData.treatment}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* NOTES */}

                            <div className="form-field full-width">

                                <label>
                                    Clinical Notes
                                </label>

                                <textarea
                                    name="notes"
                                    placeholder="Enter additional clinical notes..."
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="4"
                                />

                            </div>


                        </div>


                        <div className="form-actions">

                            <button
                                type="submit"
                                className="primary-button"
                            >

                                {editingRecordId === null
                                    ? "Save Medical Record"
                                    : "Update Medical Record"}

                            </button>


                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >

                                Cancel

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* TABLE SECTION */}

            <div className="table-card">


                <div className="table-toolbar">

                    <div>

                        <h2>
                            Medical Records
                        </h2>

                        <p>
                            {filteredRecords.length} record
                            {filteredRecords.length !== 1
                                ? "s"
                                : ""} found
                        </p>

                    </div>


                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search patient, doctor or diagnosis..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                </div>


                {filteredRecords.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            🩺
                        </div>

                        <h3>
                            No medical records found
                        </h3>

                        <p>
                            Add a medical record to see it here.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Appointment</th>
                                    <th>Diagnosis</th>
                                    <th>Symptoms</th>
                                    <th>Treatment</th>
                                    <th>Notes</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredRecords.map((record) => (

                                    <tr key={record.id}>

                                        <td>

                                            <span className="record-id">
                                                #{record.id}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="patient-name">

                                                <div className="patient-avatar">
                                                    {getPatientName(
                                                        record.patient_id
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <span>
                                                    {getPatientName(
                                                        record.patient_id
                                                    )}
                                                </span>

                                            </div>

                                        </td>


                                        <td>

                                            <span className="doctor-name">

                                                {getDoctorName(
                                                    record.doctor_id
                                                )}

                                            </span>

                                        </td>


                                        <td>

                                            <span className="appointment-badge">

                                                #{record.appointment_id}

                                            </span>

                                        </td>


                                        <td>

                                            <span className="diagnosis-text">

                                                {record.diagnosis}

                                            </span>

                                        </td>


                                        <td>

                                            {record.symptoms || "—"}

                                        </td>


                                        <td>

                                            {record.treatment || "—"}

                                        </td>


                                        <td>

                                            <span className="notes-text">

                                                {record.notes || "—"}

                                            </span>

                                        </td>


                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(record)
                                                    }
                                                >

                                                    Edit

                                                </button>


                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            record.id
                                                        )
                                                    }
                                                >

                                                    Delete

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    )

}


export default MedicalRecords