import { useEffect, useState } from "react"
import {
    getPatients,
    addPatient,
    updatePatient,
    deletePatient
} from "../services/hospitalApi"

function Patients() {
    const [patients, setPatients] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        blood_group: ""
    })

    const [editingPatientId, setEditingPatientId] = useState(null)

    const loadPatients = () => {
        getPatients()
            .then((response) => {
                setPatients(response.data)
            })
            .catch((error) => {
                console.error("Error fetching patients:", error)
            })
    }

    useEffect(() => {
        loadPatients()
    }, [])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const resetForm = () => {
        setFormData({
            name: "",
            age: "",
            gender: "",
            phone: "",
            blood_group: ""
        })

        setEditingPatientId(null)
        setShowForm(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const patientData = {
            ...formData,
            age: Number(formData.age)
        }

        if (editingPatientId === null) {
            addPatient(patientData)
                .then(() => {
                    resetForm()
                    loadPatients()
                })
                .catch((error) => {
                    console.error("Error adding patient:", error)
                })
        } else {
            updatePatient(editingPatientId, patientData)
                .then(() => {
                    resetForm()
                    loadPatients()
                })
                .catch((error) => {
                    console.error("Error updating patient:", error)
                })
        }
    }

    const handleEdit = (patient) => {
        setEditingPatientId(patient.id)

        setFormData({
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            blood_group: patient.blood_group
        })

        setShowForm(true)
    }

    const handleDelete = (patientId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this patient?"
        )

        if (!confirmed) {
            return
        }

        deletePatient(patientId)
            .then(() => {
                loadPatients()
            })
            .catch((error) => {
                console.error("Error deleting patient:", error)
            })
    }

    const filteredPatients = patients.filter((patient) =>
        patient.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

    return (
        <div className="page">

            {/* Page Header */}

            <div className="page-header">

                <div>
                    <h1>Patients</h1>

                    <p>
                        Manage and monitor hospital patient records
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => {
                        resetForm()
                        setShowForm(true)
                    }}
                >
                    + Add Patient
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
                                {editingPatientId === null
                                    ? "Add New Patient"
                                    : "Edit Patient"}
                            </h2>

                            <p>
                                Enter the patient's information below
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
                            <label>Full Name</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter patient name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Age</label>

                            <input
                                type="number"
                                name="age"
                                placeholder="Enter age"
                                value={formData.age}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Gender</label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Blood Group</label>

                            <select
                                name="blood_group"
                                value={formData.blood_group}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select blood group
                                </option>

                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                    </div>

                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            {editingPatientId === null
                                ? "Add Patient"
                                : "Update Patient"}
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

            {/* Search */}

            <div className="table-card">

                <div className="table-toolbar">

                    <div>
                        <h2>Patient Records</h2>

                        <span>
                            {patients.length} total patients
                        </span>
                    </div>

                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search patient..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                </div>

                {/* Table */}

                {filteredPatients.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ♙
                        </div>

                        <h3>No patients found</h3>

                        <p>
                            Try another search or add a new patient.
                        </p>
                    </div>
                ) : (
                    <div className="table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Phone</th>
                                    <th>Blood Group</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id}>

                                        <td>
                                            <span className="record-id">
                                                #{patient.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="patient-name">
                                                <div className="patient-avatar">
                                                    {patient.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <strong>
                                                    {patient.name}
                                                </strong>
                                            </div>
                                        </td>

                                        <td>
                                            {patient.age}
                                        </td>

                                        <td>
                                            <span className="gender-badge">
                                                {patient.gender}
                                            </span>
                                        </td>

                                        <td>
                                            {patient.phone}
                                        </td>

                                        <td>
                                            <span className="blood-badge">
                                                {patient.blood_group}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    handleEdit(patient)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        patient.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
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

export default Patients