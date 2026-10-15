import { useEffect, useState } from "react"
import {
    getHospitalOverview,
    getDoctorAppointmentAnalytics,
    getAppointmentStatusAnalytics,
    getRevenueAnalytics,
    getAppointmentTrendAnalytics,
    getPatientAppointmentAnalytics
} from "../services/hospitalApi"

import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts"

function Analytics() {
    const [overview, setOverview] = useState(null)
    const [doctorAnalytics, setDoctorAnalytics] = useState([])
    const [statusAnalytics, setStatusAnalytics] = useState([])
    const [revenueAnalytics, setRevenueAnalytics] = useState([])
    const [trendAnalytics, setTrendAnalytics] = useState([])
    const [patientAnalytics, setPatientAnalytics] = useState([])

    useEffect(() => {
        getHospitalOverview()
            .then((response) => {
                setOverview(response.data)
            })
            .catch((error) => {
                console.error(error)
            })

        getDoctorAppointmentAnalytics()
            .then((response) => {
                setDoctorAnalytics(response.data)
            })
            .catch((error) => {
                console.error(error)
            })

        getAppointmentStatusAnalytics()
            .then((response) => {
                setStatusAnalytics(response.data)
            })
            .catch((error) => {
                console.error(error)
            })

        getRevenueAnalytics()
            .then((response) => {
                setRevenueAnalytics(response.data)
            })
            .catch((error) => {
                console.error(error)
            })

        getAppointmentTrendAnalytics()
            .then((response) => {
                setTrendAnalytics(response.data)
            })
            .catch((error) => {
                console.error(error)
            })

        getPatientAppointmentAnalytics()
            .then((response) => {
                setPatientAnalytics(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    if (overview === null) {
        return <h2>Loading analytics...</h2>
    }

    return (
        <div className="analytics-page">

            <h1>Hospital Analytics</h1>

            <p className="dashboard-subtitle">
                Hospital performance and operational insights
            </p>

            {/* Overview */}

            <div className="stats-container">

                <div className="stat-card">
                    <h3>Total Patients</h3>
                    <p>{overview.total_patients}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Doctors</h3>
                    <p>{overview.total_doctors}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Appointments</h3>
                    <p>{overview.total_appointments}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p>
                        ₹{Number(
                            overview.total_revenue
                        ).toFixed(2)}
                    </p>
                </div>

            </div>

            {/* Doctor Appointments */}

            <div className="chart-card">

                <h2>Appointments by Doctor</h2>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <BarChart data={doctorAnalytics}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="doctor_name"
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Bar
                            dataKey="total_appointments"
                            name="Appointments"
                        />

                    </BarChart>
                </ResponsiveContainer>

            </div>

            {/* Appointment Status */}

            <div className="chart-card">

                <h2>Appointment Status</h2>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <PieChart>

                        <Pie
                            data={statusAnalytics}
                            dataKey="total_appointments"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                        >
                            {statusAnalytics.map(
                                (entry, index) => (
                                    <Cell key={index} />
                                )
                            )}
                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>
                </ResponsiveContainer>

            </div>

            {/* Revenue */}

            <div className="chart-card">

                <h2>Revenue by Payment Status</h2>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <BarChart data={revenueAnalytics}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="payment_status"
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Bar
                            dataKey="total_amount"
                            name="Revenue"
                        />

                    </BarChart>
                </ResponsiveContainer>

            </div>

            {/* Appointment Trend */}

            <div className="chart-card">

                <h2>Appointment Trend</h2>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <LineChart data={trendAnalytics}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="appointment_date"
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="total_appointments"
                            name="Appointments"
                        />

                    </LineChart>
                </ResponsiveContainer>

            </div>

            {/* Patient Appointments */}

            <div className="chart-card">

                <h2>Appointments by Patient</h2>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <BarChart data={patientAnalytics}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="patient_name"
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Bar
                            dataKey="total_appointments"
                            name="Appointments"
                        />

                    </BarChart>
                </ResponsiveContainer>

            </div>

        </div>
    )
}

export default Analytics