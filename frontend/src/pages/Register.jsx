import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "./Auth.css"

function Register() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleRegister = async (event) => {
        event.preventDefault()
        setError("")
        setSuccess("")

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.")
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/register",
                {
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: "Patient"
                }
            )

            setSuccess(
                response.data.message ||
                "Account created successfully!"
            )

            setTimeout(() => navigate("/"), 1200)
        } catch (error) {
            const detail = error.response?.data?.detail

            if (error.response?.status === 409) {
                setError(
                    typeof detail === "string"
                        ? detail
                        : "Username or email already exists."
                )
            } else {
                setError(
                    typeof detail === "string"
                        ? detail
                        : "Unable to create your account. Please try again."
                )
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-showcase">
                <div className="auth-brand">
                    <div className="auth-brand-icon">✚</div>
                    <div>
                        <strong>MediCare</strong>
                        <span>HOSPITAL MANAGEMENT</span>
                    </div>
                </div>

                <div className="auth-showcase-content">
                    <span className="auth-eyebrow">
                        START YOUR JOURNEY
                    </span>

                    <h1>Your healthcare, all in one place.</h1>

                    <p>
                        Create your patient account to stay connected
                        with your appointments, medical records and bills.
                    </p>

                    <div className="auth-feature">
                        <span>✓</span>
                        <div>
                            <strong>Your health information</strong>
                            <p>Access your personal healthcare information.</p>
                        </div>
                    </div>

                    <div className="auth-feature">
                        <span>✓</span>
                        <div>
                            <strong>Simple and convenient</strong>
                            <p>Manage your healthcare journey in one place.</p>
                        </div>
                    </div>
                </div>

                <p className="auth-showcase-footer">
                    Healthcare management, made simpler.
                </p>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-container">
                    <div className="auth-mobile-brand">
                        ✚ MediCare
                    </div>

                    <span className="auth-eyebrow">
                        CREATE YOUR ACCOUNT
                    </span>

                    <h2>Join MediCare</h2>

                    <p className="auth-description">
                        Enter your details to create a patient account.
                    </p>

                    {error && (
                        <div className="auth-error" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-success" role="status">
                            {success} Redirecting to login...
                        </div>
                    )}

                    <form
                        className="auth-form"
                        onSubmit={handleRegister}
                    >
                        <div className="auth-field">
                            <label htmlFor="register-username">
                                Username
                            </label>
                            <input
                                id="register-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                minLength={3}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-email">
                                Email address
                            </label>
                            <input
                                id="register-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-password">
                                Password
                            </label>
                            <div className="auth-password-wrapper">
                                <input
                                    id="register-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
                                    minLength={8}
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-confirm-password">
                                Confirm password
                            </label>
                            <input
                                id="register-confirm-password"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Enter your password again"
                                minLength={8}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading || Boolean(success)}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create account →"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/">Sign in</Link>
                    </p>

                    <p className="auth-security-note">
                        🔒 Your account is protected by secure sign-in.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register