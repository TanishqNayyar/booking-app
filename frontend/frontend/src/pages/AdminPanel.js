import React, { useState, useEffect } from 'react';
import { getDashboardStats, getAllBookings, updateBookingStatus, addExpert, deleteExpert } from '../api';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpert, setShowAddExpert] = useState(false);
  const [expertForm, setExpertForm] = useState({ 
    name: '', 
    category: '', 
    experience: '', 
    rating: '', 
    bio: '' 
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await getDashboardStats();
      setStats(data.stats);
      setBookings(data.recentBookings);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success('Status updated');
      loadDashboard();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddExpert = async (e) => {
    e.preventDefault();
    try {
      await addExpert({
        ...expertForm,
        experience: parseInt(expertForm.experience),
        rating: parseFloat(expertForm.rating)
      });
      toast.success('Expert added successfully');
      setShowAddExpert(false);
      setExpertForm({ name: '', category: '', experience: '', rating: '', bio: '' });
    } catch (error) {
      toast.error('Failed to add expert');
    }
  };

  const handleDeleteExpert = async (id) => {
    if (window.confirm('Are you sure you want to delete this expert?')) {
      try {
        await deleteExpert(id);
        toast.success('Expert deleted');
        loadDashboard();
      } catch (error) {
        toast.error('Failed to delete expert');
      }
    }
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="admin-container">
        <div className="admin-header">
          <h1>⚙️ Admin Dashboard</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddExpert(!showAddExpert)}
          >
            {showAddExpert ? '✖ Cancel' : '+ Add Expert'}
          </button>
        </div>

        {showAddExpert && (
          <div className="booking-form" style={{ marginBottom: '40px' }}>
            <h3>Add New Expert</h3>
            <form onSubmit={handleAddExpert}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    value={expertForm.name}
                    onChange={e => setExpertForm({...expertForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={expertForm.category}
                    onChange={e => setExpertForm({...expertForm, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Health">Health</option>
                    <option value="Tech">Tech</option>
                    <option value="Finance">Finance</option>
                    <option value="Legal">Legal</option>
                    <option value="Education">Education</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input 
                    type="number" 
                    value={expertForm.experience}
                    onChange={e => setExpertForm({...expertForm, experience: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    max="5"
                    value={expertForm.rating}
                    onChange={e => setExpertForm({...expertForm, rating: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea 
                  value={expertForm.bio}
                  onChange={e => setExpertForm({...expertForm, bio: e.target.value})}
                  placeholder="Brief description about the expert"
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Expert</button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat">
            <h3>{stats?.totalExperts || 0}</h3>
            <p>Total Experts</p>
          </div>
          <div className="admin-stat">
            <h3>{stats?.totalBookings || 0}</h3>
            <p>Total Bookings</p>
          </div>
          <div className="admin-stat">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
          <div className="admin-stat">
            <h3>{stats?.pendingBookings || 0}</h3>
            <p>Pending</p>
          </div>
          <div className="admin-stat">
            <h3>${stats?.revenue || 0}</h3>
            <p>Revenue</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="admin-table">
          <h3 style={{ padding: '25px', paddingBottom: '0' }}>📋 Recent Bookings</h3>
          <table>
            <thead>
              <tr>
                <th>Expert</th>
                <th>Client</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.expert?.name || 'N/A'}</td>
                  <td>{booking.userName}</td>
                  <td>{booking.date}</td>
                  <td>{booking.slot}</td>
                  <td>
                    <span className={`booking-status ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={booking.status}
                      onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid var(--glass-border)'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;