import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { createBooking } from '../api';
import { toast } from 'react-toastify';

const BookingForm = () => {
  const { expertId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Pre-fill if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData({
        userName: user.name || '',
        userEmail: user.email || '',
        userPhone: user.phone || '',
        notes: ''
      });
    }
  }, []);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!formData.userName.trim()) return 'Name is required';
    if (!formData.userEmail.trim()) return 'Email is required';
    if (!emailRegex.test(formData.userEmail)) return 'Invalid email format';
    if (!formData.userPhone.trim()) return 'Phone is required';
    if (!phoneRegex.test(formData.userPhone)) return 'Phone must be 10 digits';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await createBooking({
        expertId,
        date,
        slot: time,
        ...formData
      });
      setSuccess(true);
      toast.success('Booking confirmed successfully!');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="app">
        <div className="booking-form">
          <div className="success-msg">
            <div className="success-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p>Your session has been booked successfully. Check your email for confirmation details.</p>
            <p style={{ color: 'var(--primary-light)' }}>Redirecting to My Bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="booking-form">
        <h2>Complete Your Booking</h2>
        
        <div className="selected-slot-info">
          <p>Session Details</p>
          <strong>📅 {date} at ⏰ {time}</strong>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              placeholder="Enter your full name"
              value={formData.userName}
              onChange={e => setFormData({...formData, userName: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                value={formData.userEmail}
                onChange={e => setFormData({...formData, userEmail: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                placeholder="10-digit phone number"
                value={formData.userPhone}
                onChange={e => setFormData({...formData, userPhone: e.target.value})}
                maxLength="10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea 
              placeholder="Any specific topics or questions you'd like to discuss..."
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;