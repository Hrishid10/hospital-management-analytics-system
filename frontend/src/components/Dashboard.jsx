import { useEffect, useState } from "react"

import {
    getHospitalOverview,
    getAppointmentStatusAnalytics,
    getAppointmentTrendAnalytics,
    getAppointments,
    getPatients,
    getDoctors,
    getRevenueAnalytics
} from "../services/hospitalApi"

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from "recharts"

function Dashboard() {
    const [overview, setOverview] = useState(null)
    const [appointmentStatus, setAppointmentStatus] = useState([])
    const [appointmentTrend, setAppointmentTrend] = useState([])
    const [appointments, setAppointments] = useState([])
    const [patients, setPatients] = useState([])
    const [doctors, setDoctors] = useState([])
    const [revenueAnalytics, setRevenueAnalytics] = useState([])

    useEffect(() => {

        getHospitalOverview()
            .then((response) => {
                setOverview(response.data)
            })
            .catch((error) => {
                console.error(
                    "Error fetching hospital overview:",
                    error
                )
            })


        getAppointmentStatusAnalytics()
            .then((response) => {
                setAppointmentStatus(response.data)
            })
            .catch((error) => {
                console.error(
                    "Error fetching appointment status:",
                    error
                )
            })


        getAppointmentTrendAnalytics()
            .then((response) => {
                setAppointmentTrend(response.data)
            })
            .catch((error) => {
                console.error(
                    "Error fetching appointment trend:",
                    error
                )
            })


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

        getRevenueAnalytics()
            .then((response) => {
                setRevenueAnalytics(response.data)
            })
            .catch((error) => {
                console.error(
                    "Error fetching revenue analytics:",
                    error
                )
            })

    }, [])

    const recentAppointments = [...appointments]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)

    const recentPatients = [...patients]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)

    const getPatientName = (patientId) => {

        const patient = patients.find(
            (patient) => Number(patient.id) === Number(patientId)
        )

        return patient
            ? patient.name
            : `Patient #${patientId}`
    }

    const getDoctorName = (doctorId) => {

        const doctor = doctors.find(
            (doctor) => Number(doctor.id) === Number(doctorId)
        )

        return doctor
            ? doctor.name
            : `Doctor #${doctorId}`
    }

    const statusColors = {
        Scheduled: "#2563eb",
        Completed: "#16a34a",
        Cancelled: "#dc2626"
    }

    if (overview === null) {
        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        )
    }

    return (
        <div className="dashboard">

            {/* Header */}

            <div className="dashboard-header">

                <div>
                    <h1>Hospital Dashboard</h1>

                    <p>
                        Welcome back. Here's what's happening
                        at your hospital today.
                    </p>
                </div>

                <div className="dashboard-status">
                    <span className="status-dot"></span>
                    System Operational
                </div>

            </div>

            {/* KPI Cards */}

            <div className="dashboard-stats">

                <div className="dashboard-card">

                    <div className="card-icon patient-icon">
                        ♙
                    </div>

                    <div>
                        <span>Total Patients</span>

                        <strong>
                            {overview.total_patients}
                        </strong>

                        <small>
                            Registered patients
                        </small>
                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-icon doctor-icon">
                        ⚕
                    </div>

                    <div>
                        <span>Total Doctors</span>

                        <strong>
                            {overview.total_doctors}
                        </strong>

                        <small>
                            Medical professionals
                        </small>
                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-icon appointment-icon">
                        ◷
                    </div>

                    <div>
                        <span>Appointments</span>

                        <strong>
                            {overview.total_appointments}
                        </strong>

                        <small>
                            Total appointments
                        </small>
                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-icon revenue-icon">
                        ₹
                    </div>

                    <div>
                        <span>Total Revenue</span>

                        <strong>
                            ₹{Number(
                                overview.total_revenue
                            ).toFixed(2)}
                        </strong>

                        <small>
                            From paid bills
                        </small>
                    </div>

                </div>

            </div>

            {/* Appointment Overview */}

            <div className="dashboard-section">

                <div className="section-header">
                    <div>
                        <h2>Appointment Overview</h2>

                        <p>
                            Current appointment status
                        </p>
                    </div>
                </div>

                <div className="appointment-overview">

                    <div className="appointment-item">

                        <div className="appointment-item-icon scheduled">
                            ◷
                        </div>

                        <div>
                            <span>Scheduled</span>

                            <strong>
                                {overview.scheduled_appointments}
                            </strong>
                        </div>

                    </div>

                    <div className="appointment-item">

                        <div className="appointment-item-icon completed">
                            ✓
                        </div>

                        <div>
                            <span>Completed</span>

                            <strong>
                                {overview.completed_appointments}
                            </strong>
                        </div>

                    </div>

                    <div className="appointment-item">

                        <div className="appointment-item-icon cancelled">
                            ×
                        </div>

                        <div>
                            <span>Cancelled</span>

                            <strong>
                                {overview.cancelled_appointments}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

            {/* Dashboard Charts */}

            <div className="dashboard-charts">


                {/* Appointment Trend */}

                <div className="dashboard-chart-card">

                    <div className="chart-header">

                        <div>

                            <h2>Appointment Trend</h2>

                            <p>
                                Appointments over time
                            </p>

                        </div>

                    </div>


                    <div className="chart-container">

                        {appointmentTrend.length === 0 ? (

                            <div className="chart-empty">
                                No appointment trend data available.
                            </div>

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={appointmentTrend}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 0,
                                        bottom: 5
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="appointment_date"
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                    />

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="total_appointments"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        )}

                    </div>

                </div>


                {/* Appointment Status */}

                <div className="dashboard-chart-card">

                    <div className="chart-header">

                        <div>

                            <h2>Appointment Status</h2>

                            <p>
                                Distribution of appointment statuses
                            </p>

                        </div>

                    </div>


                    <div className="chart-container pie-chart-container">

                        {appointmentStatus.length === 0 ? (

                            <div className="chart-empty">
                                No appointment status data available.
                            </div>

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <PieChart>

                                    <Pie
                                        data={appointmentStatus}
                                        dataKey="total_appointments"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={105}
                                        label
                                    >

                                        {appointmentStatus.map(
                                            (entry) => (

                                                <Cell
                                                    key={`cell-${entry.status}`}
                                                    fill={
                                                        statusColors[
                                                        entry.status
                                                        ] || "#64748b"
                                                    }
                                                />

                                            )
                                        )}

                                    </Pie>

                                    <Tooltip />

                                </PieChart>

                            </ResponsiveContainer>

                        )}

                    </div>


                    {/* Status Legend */}

                    <div className="status-legend">

                        {appointmentStatus.map((entry) => (

                            <div
                                className="legend-item"
                                key={entry.status}
                            >

                                <span
                                    className="legend-dot"
                                    style={{
                                        backgroundColor:
                                            statusColors[
                                            entry.status
                                            ] || "#64748b"
                                    }}
                                ></span>

                                <span>
                                    {entry.status}
                                </span>

                                <strong>
                                    {entry.total_appointments}
                                </strong>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

            <div className="revenue-summary-card">

                <div className="recent-card-header">
                    <h2>Revenue Summary</h2>
                    <p>Payment status overview</p>
                </div>

                <div className="revenue-summary-grid">

                    <div className="revenue-item">
                        <span>Paid Revenue</span>
                        <strong>
                            ₹
                            {Number(
                                revenueAnalytics.find(
                                    (item) => item.payment_status === "Paid"
                                )?.total_amount || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div className="revenue-item">
                        <span>Pending Revenue</span>
                        <strong>
                            ₹
                            {Number(
                                revenueAnalytics.find(
                                    (item) => item.payment_status === "Pending"
                                )?.total_amount || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div className="revenue-item">
                        <span>Total Revenue</span>
                        <strong>
                            ₹
                            {revenueAnalytics
                                .reduce(
                                    (total, item) =>
                                        total + Number(item.total_amount || 0),
                                    0
                                )
                                .toLocaleString("en-IN")}
                        </strong>
                    </div>

                </div>

            </div>

            {/* Recent Data */}

            <div className="dashboard-recent">


                {/* Recent Appointments */}

                <div className="recent-card">

                    <div className="recent-card-header">

                        <div>

                            <h2>Recent Appointments</h2>

                            <p>
                                Latest appointment records
                            </p>

                        </div>

                    </div>


                    {recentAppointments.length === 0 ? (

                        <div className="recent-empty">
                            No appointments available.
                        </div>

                    ) : (

                        <div className="recent-list">

                            {recentAppointments.map((appointment) => (

                                <div
                                    className="recent-item"
                                    key={appointment.id}
                                >

                                    <div className="recent-avatar appointment-avatar">
                                        #{appointment.id}
                                    </div>


                                    <div className="recent-info">

                                        <strong>
                                            {getPatientName(appointment.patient_id)}
                                        </strong>

                                        <span>
                                            {getDoctorName(appointment.doctor_id)}
                                            {" • "}
                                            {appointment.appointment_date}
                                        </span>

                                    </div>


                                    <span
                                        className={`appointment-status ${appointment.status.toLowerCase()
                                            }`}
                                    >
                                        {appointment.status}
                                    </span>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* Recent Patients */}

                <div className="recent-card">

                    <div className="recent-card-header">

                        <div>

                            <h2>Recent Patients</h2>

                            <p>
                                Recently registered patients
                            </p>

                        </div>

                    </div>


                    {recentPatients.length === 0 ? (

                        <div className="recent-empty">
                            No patients available.
                        </div>

                    ) : (

                        <div className="recent-list">

                            {recentPatients.map((patient) => (

                                <div
                                    className="recent-item"
                                    key={patient.id}
                                >

                                    <div className="recent-avatar patient-recent-avatar">

                                        {patient.name
                                            .charAt(0)
                                            .toUpperCase()}

                                    </div>


                                    <div className="recent-info">

                                        <strong>
                                            {patient.name}
                                        </strong>

                                        <span>
                                            {patient.gender} • Age {patient.age}
                                        </span>

                                    </div>


                                    <span className="blood-badge">
                                        {patient.blood_group}
                                    </span>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    )
}

export default Dashboard