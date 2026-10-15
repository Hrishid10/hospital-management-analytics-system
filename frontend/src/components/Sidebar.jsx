
function Sidebar({
    setCurrentPage,
    currentPage,
    setIsLoggedIn,
    userRole
}) {
    const handleLogout = () => {
        setIsLoggedIn()
    }

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "▦",
            roles: ["Admin", "Doctor", "Patient"]
        },
        {
            id: "patients",
            label: "Patients",
            icon: "♙",
            roles: ["Admin"]
        },
        {
            id: "doctors",
            label: "Doctors",
            icon: "⚕",
            roles: ["Admin"]
        },
        {
            id: "appointments",
            label: userRole === "Patient"
                ? "My Appointments"
                : "Appointments",
            icon: "◷",
            roles: ["Admin", "Doctor", "Patient"]
        },
        {
            id: "medical-records",
            label: userRole === "Patient"
                ? "My Medical Records"
                : "Medical Records",
            icon: "▤",
            roles: ["Admin", "Doctor", "Patient"]
        },
        {
            id: "prescriptions",
            label: userRole === "Patient"
                ? "My Prescriptions"
                : "Prescriptions",
            icon: "✚",
            roles: ["Admin", "Doctor", "Patient"]
        },
        {
            id: "billing",
            label: userRole === "Patient"
                ? "My Bills"
                : "Billing",
            icon: "₹",
            roles: ["Admin", "Doctor", "Patient"]
        },
        {
            id: "analytics",
            label: "Analytics",
            icon: "◒",
            roles: ["Admin"]
        }
    ]

    const visibleItems = menuItems.filter(
        (item) => item.roles.includes(userRole)
    )

    return (
        <aside className="sidebar">

            <div className="sidebar-brand">
                <div className="brand-icon">
                    🏥
                </div>

                <div>
                    <h2>HMS</h2>
                    <span>Hospital Management System</span>
                </div>
            </div>

            <div className="sidebar-section-title">
                MAIN MENU
            </div>

            <nav className="sidebar-nav">
                {visibleItems.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={
                            currentPage === item.id
                                ? "active"
                                : ""
                        }
                        onClick={(event) => {
                            event.preventDefault()
                            setCurrentPage(item.id)
                        }}
                    >
                        <span className="nav-icon">
                            {item.icon}
                        </span>

                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="footer-icon">
                    ●
                </div>

                <div>
                    <strong>{userRole} Account</strong>
                    <span>Hospital Management System</span>
                </div>
            </div>

            <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
            >
                <span className="nav-icon">↪</span>
                <span>Logout</span>
            </button>

        </aside>
    )
}

export default Sidebar
