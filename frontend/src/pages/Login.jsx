import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./Auth.css"

function Login({ setIsLoggedIn }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (event) => {
        event.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/login",
                { username, password }
            )

            localStorage.setItem(
                "access_token",
                response.data.access_token
            )

            setIsLoggedIn(true)
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                (error.response
                    ? "Invalid username or password"
                    : "Unable to connect to the server")
            )
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
                        YOUR HEALTH, OUR PRIORITY
                    </span>
                    <h1>Better healthcare starts with better care.</h1>
                    <p>
                        A smarter way to manage appointments,
                        medical records and your healthcare journey.
                    </p>

                    <div className="auth-feature">
                        <span>✓</span>
                        <div>
                            <strong>Connected care</strong>
                            <p>Keep your healthcare information organized.</p>
                        </div>
                    </div>

                    <div className="auth-feature">
                        <span>✓</span>
                        <div>
                            <strong>Secure access</strong>
                            <p>Access your account with authenticated sign-in.</p>
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
                        WELCOME BACK
                    </span>
                    <h2>Sign in to your account</h2>
                    <p className="auth-description">
                        Enter your credentials to continue.
                    </p>

                    {error && (
                        <div className="auth-error" role="alert">
                            {error}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="auth-field">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>
                            <div className="auth-password-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in →"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/register">Create an account</Link>
                    </p>

                    <p className="auth-security-note">
                        🔒 Your account is protected by secure sign-in.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login