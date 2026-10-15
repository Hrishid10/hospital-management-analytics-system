import { useEffect, useState } from "react"
import {
    getDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor
} from "../services/hospitalApi"

function Doctors() {
    const [doctors, setDoctors] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        phone: "",
        email: "",
        department: ""
    })

    const [editingDoctorId, setEditingDoctorId] = useState(null)

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
            name: "",
            specialization: "",
            phone: "",
            email: "",
            department: ""
        })

        setEditingDoctorId(null)
        setShowForm(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (editingDoctorId === null) {
            addDoctor(formData)
                .then(() => {
                    resetForm()
                    loadDoctors()
                })
                .catch((error) => {
                    console.error("Error adding doctor:", error)
                })
        } else {
            updateDoctor(editingDoctorId, formData)
                .then(() => {
                    resetForm()
                    loadDoctors()
                })
                .catch((error) => {
                    console.error("Error updating doctor:", error)
                })
        }
    }

    const handleEdit = (doctor) => {
        setEditingDoctorId(doctor.id)

        setFormData({
            name: doctor.name,
            specialization: doctor.specialization,
            phone: doctor.phone,
            email: doctor.email,
            department: doctor.department
        })

        setShowForm(true)
    }

    const handleDelete = (doctorId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this doctor?"
        )

        if (!confirmed) {
            return
        }

        deleteDoctor(doctorId)
            .then(() => {
                loadDoctors()
            })
            .catch((error) => {
                console.error("Error deleting doctor:", error)
            })
    }

    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

    return (
        <div className="page">

            {/* Page Header */}

            <div className="page-header">

                <div>
                    <h1>Doctors</h1>

                    <p>
                        Manage hospital doctors and medical specialists
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => {
                        resetForm()
                        setShowForm(true)
                    }}
                >
                    + Add Doctor
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
                                {editingDoctorId === null
                                    ? "Add New Doctor"
                                    : "Edit Doctor"}
                            </h2>

                            <p>
                                Enter the doctor's professional information
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
                                placeholder="Enter doctor name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Specialization</label>

                            <input
                                type="text"
                                name="specialization"
                                placeholder="e.g. Cardiologist"
                                value={formData.specialization}
                                onChange={handleChange}
                                required
                            />
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
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="doctor@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Department</label>

                            <input
                                type="text"
                                name="department"
                                placeholder="e.g. Cardiology"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            {editingDoctorId === null
                                ? "Add Doctor"
                                : "Update Doctor"}
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

            {/* Doctor Table */}

            <div className="table-card">

                <div className="table-toolbar">

                    <div>
                        <h2>Doctor Directory</h2>

                        <span>
                            {doctors.length} total doctors
                        </span>
                    </div>

                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search doctor..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                </div>

                {filteredDoctors.length === 0 ? (
                    <div className="empty-state">

                        <div className="empty-icon">
                            ⚕
                        </div>

                        <h3>No doctors found</h3>

                        <p>
                            Try another search or add a new doctor.
                        </p>

                    </div>
                ) : (
                    <div className="table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Doctor</th>
                                    <th>Specialization</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredDoctors.map((doctor) => (
                                    <tr key={doctor.id}>

                                        <td>
                                            <span className="record-id">
                                                #{doctor.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="patient-name">

                                                <div className="doctor-avatar">
                                                    {doctor.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <strong>
                                                    {doctor.name}
                                                </strong>

                                            </div>
                                        </td>

                                        <td>
                                            <span className="specialization-badge">
                                                {doctor.specialization}
                                            </span>
                                        </td>

                                        <td>
                                            {doctor.phone}
                                        </td>

                                        <td>
                                            {doctor.email}
                                        </td>

                                        <td>
                                            <span className="department-badge">
                                                {doctor.department}
                                            </span>
                                        </td>

                                        <td>

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    handleEdit(doctor)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        doctor.id
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

export default Doctors