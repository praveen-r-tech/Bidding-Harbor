import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">⚓</span>
                    <span className="logo-text">Bidding Harbor</span>
                </Link>

                <div className="navbar-links">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                        end
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/auctions" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    >
                        Browse Auctions
                    </NavLink>

                    {isAuthenticated && (
                        <>
                            <NavLink 
                                to="/dashboard" 
                                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                            >
                                Dashboard
                            </NavLink>
                            {user.role === "ADMIN" && (
                                <NavLink 
                                    to="/admin" 
                                    className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                                >
                                    Admin Panel
                                </NavLink>
                            )}
                            <NavLink 
                                to="/profile" 
                                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                            >
                                Profile
                            </NavLink>
                        </>
                    )}
                </div>

                <div className="navbar-auth">
                    {isAuthenticated ? (
                        <div className="user-profile-section">
                            <span className="navbar-user-name">
                                Hi, {user.displayName || user.username}
                                <span className="navbar-user-role-badge">
                                    {user.role}
                                </span>
                            </span>
                            <button onClick={handleLogout} className="btn btn-secondary btn-logout">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
