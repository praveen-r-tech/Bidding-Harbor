import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { register, login, getCurrentUser } from "../../services/authService";

export const Register = () => {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const { login: saveAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Front-end validations to match Spring validations
        if (username.length < 4 || username.length > 30) {
            setError("Username must be between 4 and 30 characters.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setSubmitting(true);

        try {
            // 1. Call registration endpoint
            await register({ username, displayName, email, password });
            
            // 2. Automatically log them in after registration
            const authData = await login({ usernameOrEmail: username, password });
            
            // 3. Fetch user profile details
            localStorage.setItem("token", authData.token);
            const userProfile = await getCurrentUser();

            // 4. Save into AuthContext
            saveAuth(authData.token, userProfile);
            
            navigate("/dashboard");
        } catch (err) {
            console.error("Registration error:", err);
            localStorage.removeItem("token");
            setError(
                err.response?.data?.message || 
                err.response?.data ||
                "Failed to register. Username or email might already be taken."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Start listing and bidding today</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username (min 4 chars)</label>
                        <input
                            type="text"
                            id="username"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="displayName">Display Name</label>
                        <input
                            type="text"
                            id="displayName"
                            className="form-input"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            placeholder="Enter display name (e.g. John Doe)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter email address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password (min 8 chars)</label>
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
                        {submitting ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};
export default Register;
