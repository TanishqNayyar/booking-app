import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchExperts } from '../api';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadExperts();
  }, [search, category, page]);

  const loadExperts = async () => {
    setLoading(true);
    try {
      const { data } = await fetchExperts({ search, category, page, limit: 6 });
      setExperts(data.experts);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'E';
  };

  return (
    <div className="app">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-badge">✨ Trusted by 10,000+ clients worldwide</div>
        <h1>Find Your Perfect Expert <span>Mentor</span></h1>
        <p>Connect with top-rated professionals and book sessions instantly. Real-time availability, secure payments, and expert guidance.</p>

        {/* Hide buttons when logged in */}
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <h2>500+</h2>
          <p>Expert Professionals</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">😊</div>
          <h2>10K+</h2>
          <p>Happy Clients</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <h2>50+</h2>
          <p>Categories</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <h2>4.9</h2>
          <p>Average Rating</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <h2>🔍 Find Your Perfect Expert</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            <option value="Health">Health & Medical</option>
            <option value="Tech">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Legal">Legal</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      {/* Expert Grid */}
      <div className="experts-section">
        <div className="section-header">
          <h2>👨‍🏫 Available Experts</h2>
          <span className="experts-count">{experts.length} experts found</span>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="grid">
              {experts.map(expert => (
                <div key={expert._id} className="card">
                  <div className="card-header">
                    <div className="avatar">{getInitials(expert.name)}</div>
                    <div className="rating-badge">⭐ {expert.rating}</div>
                  </div>

                  <span className="category">{expert.category}</span>
                  <h3>{expert.name}</h3>
                  <p className="card-desc">{expert.bio || `Experienced ${expert.category} professional ready to help you succeed.`}</p>

                  <div className="card-stats">
                    <span className="card-stat">
                      <span className="card-stat-icon">💼</span>
                      {expert.experience} years
                    </span>
                    <span className="card-stat">
                      <span className="card-stat-icon">📅</span>
                      {expert.totalBookings || 0} bookings
                    </span>
                  </div>

                  <Link to={`/expert/${expert._id}`} className="card-link">
                    View Profile & Book Session
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </button>
                <span className="pagination-info">Page {page} of {totalPages}</span>
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExpertList;