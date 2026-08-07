import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile, changePassword, deleteAccount } from "../../services/authService";

export const Profile = () => {
    const { user, login: saveAuth, logout } = useAuth();
    const navigate = useNavigate();

    // Profile Details States
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    
    // Password States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Feedback States
    const [profileSuccess, setProfileSuccess] = useState("");
    const [profileError, setProfileError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Submitting indicators
    const [profileSubmitting, setProfileSubmitting] = useState(false);
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);
    
    // Delete Confirmation
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileError("");
        setProfileSuccess("");
        setProfileSubmitting(true);

        try {
            const updatedUser = await updateProfile({ displayName, email });
            // Retrieve current token
            const token = localStorage.getItem("token");
            // Update auth state in context
            saveAuth(token, updatedUser);
            setProfileSuccess("Profile updated successfully!");
        } catch (err) {
            console.error("Profile update error:", err);
            setProfileError(
                err.response?.data?.message || 
                err.response?.data || 
                "Failed to update profile."
            );
        } finally {
            setProfileSubmitting(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (newPassword !== confirmNewPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            return;
        }

        setPasswordSubmitting(true);

        try {
            await changePassword({ oldPassword, newPassword });
            setPasswordSuccess("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            console.error("Password change error:", err);
            setPasswordError(
                err.response?.data?.message || 
                err.response?.data || 
                "Failed to change password. Please check your current password."
            );
        } finally {
            setPasswordSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }

        try {
            await deleteAccount();
            logout();
            navigate("/");
        } catch (err) {
            console.error("Delete account error:", err);
            alert("Failed to delete account. Please try again later.");
        }
    };

    return (
        <div className="profile-container">
            <div className="dashboard-header">
                <div>
                    <h1>My Account Settings</h1>
                    <p>Manage your public identity, security credentials, and harbor membership</p>
                </div>
            </div>

            <div className="grid-2">
                {/* Profile Details Card */}
                <div className="profile-card glass-card">
                    <h3>Profile Information</h3>
                    <p className="card-subtitle" style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                        Update your public display identity and registered email.
                    </p>

                    {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
                    {profileError && <div className="alert alert-danger">{profileError}</div>}

                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>Username (Immutable)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={user?.username || ""}
                                disabled
                                style={{ opacity: 0.6, cursor: "not-allowed" }}
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
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={profileSubmitting}
                            style={{ marginTop: "1rem" }}
                        >
                            {profileSubmitting ? "Saving..." : "Update Profile"}
                        </button>
                    </form>
                </div>

                {/* Password Change Card */}
                <div className="profile-card glass-card">
                    <h3>Change Password</h3>
                    <p className="card-subtitle" style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                        Keep your account secure by rotating your password regularly.
                    </p>

                    {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
                    {passwordError && <div className="alert alert-danger">{passwordError}</div>}

                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label htmlFor="oldPassword">Current Password</label>
                            <input
                                type="password"
                                id="oldPassword"
                                className="form-input"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password (min 8 characters)</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmNewPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                className="form-input"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                                placeholder="Re-enter new password"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={passwordSubmitting}
                            style={{ marginTop: "1rem" }}
                        >
                            {passwordSubmitting ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Account Status / Danger Zone */}
            <div className="glass-card" style={{ marginTop: "2.5rem", borderColor: "rgba(239, 68, 68, 0.25)" }}>
                <h3 style={{ color: "var(--danger)" }}>Danger Zone</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Once you delete your account, there is no going back. All active bids and draft listings will be archived.
                </p>
                
                {confirmDelete ? (
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#FFF" }}>
                            Are you absolutely sure? This action is IRREVERSIBLE.
                        </span>
                        <button onClick={handleDeleteAccount} className="btn btn-danger">
                            Yes, Delete Permanently
                        </button>
                        <button onClick={() => setConfirmDelete(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button onClick={handleDeleteAccount} className="btn btn-danger">
                        Delete My Account
                    </button>
                )}
            </div>
        </div>
    );
};
export default Profile;
