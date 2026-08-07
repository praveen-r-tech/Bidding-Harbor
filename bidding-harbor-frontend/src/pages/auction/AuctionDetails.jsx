import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAuction } from "../../services/auctionService";
import { getAuctionBids, placeBid, getWinner } from "../../services/bidService";

export const AuctionDetails = () => {
    const { id } = useParams();
    const auctionId = parseInt(id);
    const { isAuthenticated, user } = useAuth();
    
    // Core data states
    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [winner, setWinner] = useState(null);
    
    // Status states
    const [loading, setLoading] = useState(true);
    const [submittingBid, setSubmittingBid] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    
    // Bid Input state
    const [bidAmount, setBidAmount] = useState("");
    
    // Countdown state
    const [timeLeft, setTimeLeft] = useState("");
    const timerRef = useRef(null);

    // Initial and periodic data fetching
    const fetchData = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setError("");
        try {
            const auctionData = await getAuction(auctionId);
            setAuction(auctionData);

            // Calculate minimum next bid
            const minNext = auctionData.currentPrice 
                ? (auctionData.currentPrice + auctionData.minimumIncrement) 
                : auctionData.startingPrice;
            setBidAmount(minNext.toFixed(2));

            // Fetch bid history
            const bidHistory = await getAuctionBids(auctionId);
            // Sort bids by amount descending
            setBids(bidHistory.sort((a, b) => b.bidAmount - a.bidAmount));

            // If auction ended, fetch winner
            if (auctionData.status === "ENDED") {
                try {
                    const winnerData = await getWinner(auctionId);
                    setWinner(winnerData);
                } catch (e) {
                    console.warn("No winner details found or auction settled empty.", e);
                }
            }
        } catch (err) {
            console.error("Error fetching auction details:", err);
            setError("Failed to load auction details. It might have been deleted.");
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        
        // Polling bid updates every 5 seconds for live bidding experience
        const intervalId = setInterval(() => {
            fetchData(false);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [id]);

    const formatDuration = (ms) => {
        const totalSecs = Math.floor(ms / 1000);
        const secs = totalSecs % 60;
        const totalMins = Math.floor(totalSecs / 60);
        const mins = totalMins % 60;
        const totalHours = Math.floor(totalMins / 60);
        const hours = totalHours % 24;
        const days = Math.floor(totalHours / 24);

        const pad = (num) => String(num).padStart(2, "0");

        if (days > 0) {
            return `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
        }
        return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    };

    // Countdown Timer logic
    useEffect(() => {
        if (!auction) return;

        const updateTimer = () => {
            const now = new Date();
            const start = new Date(auction.startTime);
            const end = new Date(auction.endTime);

            if (now < start) {
                const diff = start - now;
                setTimeLeft(`Starts in: ${formatDuration(diff)}`);
            } else if (now >= start && now <= end) {
                const diff = end - now;
                setTimeLeft(formatDuration(diff));
            } else {
                setTimeLeft("Auction Closed");
                if (auction.status === "LIVE") {
                    // Trigger refresh to update status to ENDED
                    fetchData(false);
                }
            }
        };

        updateTimer();
        timerRef.current = setInterval(updateTimer, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [auction]);

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        
        const numericBid = parseFloat(bidAmount);
        const minAcceptableBid = auction.currentPrice 
            ? (auction.currentPrice + auction.minimumIncrement) 
            : auction.startingPrice;

        if (isNaN(numericBid) || numericBid < minAcceptableBid) {
            setError(`Bid must be at least $${minAcceptableBid.toFixed(2)}.`);
            return;
        }

        if (auction.sellerUsername === user?.username) {
            setError("You cannot place a bid on your own auction.");
            return;
        }

        setSubmittingBid(true);

        try {
            await placeBid(auctionId, numericBid);
            setSuccessMessage("Your bid was placed successfully!");
            fetchData(false); // Refresh stats
        } catch (err) {
            console.error("Bid placing error:", err);
            setError(
                err.response?.data?.message || 
                err.response?.data || 
                "Failed to place bid. Ensure your bid is higher than the current price."
            );
        } finally {
            setSubmittingBid(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Retrieving harbor logbook...</p>
            </div>
        );
    }

    if (error && !auction) {
        return (
            <div className="alert alert-danger" style={{ margin: "2rem auto", maxWidth: "600px", textAlign: "center" }}>
                <h3>Error</h3>
                <p>{error}</p>
                <Link to="/auctions" className="btn btn-secondary" style={{ marginTop: "1rem" }}>
                    Back to Board
                </Link>
            </div>
        );
    }

    const minAcceptableBid = auction.currentPrice 
        ? (auction.currentPrice + auction.minimumIncrement) 
        : auction.startingPrice;

    return (
        <div className="auction-details-container">
            <div className="details-banner">
                <h1>{auction.title}</h1>
                <span className={`badge auction-status-badge badge-${auction.status.toLowerCase()}`} style={{ top: "1.5rem", right: "1.5rem", padding: "0.5rem 1rem" }}>
                    {auction.status}
                </span>
            </div>

            <div className="details-main-info" style={{ borderRadius: "0 0 16px 16px" }}>
                <div className="details-metadata-grid">
                    <div className="auction-stat-item">
                        <span className="auction-stat-label">Seller</span>
                        <span className="auction-stat-val" style={{ color: "var(--primary)" }}>@{auction.sellerUsername}</span>
                    </div>
                    <div className="auction-stat-item">
                        <span className="auction-stat-label">Starting Price</span>
                        <span className="auction-stat-val">${auction.startingPrice.toFixed(2)}</span>
                    </div>
                    <div className="auction-stat-item">
                        <span className="auction-stat-label">Min. Increment</span>
                        <span className="auction-stat-val">${auction.minimumIncrement.toFixed(2)}</span>
                    </div>
                    <div className="auction-stat-item">
                        <span className="auction-stat-label">Current High Bid</span>
                        <span className="auction-stat-val" style={{ color: "#FFF", fontSize: "1.5rem" }}>
                            ${auction.currentPrice.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="details-layout">
                {/* Left Side: Description */}
                <div className="details-content-left">
                    <div className="glass-card">
                        <h3 className="details-desc-title">Description</h3>
                        <p className="details-desc-text">{auction.description || "No description provided by seller."}</p>
                        
                        <div className="auction-timings" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                            <div>
                                <span className="auction-stat-label">Start Time</span>
                                <p style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                                    {new Date(auction.startTime).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <span className="auction-stat-label">End Time</span>
                                <p style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                                    {new Date(auction.endTime).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Action Widget & Bids list */}
                <div className="details-content-right bidding-panel">
                    {/* Bidding box */}
                    <div className="bid-widget glass-card">
                        <div className="timer-box">
                            <span className="timer-label">Time Remaining</span>
                            <div className="timer-value" style={{ color: auction.status === "LIVE" ? "#10B981" : "inherit" }}>
                                {timeLeft}
                            </div>
                        </div>

                        {error && <div className="alert alert-danger" style={{ padding: "0.75rem", fontSize: "0.85rem" }}>{error}</div>}
                        {successMessage && <div className="alert alert-success" style={{ padding: "0.75rem", fontSize: "0.85rem" }}>{successMessage}</div>}

                        {auction.status === "ENDED" ? (
                            <div style={{ textAlign: "center", padding: "0.5rem" }}>
                                <h4 style={{ color: "var(--danger)" }}>Auction Closed</h4>
                                {winner ? (
                                    <div style={{ marginTop: "1rem", background: "rgba(16, 185, 129, 0.08)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.2)" }}>
                                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Winner declared</p>
                                        <p style={{ fontSize: "1.2rem", fontWeight: "800", color: "#FFF", margin: "0.25rem 0" }}>
                                            @{winner.winnerUsername}
                                        </p>
                                        <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--success)" }}>
                                            ${winner.winningAmount.toFixed(2)}
                                        </span>
                                    </div>
                                ) : (
                                    <p style={{ marginTop: "0.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                        No bids were cast. Settled empty.
                                    </p>
                                )}
                            </div>
                        ) : auction.status === "UPCOMING" ? (
                            <div style={{ textAlign: "center", padding: "1rem", color: "var(--text-muted)" }}>
                                <h4>Bidding starts shortly</h4>
                                <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Keep this window open to receive live updates.</p>
                            </div>
                        ) : !isAuthenticated ? (
                            <div style={{ textAlign: "center" }}>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                                    You must be logged in to cast a bid on this item.
                                </p>
                                <Link to="/login" className="btn btn-primary" style={{ width: "100%" }}>
                                    Login to Bid
                                </Link>
                            </div>
                        ) : auction.sellerUsername === user.username ? (
                            <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                <p>You listed this auction. You cannot bid on your own listings.</p>
                            </div>
                        ) : (
                            <form onSubmit={handlePlaceBid}>
                                <div className="bid-input-container">
                                    <label htmlFor="bidInput" className="auction-stat-label">Your Bid Amount</label>
                                    <div className="bid-input-wrapper">
                                        <span className="bid-currency">$</span>
                                        <input
                                            type="number"
                                            id="bidInput"
                                            className="bid-input"
                                            step="0.01"
                                            min={minAcceptableBid}
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <span className="bid-increment-info">
                                        Min next bid: <strong>${minAcceptableBid.toFixed(2)}</strong>
                                    </span>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    style={{ width: "100%", padding: "0.85rem" }}
                                    disabled={submittingBid}
                                >
                                    {submittingBid ? "Casting Bid..." : "Cast My Bid"}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Bids Log */}
                    <div className="bid-log-card">
                        <h3 className="bid-log-title">Bid Ledger ({bids.length})</h3>
                        <div className="bid-log-list">
                            {bids.length > 0 ? (
                                bids.map((bid, index) => (
                                    <div key={bid.id || index} className={`bid-log-item ${index === 0 ? "highest" : ""}`}>
                                        <div className="bidder-info">
                                            <div className="bidder-avatar">
                                                {bid.bidderUsername ? bid.bidderUsername.substring(0, 2).toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: "700", fontSize: "0.95rem" }}>
                                                    @{bid.bidderUsername}
                                                    {index === 0 && <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", verticalAlign: "middle" }} className="badge badge-live">High</span>}
                                                </p>
                                                <span className="bid-log-time">
                                                    {new Date(bid.bidTime).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bid-log-amount" style={{ color: index === 0 ? "var(--success)" : "inherit" }}>
                                            ${bid.bidAmount.toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "1.5rem 0", fontSize: "0.9rem" }}>
                                    No bids cast yet. Be the first to bid!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AuctionDetails;
