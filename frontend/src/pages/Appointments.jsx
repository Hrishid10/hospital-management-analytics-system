import { useEffect, useState } from "react"
import {
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getPatients,
    getDoctors
} from "../services/hospitalApi"

function Appointments() {
    const [appointments, setAppointments] = useState([])
    const [patients, setPatients] = useState([])
    const [doctors, setDoctors] = useState([])

    const [searchTerm, setSearchTerm] = useState("")
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
        status: "Scheduled"
    })

    const [editingAppointmentId, setEditingAppointmentId] = useState(null)

    const loadAppointments = () => {
        getAppointments()
            .then((response) => {
                setAppointments(response.data)
            })
            .catch((error) => {
                console.error("Error fetching appointments:", error)
            })
    }

    const loadPatients = () => {
        getPatients()
            .then((response) => {
                setPatients(response.data)
            })
            .catch((error) => {
                console.error("Error fetching patients:", error)
            })
    }

    const loadDoctors = () => {
        getDoctors()
            .then((response) => {
                setDoctors(response.data)
            })
            .catch((error) => {
                console.error("Error fetching doctors:", error)
            })
    }

    useEffect(() => {
        loadAppointments()
        loadPatients()
        loadDoctors()
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
            appointment_date: "",
            appointment_time: "",
            reason: "",
            status: "Scheduled"
        })

        setEditingAppointmentId(null)
        setShowForm(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const appointmentData = {
            patient_id: Number(formData.patient_id),
            doctor_id: Number(formData.doctor_id),
            appointment_date: formData.appointment_date,
            appointment_time: formData.appointment_time,
            reason: formData.reason
        }

        if (editingAppointmentId === null) {
            addAppointment(appointmentData)
                .then(() => {
                    resetForm()
                    loadAppointments()
                })
                .catch((error) => {
                    console.error(
                        "Error adding appointment:",
                        error
                    )
                })
        } else {
            const updateData = {
                ...appointmentData,
                status: formData.status
            }

            updateAppointment(
                editingAppointmentId,
                updateData
            )
                .then(() => {
                    resetForm()
                    loadAppointments()
                })
                .catch((error) => {
                    console.error(
                        "Error updating appointment:",
                        error
                    )
                })
        }
    }

    const handleEdit = (appointment) => {
        setEditingAppointmentId(appointment.id)

        setFormData({
            patient_id: appointment.patient_id,
            doctor_id: appointment.doctor_id,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time,
            reason: appointment.reason || "",
            status: appointment.status
        })

        setShowForm(true)
    }

    const handleDelete = (appointmentId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this appointment?"
        )

        if (!confirmed) {
            return
        }

        deleteAppointment(appointmentId)
            .then(() => {
                loadAppointments()
            })
            .catch((error) => {
                console.error(
                    "Error deleting appointment:",
                    error
                )
            })
    }

    const getPatientName = (patientId) => {
        const patient = patients.find(
            (patient) => patient.id === patientId
        )

        return patient ? patient.name : patientId
    }

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(
            (doctor) => doctor.id === doctorId
        )

        return doctor ? doctor.name : doctorId
    }

    const filteredAppointments = appointments.filter(
        (appointment) => {
            const patientName = getPatientName(
                appointment.patient_id
            ).toString().toLowerCase()

            const doctorName = getDoctorName(
                appointment.doctor_id
            ).toString().toLowerCase()

            const search = searchTerm.toLowerCase()

            return (
                patientName.includes(search) ||
                doctorName.includes(search) ||
                appointment.status
                    .toLowerCase()
                    .includes(search)
            )
        }
    )

    return (
        <div className="page">

            {/* Page Header */}

            <div className="page-header">

                <div>
                    <h1>Appointments</h1>

                    <p>
                        Schedule and manage hospital appointments
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => {
                        resetForm()
                        setShowForm(true)
                    }}
                >
                    + New Appointment
                </button>

            </div>

            {/* Form */}

            {showForm && (
                <form
                    className="management-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-header">

                        <div>
                            <h2>
                                {editingAppointmentId === null
                                    ? "Schedule Appointment"
                                    : "Edit Appointment"}
                            </h2>

                            <p>
                                Enter appointment details below
                            </p>
                        </div>

                        <button
                            type="button"
                            className="close-button"
                            onClick={resetForm}
                        >
                            ×
                        </button>

                    </div>

                    <div className="form-grid">

                        <div className="form-field">
                            <label>Patient</label>

                            <select
                                name="patient_id"
                                value={formData.patient_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select patient
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

                        <div className="form-field">
                            <label>Doctor</label>

                            <select
                                name="doctor_id"
                                value={formData.doctor_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select doctor
                                </option>

                                {doctors.map((doctor) => (
                                    <option
                                        key={doctor.id}
                                        value={doctor.id}
                                    >
                                        {doctor.name} —{" "}
                                        {doctor.specialization}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Appointment Date</label>

                            <input
                                type="date"
                                name="appointment_date"
                                value={formData.appointment_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Appointment Time</label>

                            <input
                                type="time"
                                name="appointment_time"
                                value={formData.appointment_time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Reason</label>

                            <input
                                type="text"
                                name="reason"
                                placeholder="Reason for appointment"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {editingAppointmentId !== null && (
                            <div className="form-field">
                                <label>Status</label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Scheduled">
                                        Scheduled
                                    </option>

                                    <option value="Completed">
                                        Completed
                                    </option>

                                    <option value="Cancelled">
                                        Cancelled
                                    </option>
                                </select>
                            </div>
                        )}

                    </div>

                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            {editingAppointmentId === null
                                ? "Schedule Appointment"
                                : "Update Appointment"}
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
            )}

            {/* Appointment Table */}

            <div className="table-card">

                <div className="table-toolbar">

                    <div>
                        <h2>Appointment Schedule</h2>

                        <span>
                            {appointments.length} total appointments
                        </span>
                    </div>

                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search patient, doctor or status..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                </div>

                {filteredAppointments.length === 0 ? (
                    <div className="empty-state">

                        <div className="empty-icon">
                            ◷
                        </div>

                        <h3>No appointments found</h3>

                        <p>
                            Try another search or schedule a new appointment.
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
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredAppointments.map(
                                    (appointment) => (
                                        <tr key={appointment.id}>

                                            <td>
                                                <span className="record-id">
                                                    #{appointment.id}
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {getPatientName(
                                                        appointment.patient_id
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                {getDoctorName(
                                                    appointment.doctor_id
                                                )}
                                            </td>

                                            <td>
                                                {appointment.appointment_date}
                                            </td>

                                            <td>
                                                {appointment.appointment_time}
                                            </td>

                                            <td>
                                                {appointment.reason}
                                            </td>

                                            <td>
                                                <span
                                                    className={`appointment-status ${appointment.status.toLowerCase()}`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </td>

                                            <td>

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            appointment
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            appointment.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    )
}

export default Appointments