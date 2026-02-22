import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  return (
    <div className="app">
      <div className="bg-animation"></div>
      
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">E</div>
          <span className="navbar-title">ExpertHub</span>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Browse Experts</Link>
          {user && <Link to="/my-bookings" className="navbar-link">My Bookings</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="navbar-link">Admin Panel</Link>}
          
          <div className="navbar-user">
            {user ? (
              <>
                <div className="user-avatar">{getInitials(user.name)}</div>
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn btn-sm btn-secondary">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">Sign In</Link>
            )}
          </div>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<ExpertList />} />
        <Route path="/expert/:id" element={<ExpertDetail />} />
        <Route path="/book/:expertId" element={user ? <BookingForm /> : <Navigate to="/login" />} />
        <Route path="/my-bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
      
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;