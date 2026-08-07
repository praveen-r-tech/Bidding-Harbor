import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { login, getCurrentUser } from "../../services/authService";

export const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const { login: saveAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            // 1. Call login endpoint to get token
            const authData = await login({ usernameOrEmail, password });
            
            // 2. Fetch authenticated user details
            localStorage.setItem("token", authData.token); // set temporarily so getCurrentUser request gets interceptor token
            const userProfile = await getCurrentUser();

            // 3. Save into AuthContext (will also write to storage)
            saveAuth(authData.token, userProfile);

            // 4. Navigate based on role
            if (userProfile.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login error:", err);
            localStorage.removeItem("token"); // clean up temp token
            setError(
                err.response?.data?.message || 
                err.response?.data ||
                "Invalid credentials. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Anchor your bids at Bidding Harbor</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="usernameOrEmail">Username or Email</label>
                        <input
                            type="text"
                            id="usernameOrEmail"
                            className="form-input"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            required
                            placeholder="Enter username or email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-auth-submit"
                        disabled={submitting}
                    >
                        {submitting ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>
            </div>
        </div>
    );
};
export default Login;
