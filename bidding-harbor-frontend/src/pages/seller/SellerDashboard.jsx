import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getMyAuctions, createAuction, deleteAuction, updateAuction } from "../../services/auctionService";
import { getMyBids } from "../../services/bidService";
import { getUserDashboard, getSellerDashboard } from "../../services/dashboardService";

export const SellerDashboard = () => {
    const { user } = useAuth();
    
    // UI tabs: 'overview', 'bids', 'listings', 'create'
    const [activeTab, setActiveTab] = useState("overview");

    // Dashboards Stats
    const [userStats, setUserStats] = useState(null);
    const [sellerStats, setSellerStats] = useState(null);
    
    // Lists
    const [myAuctions, setMyAuctions] = useState([]);
    const [myBids, setMyBids] = useState([]);

    // States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Create Auction Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startingPrice, setStartingPrice] = useState("");
    const [minimumIncrement, setMinimumIncrement] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Edit Auction state
    const [editingAuction, setEditingAuction] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError("");
        try {
            const [uStats, sStats, auctionsData, bidsData] = await Promise.all([
                getUserDashboard(),
                getSellerDashboard(),
                getMyAuctions(),
                getMyBids()
            ]);

            setUserStats(uStats);
            setSellerStats(sStats);
            setMyAuctions(auctionsData);
            // Sort bids by time descending
            setMyBids(bidsData.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime)));
        } catch (err) {
            console.error("Error loading dashboard data:", err);
            setError("Failed to sync dashboard metrics. Please reload the page.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleCreateAuction = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        // Basic date validation
        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        if (start < now) {
            setError("Start time must be in the future.");
            return;
        }
        if (end <= start) {
            setError("End time must be after the start time.");
            return;
        }

        setSubmitting(true);

        try {
            // ISO-8601 formatting for spring Boot LocalDateTime (YYYY-MM-DDTHH:MM:SS)
            const formattedStart = start.toISOString().split(".")[0];
            const formattedEnd = end.toISOString().split(".")[0];

            await createAuction({
                title,
                description,
                startingPrice: parseFloat(startingPrice),
                minimumIncrement: parseFloat(minimumIncrement),
                startTime: formattedStart,
                endTime: formattedEnd
            });

            setSuccessMsg("Auction listing created successfully! Pending admin approval.");
            
            // Clear form
            setTitle("");
            setDescription("");
            setStartingPrice("");
            setMinimumIncrement("");
            setStartTime("");
            setEndTime("");
            
            // Refresh lists & statistics
            await fetchDashboardData();
            setActiveTab("listings");
        } catch (err) {
            console.error("Listing creation error:", err);
            setError(
                err.response?.data?.message || 
                err.response?.data || 
                "Failed to list auction. Check your inputs."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;
        setError("");
        setSuccessMsg("");
        try {
            await deleteAuction(id);
            setSuccessMsg("Auction deleted successfully.");
            await fetchDashboardData();
        } catch (err) {
            console.error("Deletion error:", err);
            setError("Failed to delete the auction. You might not own this event.");
        }
    };

    const handleStartEdit = (auction) => {
        setEditingAuction(auction);
        setTitle(auction.title);
        setDescription(auction.description);
        setMinimumIncrement(auction.minimumIncrement);
        setActiveTab("create"); // reuse form view
    };

    const handleUpdateAuction = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setSubmitting(true);

        try {
            await updateAuction(editingAuction.id, {
                title,
                description,
                minimumIncrement: parseFloat(minimumIncrement)
            });

            setSuccessMsg("Auction updated successfully!");
            setEditingAuction(null);
            
            // Clear form
            setTitle("");
            setDescription("");
            setMinimumIncrement("");

            await fetchDashboardData();
            setActiveTab("listings");
        } catch (err) {
            console.error("Update error:", err);
            setError(err.response?.data?.message || "Failed to update listing.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingAuction(null);
        setTitle("");
        setDescription("");
        setMinimumIncrement("");
        setActiveTab("listings");
    };

    if (loading && !userStats) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading personal logbook...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Harbor Dashboard</h1>
                    <p>Welcome back, <strong>@{user.username}</strong>. Review your bids and listings below.</p>
                </div>
                {activeTab !== "create" && (
                    <button onClick={() => { setEditingAuction(null); setActiveTab("create"); }} className="btn btn-primary">
                        + List New Item
                    </button>
                )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            {/* Stat Cards */}
            {userStats && sellerStats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Bids Cast</span>
                        <span className="stat-value">{userStats.myBids}</span>
                    </div>
                    <div className="stat-card cyan">
                        <span className="stat-label">Wins Secured</span>
                        <span className="stat-value">{userStats.wonAuctions}</span>
                    </div>
                    <div className="stat-card yellow">
                        <span className="stat-label">Items Listed</span>
                        <span className="stat-value">{sellerStats.totalAuctions}</span>
                    </div>
                    <div className="stat-card green">
                        <span className="stat-label">Revenue Earned</span>
                        <span className="stat-value">${sellerStats.totalRevenue.toFixed(2)}</span>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="dashboard-tabs">
                <button 
                    onClick={() => setActiveTab("overview")} 
                    className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab("bids")} 
                    className={`tab-btn ${activeTab === "bids" ? "active" : ""}`}
                >
                    My Bids ({myBids.length})
                </button>
                <button 
                    onClick={() => setActiveTab("listings")} 
                    className={`tab-btn ${activeTab === "listings" ? "active" : ""}`}
                >
                    My Listings ({myAuctions.length})
                </button>
                <button 
                    onClick={() => setActiveTab("create")} 
                    className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
                >
                    {editingAuction ? "Edit Listing" : "List New Item"}
                </button>
            </div>

            {/* Tab Contents */}
            <div className="tab-content">
                {/* 1. Overview */}
                {activeTab === "overview" && (
                    <div className="grid-2">
                        {/* Recent Bids Preview */}
                        <div className="glass-card">
                            <h3 className="dashboard-section-title">
                                Recent Bids
                                <button onClick={() => setActiveTab("bids")} className="btn btn-secondary btn-table-action">View All</button>
                            </h3>
                            {myBids.length > 0 ? (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Auction</th>
                                            <th>Amount</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myBids.slice(0, 5).map((bid) => (
                                            <tr key={bid.id}>
                                                <td>
                                                    <Link to={`/auctions/${bid.auctionId}`} style={{ color: "var(--primary)", fontWeight: "600" }}>
                                                        Auction #{bid.auctionId}
                                                    </Link>
                                                </td>
                                                <td style={{ fontWeight: "700" }}>${bid.bidAmount.toFixed(2)}</td>
                                                <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                                    {new Date(bid.bidTime).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ color: "var(--text-muted)", padding: "1rem 0" }}>No bids cast yet.</p>
                            )}
                        </div>

                        {/* Recent Listings Preview */}
                        <div className="glass-card">
                            <h3 className="dashboard-section-title">
                                Recent Listings
                                <button onClick={() => setActiveTab("listings")} className="btn btn-secondary btn-table-action">View All</button>
                            </h3>
                            {myAuctions.length > 0 ? (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myAuctions.slice(0, 5).map((auction) => (
                                            <tr key={auction.id}>
                                                <td>
                                                    <Link to={`/auctions/${auction.id}`} style={{ fontWeight: "600" }}>
                                                        {auction.title}
                                                    </Link>
                                                </td>
                                                <td style={{ fontWeight: "700" }}>${auction.currentPrice.toFixed(2)}</td>
                                                <td>
                                                    <span className={`badge badge-${auction.status.toLowerCase()}`}>
                                                        {auction.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ color: "var(--text-muted)", padding: "1rem 0" }}>No items listed yet.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. My Bids */}
                {activeTab === "bids" && (
                    <div className="glass-card">
                        <h3 className="dashboard-section-title">Ledger of Cast Bids</h3>
                        {myBids.length > 0 ? (
                            <div className="dashboard-table-container">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Auction Link</th>
                                            <th>Bid Amount</th>
                                            <th>Bid Time</th>
                                            <th>Bid Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myBids.map((bid) => (
                                            <tr key={bid.id}>
                                                <td>
                                                    <Link to={`/auctions/${bid.auctionId}`} style={{ color: "var(--primary)", fontWeight: "600" }}>
                                                        Go to Auction #{bid.auctionId} &rarr;
                                                    </Link>
                                                </td>
                                                <td style={{ fontWeight: "700", fontSize: "1.05rem" }}>
                                                    ${bid.bidAmount.toFixed(2)}
                                                </td>
                                                <td>{new Date(bid.bidTime).toLocaleString()}</td>
                                                <td>
                                                    <span className={`badge ${bid.bidStatus === "WINNING" || bid.bidStatus === "WON" ? "badge-live" : "badge-ended"}`}>
                                                        {bid.bidStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem 0" }}>
                                You have not placed any bids on the harbor yet.
                            </p>
                        )}
                    </div>
                )}

                {/* 3. My Listings */}
                {activeTab === "listings" && (
                    <div className="glass-card">
                        <h3 className="dashboard-section-title">Created Auction Listings</h3>
                        {myAuctions.length > 0 ? (
                            <div className="dashboard-table-container">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Starting Price</th>
                                            <th>Current Bid</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myAuctions.map((auction) => (
                                            <tr key={auction.id}>
                                                <td>
                                                    <Link to={`/auctions/${auction.id}`} style={{ fontWeight: "600", color: "#FFF" }}>
                                                        {auction.title}
                                                    </Link>
                                                </td>
                                                <td>${auction.startingPrice.toFixed(2)}</td>
                                                <td style={{ fontWeight: "700" }}>${auction.currentPrice.toFixed(2)}</td>
                                                <td>
                                                    <span className={`badge badge-${auction.status.toLowerCase()}`}>
                                                        {auction.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="dashboard-actions">
                                                        <Link to={`/auctions/${auction.id}`} className="btn btn-secondary btn-table-action">
                                                            View
                                                        </Link>
                                                        {auction.status === "PENDING_APPROVAL" && (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleStartEdit(auction)} 
                                                                    className="btn btn-primary btn-table-action"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete(auction.id)} 
                                                                    className="btn btn-danger btn-table-action"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem 0" }}>
                                You have not listed any items on the harbor yet.
                            </p>
                        )}
                    </div>
                )}

                {/* 4. Create / Edit Auction Listing */}
                {activeTab === "create" && (
                    <div className="auction-form-card">
                        <h3>{editingAuction ? "Edit Pending Listing" : "Anchor New Auction Listing"}</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                            {editingAuction 
                                ? "Update the title, description, or increment value. Price and times are immutable once set." 
                                : "Listings are placed in pending state until approved by a Harbor Administrator."
                            }
                        </p>

                        <form onSubmit={editingAuction ? handleUpdateAuction : handleCreateAuction}>
                            <div className="form-group">
                                <label htmlFor="title">Item Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-input"
                                    placeholder="e.g. Rare Vintage Pocket Watch (1895)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    maxLength="120"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Item Description</label>
                                <textarea
                                    id="description"
                                    className="form-input"
                                    placeholder="Describe the details, quality, history, and shipment..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="5"
                                    maxLength="2000"
                                    style={{ resize: "vertical" }}
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="startingPrice">Starting Bid ($)</label>
                                    <input
                                        type="number"
                                        id="startingPrice"
                                        className="form-input"
                                        placeholder="10.00"
                                        step="0.01"
                                        min="1.00"
                                        value={startingPrice}
                                        onChange={(e) => setStartingPrice(e.target.value)}
                                        required
                                        disabled={!!editingAuction}
                                        style={editingAuction ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="minimumIncrement">Minimum Increment ($)</label>
                                    <input
                                        type="number"
                                        id="minimumIncrement"
                                        className="form-input"
                                        placeholder="1.00"
                                        step="0.01"
                                        min="1.00"
                                        value={minimumIncrement}
                                        onChange={(e) => setMinimumIncrement(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {!editingAuction && (
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="startTime">Bidding Start Time</label>
                                        <input
                                            type="datetime-local"
                                            id="startTime"
                                            className="form-input"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            required
                                            style={{ colorScheme: "dark" }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="endTime">Bidding End Time</label>
                                        <input
                                            type="datetime-local"
                                            id="endTime"
                                            className="form-input"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            required
                                            style={{ colorScheme: "dark" }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? "Submitting..." : (editingAuction ? "Save Changes" : "Create Listing")}
                                </button>
                                {editingAuction ? (
                                    <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                                        Cancel Edit
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => setActiveTab("overview")} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
export default SellerDashboard;
