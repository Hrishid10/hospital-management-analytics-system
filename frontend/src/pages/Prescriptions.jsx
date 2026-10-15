import { useEffect, useState } from "react"

import {
    getPrescriptions,
    addPrescription,
    updatePrescription,
    deletePrescription,
    getPatients,
    getDoctors,
    getMedicalRecords,
    getMyMedicalRecords
} from "../services/hospitalApi"


function Prescriptions() {

    const [prescriptions, setPrescriptions] = useState([])
    const [patients, setPatients] = useState([])
    const [doctors, setDoctors] = useState([])
    const [medicalRecords, setMedicalRecords] = useState([])

    const [showForm, setShowForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        patient_id: "",
        doctor_id: "",
        medical_record_id: "",
        medicine: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
    })

    const [editingPrescriptionId, setEditingPrescriptionId] = useState(null)


    const loadPrescriptions = () => {

        getPrescriptions()
            .then((response) => {
                setPrescriptions(response.data)
            })
            .catch((error) => {
                console.error(
                    "Error fetching prescriptions:",
                    error
                )
            })

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
            console.error("Error fetching medical records:", error)
        }
    }



    useEffect(() => {

        loadPrescriptions()
        loadPatients()
        loadDoctors()
        loadMedicalRecords()

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
            medical_record_id: "",
            medicine: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: ""
        })

        setEditingPrescriptionId(null)
        setShowForm(false)

    }


    const handleSubmit = (event) => {

        event.preventDefault()

        const prescriptionData = {

            patient_id: Number(formData.patient_id),
            doctor_id: Number(formData.doctor_id),
            medical_record_id: Number(formData.medical_record_id),

            medicine: formData.medicine,
            dosage: formData.dosage,
            frequency: formData.frequency,
            duration: formData.duration,
            instructions: formData.instructions

        }


        if (editingPrescriptionId === null) {

            addPrescription(prescriptionData)

                .then(() => {

                    resetForm()
                    loadPrescriptions()

                })

                .catch((error) => {

                    console.error(
                        "Error adding prescription:",
                        error
                    )

                })

        } else {

            updatePrescription(
                editingPrescriptionId,
                prescriptionData
            )

                .then(() => {

                    resetForm()
                    loadPrescriptions()

                })

                .catch((error) => {

                    console.error(
                        "Error updating prescription:",
                        error
                    )

                })

        }

    }


    const handleEdit = (prescription) => {

        setEditingPrescriptionId(prescription.id)

        setFormData({

            patient_id: prescription.patient_id,
            doctor_id: prescription.doctor_id,
            medical_record_id: prescription.medical_record_id,

            medicine: prescription.medicine,
            dosage: prescription.dosage,
            frequency: prescription.frequency,
            duration: prescription.duration,

            instructions:
                prescription.instructions || ""

        })

        setShowForm(true)

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })

    }


    const handleDelete = (prescriptionId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this prescription?"
        )

        if (!confirmed) {
            return
        }

        deletePrescription(prescriptionId)

            .then(() => {
                loadPrescriptions()
            })

            .catch((error) => {

                console.error(
                    "Error deleting prescription:",
                    error
                )

            })

    }


    const getPatientName = (patientId) => {

        const patient = patients.find(
            (patient) => patient.id === patientId
        )

        return patient
            ? patient.name
            : String(patientId)

    }


    const getDoctorName = (doctorId) => {

        const doctor = doctors.find(
            (doctor) => doctor.id === doctorId
        )

        return doctor
            ? doctor.name
            : String(doctorId)

    }


    const filteredPrescriptions =
        prescriptions.filter((prescription) => {

            const patientName =
                getPatientName(
                    prescription.patient_id
                ).toLowerCase()

            const doctorName =
                getDoctorName(
                    prescription.doctor_id
                ).toLowerCase()

            const medicine =
                prescription.medicine
                    ? prescription.medicine.toLowerCase()
                    : ""

            const search =
                searchTerm.toLowerCase()

            return (
                patientName.includes(search) ||
                doctorName.includes(search) ||
                medicine.includes(search)
            )

        })


    return (

        <div className="page">


            {/* PAGE HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Prescriptions
                    </h1>

                    <p>
                        Manage patient medications and prescription instructions.
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
                        : "+ Add Prescription"}

                </button>

            </div>


            {/* FORM */}

            {showForm && (

                <div className="management-form">


                    <div className="form-header">

                        <div>

                            <h2>

                                {editingPrescriptionId === null
                                    ? "Add Prescription"
                                    : "Update Prescription"}

                            </h2>

                            <p>
                                Enter the medication and dosage information below.
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


                            {/* MEDICAL RECORD */}

                            <div className="form-field">

                                <label>
                                    Medical Record
                                </label>

                                <select
                                    name="medical_record_id"
                                    value={formData.medical_record_id}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Medical Record
                                    </option>

                                    {medicalRecords.map((record) => (

                                        <option
                                            key={record.id}
                                            value={record.id}
                                        >

                                            Record #{record.id}
                                            {" - "}
                                            {record.diagnosis}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* MEDICINE */}

                            <div className="form-field">

                                <label>
                                    Medicine
                                </label>

                                <input
                                    type="text"
                                    name="medicine"
                                    placeholder="e.g. Paracetamol"
                                    value={formData.medicine}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* DOSAGE */}

                            <div className="form-field">

                                <label>
                                    Dosage
                                </label>

                                <input
                                    type="text"
                                    name="dosage"
                                    placeholder="e.g. 500 mg"
                                    value={formData.dosage}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* FREQUENCY */}

                            <div className="form-field">

                                <label>
                                    Frequency
                                </label>

                                <input
                                    type="text"
                                    name="frequency"
                                    placeholder="e.g. Twice a day"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* DURATION */}

                            <div className="form-field">

                                <label>
                                    Duration
                                </label>

                                <input
                                    type="text"
                                    name="duration"
                                    placeholder="e.g. 5 days"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* INSTRUCTIONS */}

                            <div className="form-field full-width">

                                <label>
                                    Instructions
                                </label>

                                <textarea
                                    name="instructions"
                                    placeholder="e.g. Take after meals..."
                                    value={formData.instructions}
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

                                {editingPrescriptionId === null
                                    ? "Save Prescription"
                                    : "Update Prescription"}

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


            {/* TABLE */}

            <div className="table-card">


                <div className="table-toolbar">


                    <div>

                        <h2>
                            Prescription Records
                        </h2>

                        <p>

                            {filteredPrescriptions.length}
                            {" "}
                            prescription
                            {filteredPrescriptions.length !== 1
                                ? "s"
                                : ""}
                            {" "}found

                        </p>

                    </div>


                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search patient, doctor or medicine..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />

                </div>


                {filteredPrescriptions.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            💊
                        </div>

                        <h3>
                            No prescriptions found
                        </h3>

                        <p>
                            Add a prescription to see it here.
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
                                    <th>Medical Record</th>
                                    <th>Medicine</th>
                                    <th>Dosage</th>
                                    <th>Frequency</th>
                                    <th>Duration</th>
                                    <th>Instructions</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredPrescriptions.map(
                                    (prescription) => (

                                        <tr
                                            key={
                                                prescription.id
                                            }
                                        >


                                            {/* ID */}

                                            <td>

                                                <span className="record-id">

                                                    #{prescription.id}

                                                </span>

                                            </td>


                                            {/* PATIENT */}

                                            <td>

                                                <div className="patient-name">

                                                    <div className="patient-avatar">

                                                        {getPatientName(
                                                            prescription.patient_id
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>

                                                    <span>

                                                        {getPatientName(
                                                            prescription.patient_id
                                                        )}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* DOCTOR */}

                                            <td>

                                                <span className="doctor-name">

                                                    {getDoctorName(
                                                        prescription.doctor_id
                                                    )}

                                                </span>

                                            </td>


                                            {/* MEDICAL RECORD */}

                                            <td>

                                                <span className="appointment-badge">

                                                    #
                                                    {
                                                        prescription.medical_record_id
                                                    }

                                                </span>

                                            </td>


                                            {/* MEDICINE */}

                                            <td>

                                                <span className="medicine-name">

                                                    {prescription.medicine}

                                                </span>

                                            </td>


                                            {/* DOSAGE */}

                                            <td>

                                                <span className="dosage-badge">

                                                    {prescription.dosage}

                                                </span>

                                            </td>


                                            {/* FREQUENCY */}

                                            <td>

                                                {prescription.frequency}

                                            </td>


                                            {/* DURATION */}

                                            <td>

                                                {prescription.duration}

                                            </td>


                                            {/* INSTRUCTIONS */}

                                            <td>

                                                <span className="notes-text">

                                                    {
                                                        prescription.instructions ||
                                                        "—"
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="action-buttons">


                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                prescription
                                                            )
                                                        }
                                                    >

                                                        Edit

                                                    </button>


                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                prescription.id
                                                            )
                                                        }
                                                    >

                                                        Delete

                                                    </button>


                                                </div>

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


export default Prescriptions