import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "../../services/dashboardService";
import { getPendingAuctions, approveAuction, rejectAuction } from "../../services/adminService";

export const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [pendingList, setPendingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Rejection state
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [actionSubmitting, setActionSubmitting] = useState(false);

    const fetchAdminData = async () => {
        setLoading(true);
        setError("");
        try {
            const [adminStats, pending] = await Promise.all([
                getAdminDashboard(),
                getPendingAuctions()
            ]);
            setStats(adminStats);
            setPendingList(pending);
        } catch (err) {
            console.error("Admin dashboard fetch error:", err);
            setError("Failed to synchronize harbor ledger. Ensure your account has administrator privileges.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleApprove = async (id) => {
        if (!confirm("Are you sure you want to approve this auction?")) return;
        setError("");
        setSuccessMsg("");
        setActionSubmitting(true);

        try {
            await approveAuction(id);
            setSuccessMsg("Auction approved and published to Harbor board.");
            await fetchAdminData();
        } catch (err) {
            console.error("Approval error:", err);
            setError("Failed to approve auction. Please try again.");
        } finally {
            setActionSubmitting(false);
        }
    };

    const handleStartReject = (id) => {
        setRejectingId(id);
        setRejectionReason("");
    };

    const handleCancelReject = () => {
        setRejectingId(null);
        setRejectionReason("");
    };

    const handleRejectSubmit = async (e, id) => {
        e.preventDefault();
        if (!rejectionReason.trim()) {
            alert("Please specify a rejection reason.");
            return;
        }

        setError("");
        setSuccessMsg("");
        setActionSubmitting(true);

        try {
            await rejectAuction(id, rejectionReason.trim());
            setSuccessMsg("Auction listing has been rejected and notified.");
            setRejectingId(null);
            setRejectionReason("");
            await fetchAdminData();
        } catch (err) {
            console.error("Rejection error:", err);
            setError("Failed to reject auction listing.");
        } finally {
            setActionSubmitting(false);
        }
    };

    if (loading && !stats) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading Admin Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="dashboard-header">
                <div>
                    <h1>Harbor Control Panel</h1>
                    <p>Harbor administrator console for reviewing pending events, users, and transactions.</p>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            {/* Admin Stats Grid */}
            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{stats.totalUsers}</span>
                    </div>
                    <div className="stat-card yellow">
                        <span className="stat-label">Pending Approvals</span>
                        <span className="stat-value">{stats.pendingApprovals}</span>
                    </div>
                    <div className="stat-card green">
                        <span className="stat-label">Live Auctions</span>
                        <span className="stat-value">{stats.liveAuctions}</span>
                    </div>
                    <div className="stat-card cyan">
                        <span className="stat-label">Closed Auctions</span>
                        <span className="stat-value">{stats.endedAuctions}</span>
                    </div>
                </div>
            )}

            {/* Pending Approvals Table */}
            <div className="glass-card" style={{ marginTop: "2rem" }}>
                <h3 className="dashboard-section-title">
                    Pending Listings Queue ({pendingList.length})
                </h3>
                
                {pendingList.length > 0 ? (
                    <div className="dashboard-table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Item Title</th>
                                    <th>Seller</th>
                                    <th>Starting Price</th>
                                    <th>Duration</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingList.map((auction) => (
                                    <tr key={auction.id}>
                                        <td style={{ fontWeight: "600" }}>
                                            <Link to={`/auctions/${auction.id}`} style={{ color: "#FFF" }}>
                                                {auction.title}
                                            </Link>
                                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "400", marginTop: "0.25rem" }}>
                                                {auction.description ? auction.description.substring(0, 80) + "..." : "No description"}
                                            </p>
                                        </td>
                                        <td>@{auction.sellerUsername}</td>
                                        <td style={{ fontWeight: "700" }}>${auction.startingPrice.toFixed(2)}</td>
                                        <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                            {new Date(auction.startTime).toLocaleDateString()} to {new Date(auction.endTime).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {rejectingId === auction.id ? (
                                                <form onSubmit={(e) => handleRejectSubmit(e, auction.id)} className="rejection-reason-container">
                                                    <input
                                                        type="text"
                                                        className="rejection-reason-input"
                                                        placeholder="Provide reason for rejection..."
                                                        value={rejectionReason}
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                        required
                                                        disabled={actionSubmitting}
                                                    />
                                                    <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.25rem" }}>
                                                        <button type="submit" className="btn btn-primary btn-table-action" disabled={actionSubmitting}>
                                                            Confirm
                                                        </button>
                                                        <button type="button" onClick={handleCancelReject} className="btn btn-secondary btn-table-action" disabled={actionSubmitting}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="dashboard-actions">
                                                    <button
                                                        onClick={() => handleApprove(auction.id)}
                                                        className="btn btn-primary btn-table-action"
                                                        style={{ background: "var(--success)" }}
                                                        disabled={actionSubmitting}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStartReject(auction.id)}
                                                        className="btn btn-danger btn-table-action"
                                                        disabled={actionSubmitting}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem 0" }}>
                        Queue settled. No pending approvals at this time.
                    </p>
                )}
            </div>
        </div>
    );
};
export default AdminDashboard;
