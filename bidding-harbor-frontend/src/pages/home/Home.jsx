import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAuctions } from "../../services/auctionService";

export const Home = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [recentAuctions, setRecentAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const data = await getAuctions();
                // If backend returns a Page object (which we saw it does: Page<AuctionResponse> in AuctionController.java)
                // we should extract elements from .content or data directly
                const auctionsList = data?.content || data || [];
                // Only show LIVE/UPCOMING and slice to 3
                const active = auctionsList
                    .filter(a => a.status === "LIVE" || a.status === "UPCOMING")
                    .slice(0, 3);
                setRecentAuctions(active);
            } catch (err) {
                console.error("Error fetching homepage auctions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/auctions?keyword=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/auctions");
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <header className="hero-section glass-card">
                <div className="hero-content">
                    <div className="hero-badge">⛵ Anchor Your Bids</div>
                    <h1 className="hero-title">
                        Discover & Bid on Exclusive Items in Real-Time
                    </h1>
                    <p className="hero-subtitle">
                        Bidding Harbor is the premier community-driven marketplace for digital collectibles, premium assets, and vintage items. Fair bidding, absolute transparency.
                    </p>

                    {/* Quick Search */}
                    <form onSubmit={handleSearchSubmit} className="hero-search-form">
                        <input
                            type="text"
                            placeholder="Search active auctions (e.g. vintage, watch)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="hero-search-input"
                        />
                        <button type="submit" className="btn btn-primary hero-search-btn">
                            Search
                        </button>
                    </form>

                    <div className="hero-actions">
                        {isAuthenticated ? (
                            <>
                                <Link to="/auctions" className="btn btn-primary">
                                    Browse Live Bids
                                </Link>
                                <Link to="/dashboard" className="btn btn-secondary">
                                    My Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-primary">
                                    Get Started
                                </Link>
                                <Link to="/auctions" className="btn btn-secondary">
                                    Explore Auctions
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Featured Active Auctions */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Live & Upcoming Bidding Events</h2>
                    <Link to="/auctions" className="view-all-link">
                        View All Auctions &rarr;
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Navigating active auctions...</p>
                    </div>
                ) : recentAuctions.length > 0 ? (
                    <div className="auction-grid">
                        {recentAuctions.map((auction) => (
                            <div key={auction.id} className="auction-card">
                                <div className="auction-card-banner">
                                    <div className="auction-banner-title">{auction.title}</div>
                                    <span className={`badge auction-status-badge badge-${auction.status.toLowerCase()}`}>
                                        {auction.status}
                                    </span>
                                </div>
                                <div className="auction-card-body">
                                    <p className="auction-card-desc">{auction.description}</p>
                                    <div className="auction-card-stats">
                                        <div className="auction-stat-item">
                                            <span className="auction-stat-label">Current Bid</span>
                                            <span className="auction-stat-val">${auction.currentPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="auction-stat-item">
                                            <span className="auction-stat-label">Starts at</span>
                                            <span className="auction-stat-val">${auction.startingPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="auction-card-footer">
                                        <span className="seller-name">by @{auction.sellerUsername}</span>
                                        <Link to={`/auctions/${auction.id}`} className="btn btn-primary">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-auctions glass-card">
                        <h3>No active auctions found.</h3>
                        <p>Be the first to list an item on the harbor!</p>
                        {isAuthenticated && (
                            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                                List an Item
                            </Link>
                        )}
                    </div>
                )}
            </section>

            {/* How it works */}
            <section className="how-it-works-section">
                <h2>How Bidding Harbor Works</h2>
                <div className="grid-3">
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🔍</div>
                        <h3>1. Find Rare Items</h3>
                        <p>Search through curated collections of items pending approval by harbor administrators to guarantee validity.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">⚡</div>
                        <h3>2. Bid & Secure</h3>
                        <p>Place transparent bids with minimum increment settings. Automated timers close when bids settle.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">⚓</div>
                        <h3>3. Auction Settlement</h3>
                        <p>Winners are computed automatically. Sellers view earnings and buyers retrieve won receipts on their dashboards.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default Home;
