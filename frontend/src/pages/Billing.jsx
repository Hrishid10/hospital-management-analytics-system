import { useEffect, useState } from "react"

import {
    getBills,
    addBill,
    updateBill,
    deleteBill,
    getPatients,
    getAppointments
} from "../services/hospitalApi"

function getUserRole() {
    const token = localStorage.getItem("access_token")

    if (!token) return null

    try {
        const payload = token.split(".")[1]
        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/")

        return JSON.parse(atob(base64)).role
    } catch {
        return null
    }
}


function Billing() {

    const [bills, setBills] = useState([])
    const [patients, setPatients] = useState([])
    const [appointments, setAppointments] = useState([])

    const [showForm, setShowForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        patient_id: "",
        appointment_id: "",
        consultation_fee: "",
        medicine_charges: "",
        test_charges: "",
        payment_status: "Pending",
        payment_date: ""
    })

    const [editingBillId, setEditingBillId] = useState(null)
    const userRole = getUserRole()
    const canCreateBill = ["Admin", "Doctor"].includes(userRole)
    const canManageBills = userRole === "Admin"


    const loadBills = () => {

        getBills()
            .then((response) => {
                setBills(response.data)
            })
            .catch((error) => {
                console.error(
                    "Error fetching bills:",
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
        loadBills()

        if (canCreateBill) {
            loadPatients()
            loadAppointments()
        }
    }, [canCreateBill])


    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })

    }


    const resetForm = () => {

        setFormData({
            patient_id: "",
            appointment_id: "",
            consultation_fee: "",
            medicine_charges: "",
            test_charges: "",
            payment_status: "Pending",
            payment_date: ""
        })

        setEditingBillId(null)
        setShowForm(false)

    }


    const totalAmount =
        Number(formData.consultation_fee || 0) +
        Number(formData.medicine_charges || 0) +
        Number(formData.test_charges || 0)


    const handleSubmit = (event) => {

        event.preventDefault()

        const billData = {

            patient_id: Number(formData.patient_id),
            appointment_id: Number(formData.appointment_id),

            consultation_fee:
                Number(formData.consultation_fee),

            medicine_charges:
                Number(formData.medicine_charges || 0),

            test_charges:
                Number(formData.test_charges || 0),

            total_amount: totalAmount,

            payment_status:
                formData.payment_status,

            payment_date:
                formData.payment_date || null

        }


        if (editingBillId === null) {

            addBill(billData)

                .then(() => {

                    resetForm()
                    loadBills()

                })

                .catch((error) => {

                    console.error(
                        "Error adding bill:",
                        error
                    )

                })

        } else {

            updateBill(
                editingBillId,
                billData
            )

                .then(() => {

                    resetForm()
                    loadBills()

                })

                .catch((error) => {

                    console.error(
                        "Error updating bill:",
                        error
                    )

                })

        }

    }


    const handleEdit = (bill) => {

        setEditingBillId(bill.id)

        setFormData({

            patient_id: bill.patient_id,

            appointment_id:
                bill.appointment_id,

            consultation_fee:
                bill.consultation_fee,

            medicine_charges:
                bill.medicine_charges,

            test_charges:
                bill.test_charges,

            payment_status:
                bill.payment_status,

            payment_date:
                bill.payment_date || ""

        })

        setShowForm(true)

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })

    }


    const handleDelete = (billId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this bill?"
        )

        if (!confirmed) {
            return
        }

        deleteBill(billId)

            .then(() => {
                loadBills()
            })

            .catch((error) => {

                console.error(
                    "Error deleting bill:",
                    error
                )

            })

    }


    const getPatientName = (patientId) => {
        if (userRole === "Patient") {
            return "You"
        }

        const patient = patients.find(
            (patient) => Number(patient.id) === Number(patientId)
        )

        return patient ? patient.name : String(patientId)
    }


    const filteredBills = bills.filter((bill) => {

        const patientName =
            getPatientName(
                bill.patient_id
            ).toLowerCase()

        const appointmentId =
            String(bill.appointment_id)

        const paymentStatus =
            bill.payment_status
                ? bill.payment_status.toLowerCase()
                : ""

        const search =
            searchTerm.toLowerCase()

        return (
            patientName.includes(search) ||
            appointmentId.includes(search) ||
            paymentStatus.includes(search)
        )

    })


    return (

        <div className="page">


            {/* PAGE HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Billing
                    </h1>

                    <p>
                        Manage hospital bills, payments and charges.
                    </p>

                </div>

                {canCreateBill && (
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
                            : "+ Create Bill"}

                    </button>
                )}


            </div>


            {/* FORM */}

            {showForm && canCreateBill && (

                <div className="management-form">


                    <div className="form-header">

                        <div>

                            <h2>

                                {editingBillId === null
                                    ? "Create New Bill"
                                    : "Update Bill"}

                            </h2>

                            <p>
                                Enter the billing and payment information below.
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

                                    {appointments.map(
                                        (appointment) => (

                                            <option
                                                key={appointment.id}
                                                value={appointment.id}
                                            >

                                                Appointment #
                                                {appointment.id}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* CONSULTATION */}

                            <div className="form-field">

                                <label>
                                    Consultation Fee
                                </label>

                                <div className="currency-input">

                                    <span>₹</span>

                                    <input
                                        type="number"
                                        name="consultation_fee"
                                        placeholder="0.00"
                                        value={
                                            formData.consultation_fee
                                        }
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        required
                                    />

                                </div>

                            </div>


                            {/* MEDICINE */}

                            <div className="form-field">

                                <label>
                                    Medicine Charges
                                </label>

                                <div className="currency-input">

                                    <span>₹</span>

                                    <input
                                        type="number"
                                        name="medicine_charges"
                                        placeholder="0.00"
                                        value={
                                            formData.medicine_charges
                                        }
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                    />

                                </div>

                            </div>


                            {/* TEST */}

                            <div className="form-field">

                                <label>
                                    Test Charges
                                </label>

                                <div className="currency-input">

                                    <span>₹</span>

                                    <input
                                        type="number"
                                        name="test_charges"
                                        placeholder="0.00"
                                        value={
                                            formData.test_charges
                                        }
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                    />

                                </div>

                            </div>


                            {/* STATUS */}

                            <div className="form-field">

                                <label>
                                    Payment Status
                                </label>

                                <select
                                    name="payment_status"
                                    value={
                                        formData.payment_status
                                    }
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Paid">
                                        Paid
                                    </option>

                                </select>

                            </div>


                            {/* PAYMENT DATE */}

                            <div className="form-field">

                                <label>
                                    Payment Date
                                </label>

                                <input
                                    type="date"
                                    name="payment_date"
                                    value={
                                        formData.payment_date
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* TOTAL */}

                            <div className="bill-total-card">

                                <div>

                                    <span>
                                        Total Amount
                                    </span>

                                    <small>
                                        Consultation + Medicine + Tests
                                    </small>

                                </div>

                                <strong>
                                    ₹{totalAmount.toFixed(2)}
                                </strong>

                            </div>


                        </div>


                        <div className="form-actions">

                            <button
                                type="submit"
                                className="primary-button"
                            >

                                {editingBillId === null
                                    ? "Save Bill"
                                    : "Update Bill"}

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


            {/* BILL TABLE */}

            <div className="table-card">


                <div className="table-toolbar">

                    <div>

                        <h2>
                            Billing Records
                        </h2>

                        <p>

                            {filteredBills.length}
                            {" "}
                            bill
                            {filteredBills.length !== 1
                                ? "s"
                                : ""}
                            {" "}found

                        </p>

                    </div>


                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search patient, appointment or status..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />

                </div>


                {filteredBills.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ₹
                        </div>

                        <h3>
                            No billing records found
                        </h3>

                        <p>
                            Create a bill to see it here.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Patient</th>
                                    <th>Appointment</th>
                                    <th>Consultation</th>
                                    <th>Medicine</th>
                                    <th>Tests</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Payment Date</th>
                                    {canManageBills && <th>Actions</th>}

                                </tr>

                            </thead>


                            <tbody>

                                {filteredBills.map(
                                    (bill) => (

                                        <tr
                                            key={bill.id}
                                        >


                                            {/* ID */}

                                            <td>

                                                <span className="record-id">

                                                    #{bill.id}

                                                </span>

                                            </td>


                                            {/* PATIENT */}

                                            <td>

                                                <div className="patient-name">

                                                    <div className="patient-avatar">

                                                        {getPatientName(
                                                            bill.patient_id
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>

                                                    <span>

                                                        {getPatientName(
                                                            bill.patient_id
                                                        )}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* APPOINTMENT */}

                                            <td>

                                                <span className="appointment-badge">

                                                    #{bill.appointment_id}

                                                </span>

                                            </td>


                                            {/* CONSULTATION */}

                                            <td>

                                                ₹
                                                {Number(
                                                    bill.consultation_fee
                                                ).toFixed(2)}

                                            </td>


                                            {/* MEDICINE */}

                                            <td>

                                                ₹
                                                {Number(
                                                    bill.medicine_charges
                                                ).toFixed(2)}

                                            </td>


                                            {/* TEST */}

                                            <td>

                                                ₹
                                                {Number(
                                                    bill.test_charges
                                                ).toFixed(2)}

                                            </td>


                                            {/* TOTAL */}

                                            <td>

                                                <strong className="bill-total">

                                                    ₹
                                                    {Number(
                                                        bill.total_amount
                                                    ).toFixed(2)}

                                                </strong>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`payment-status ${bill.payment_status
                                                        .toLowerCase()
                                                        }`}
                                                >

                                                    {bill.payment_status}

                                                </span>

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                {bill.payment_date || "—"}

                                            </td>


                                            {/* ACTIONS */}

                                            {canManageBills && (
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="edit-button"
                                                            onClick={() => handleEdit(bill)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-button"
                                                            onClick={() => handleDelete(bill.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            )}

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


export default Billing