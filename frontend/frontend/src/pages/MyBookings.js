import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchBookings } from '../api';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email');
  
  const [bookings, setBookings] = useState([]);
  const [emailInput, setEmailInput] = useState(emailParam || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailParam) {
      loadBookings(emailParam);
    }
  }, [emailParam]);

  const loadBookings = async (userEmail) => {
    if (!userEmail) return;
    
    setLoading(true);
    try {
      const { data } = await fetchBookings({ email: userEmail });
      setBookings(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load bookings');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadBookings(emailInput);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="app">
      <div className="bookings-container">
        <div className="bookings-header">
          <h2>📋 My Bookings</h2>
          <form onSubmit={handleSearch} className="search-box">
            <input 
              type="email" 
              placeholder="Enter your email to view bookings"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-light)' }}>
            <p style={{ fontSize: '48px', marginBottom: '20px' }}>📭</p>
            <p>No bookings found. Enter your email above or book a session.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-info">
                  <h4>{booking.expert?.name || 'Expert'}</h4>
                  <p>{booking.expert?.category || 'Consultation'}</p>
                  {booking.notes && (
                    <p style={{ fontSize: '12px', marginTop: '5px', color: 'var(--gray)' }}>
                      📝 {booking.notes}
                    </p>
                  )}
                </div>
                
                <div className="booking-date">
                  <div className="date">{booking.date}</div>
                  <div className="time">⏰ {booking.slot}</div>
                </div>
                
                <span className={`booking-status ${getStatusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;