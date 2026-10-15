import { useState } from "react"
import {
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"

import Patients from "./pages/Patients"
import Doctors from "./pages/Doctors"
import Appointments from "./pages/Appointments"
import MedicalRecords from "./pages/MedicalRecords"
import Prescriptions from "./pages/Prescriptions"
import Billing from "./pages/Billing"
import Analytics from "./pages/Analytics"

import Login from "./pages/Login"
import Register from "./pages/Register"


function getUserFromToken() {
    const token = localStorage.getItem("access_token")

    if (!token) {
        return null
    }

    try {
        const payload = token.split(".")[1]
        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/")

        return JSON.parse(atob(base64))
    } catch {
        return null
    }
}


function App() {
    const navigate = useNavigate()

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("access_token"))
    )

    const [currentPage, setCurrentPage] = useState("dashboard")
    const [currentUser, setCurrentUser] = useState(getUserFromToken)

    const handleLogin = () => {
        setCurrentUser(getUserFromToken())
        setIsLoggedIn(true)
        setCurrentPage("dashboard")
        navigate("/")
    }

    const handleLogout = () => {
        localStorage.removeItem("access_token")
        setCurrentUser(null)
        setIsLoggedIn(false)
        setCurrentPage("dashboard")
        navigate("/login")
    }

    const isAuthenticated = isLoggedIn && currentUser

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/" replace />
                        : <Login setIsLoggedIn={handleLogin} />
                }
            />

            <Route
                path="/register"
                element={
                    isAuthenticated
                        ? <Navigate to="/" replace />
                        : <Register />
                }
            />

            <Route
                path="/"
                element={
                    !isAuthenticated
                        ? <Navigate to="/login" replace />
                        : (
                            <div className="app">
                                <Sidebar
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setIsLoggedIn={handleLogout}
                                    userRole={currentUser.role}
                                />

                                <main className="main-content">
                                    {currentPage === "dashboard" &&
                                        <Dashboard />}

                                    {currentPage === "patients" &&
                                        <Patients />}

                                    {currentPage === "doctors" &&
                                        <Doctors />}

                                    {currentPage === "appointments" &&
                                        <Appointments />}

                                    {currentPage === "medical-records" &&
                                        <MedicalRecords />}

                                    {currentPage === "prescriptions" &&
                                        <Prescriptions />}

                                    {currentPage === "billing" &&
                                        <Billing />}

                                    {currentPage === "analytics" &&
                                        <Analytics />}
                                </main>
                            </div>
                        )
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    )
}

export default App