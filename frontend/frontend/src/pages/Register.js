import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    password: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p>Join thousands of users finding their perfect expert</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            type="email" 
            placeholder="Email address"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="tel" 
            placeholder="Phone Number (10 digits)"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            maxLength="10"
            required
          />
          <input 
            type="password" 
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            minLength="6"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;