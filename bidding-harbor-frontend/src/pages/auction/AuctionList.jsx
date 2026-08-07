import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchAuctions } from "../../services/auctionService";

export const AuctionList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Read query params from URL
    const queryKeyword = searchParams.get("keyword") || "";
    const queryStatus = searchParams.get("status") || "LIVE"; // default to LIVE for better user experience

    // Local filter states
    const [keyword, setKeyword] = useState(queryKeyword);
    const [status, setStatus] = useState(queryStatus);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    
    // Page state (Spring Page is 0-indexed)
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
    // Content state
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Trigger search when search state changes or pages change
    useEffect(() => {
        const fetchFilteredAuctions = async () => {
            setLoading(true);
            setError("");
            
            try {
                // Build search parameters matching backend SearchAuctionRequest + Pageable
                const params = {
                    page: page,
                    size: 9 // items per page
                };

                if (queryKeyword) params.keyword = queryKeyword;
                if (queryStatus && queryStatus !== "ALL") params.status = queryStatus;
                if (minPrice) params.minPrice = parseFloat(minPrice);
                if (maxPrice) params.maxPrice = parseFloat(maxPrice);

                const data = await searchAuctions(params);
                
                // Spring Boot Pageable parsing
                setAuctions(data.content || []);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error("Error searching auctions:", err);
                setError("Failed to load auctions from harbor. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredAuctions();
    }, [searchParams, page, minPrice, maxPrice]);

    // Handle form submissions
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(0); // reset page to first on new filter
        
        const newParams = {};
        if (keyword.trim()) newParams.keyword = keyword.trim();
        if (status) newParams.status = status;
        
        setSearchParams(newParams);
    };

    const handleClearFilters = () => {
        setKeyword("");
        setStatus("LIVE");
        setMinPrice("");
        setMaxPrice("");
        setPage(0);
        setSearchParams({ status: "LIVE" });
    };

    // Countdown Helper for Auction Card
    const getRemainingTime = (endTimeStr) => {
        const diff = new Date(endTimeStr) - new Date();
        if (diff <= 0) return "Ended";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h remaining`;
        }
        return `${hours}h ${mins}m remaining`;
    };

    return (
        <div className="auction-list-container">
            <div className="dashboard-header">
                <div>
                    <h1>Harbor Auction Board</h1>
                    <p>Browse, filter, and cast your bids on open events</p>
                </div>
            </div>

            {/* Filters Bar */}
            <form onSubmit={handleFilterSubmit} className="filter-panel glass-card">
                <div className="filter-group">
                    <label htmlFor="keyword">Keyword</label>
                    <input
                        type="text"
                        id="keyword"
                        className="form-input"
                        placeholder="Search item title..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        className="form-input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ background: "#14121F" }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="LIVE">Live Now</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ENDED">Ended</option>
                    </select>
                </div>

                <div className="filter-group" style={{ minWidth: "120px" }}>
                    <label htmlFor="minPrice">Min Price ($)</label>
                    <input
                        type="number"
                        id="minPrice"
                        className="form-input"
                        placeholder="0.00"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </div>

                <div className="filter-group" style={{ minWidth: "120px" }}>
                    <label htmlFor="maxPrice">Max Price ($)</label>
                    <input
                        type="number"
                        id="maxPrice"
                        className="form-input"
                        placeholder="9999"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: "0.85rem 1.5rem" }}>
                        Filter
                    </button>
                    <button type="button" onClick={handleClearFilters} className="btn btn-secondary" style={{ padding: "0.85rem" }}>
                        Reset
                    </button>
                </div>
            </form>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* List Results */}
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading auctions...</p>
                </div>
            ) : auctions.length > 0 ? (
                <>
                    <div className="auction-grid">
                        {auctions.map((auction) => (
                            <div key={auction.id} className="auction-card">
                                <div className="auction-card-banner">
                                    <div className="auction-banner-title">{auction.title}</div>
                                    <span className={`badge auction-status-badge badge-${auction.status.toLowerCase()}`}>
                                        {auction.status}
                                    </span>
                                </div>
                                <div className="auction-card-body">
                                    <p className="auction-card-desc">{auction.description || "No description provided."}</p>
                                    
                                    <div className="auction-card-stats">
                                        <div className="auction-stat-item">
                                            <span className="auction-stat-label">
                                                {auction.status === "ENDED" ? "Final Price" : "Current Bid"}
                                            </span>
                                            <span className="auction-stat-val">
                                                ${auction.currentPrice ? auction.currentPrice.toFixed(2) : auction.startingPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="auction-stat-item">
                                            <span className="auction-stat-label">
                                                {auction.status === "UPCOMING" ? "Starts" : "Timer"}
                                            </span>
                                            <span className="auction-stat-val" style={{ color: auction.status === "LIVE" ? "#10B981" : "inherit" }}>
                                                {auction.status === "LIVE" ? getRemainingTime(auction.endTime) : 
                                                 auction.status === "UPCOMING" ? "Upcoming" : "Closed"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="auction-card-footer">
                                        <span className="seller-name">by @{auction.sellerUsername}</span>
                                        <Link to={`/auctions/${auction.id}`} className="btn btn-primary">
                                            {auction.status === "LIVE" ? "Bid Now" : "View"}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-container" style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "3rem", alignItems: "center" }}>
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="btn btn-secondary"
                                style={{ padding: "0.5rem 1rem" }}
                            >
                                &larr; Prev
                            </button>
                            <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
                                Page {page + 1} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page === totalPages - 1}
                                className="btn btn-secondary"
                                style={{ padding: "0.5rem 1rem" }}
                            >
                                Next &rarr;
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="no-auctions glass-card">
                    <h3>No auctions matching criteria.</h3>
                    <p>Try resetting filters or search query.</p>
                </div>
            )}
        </div>
    );
};
export default AuctionList;
