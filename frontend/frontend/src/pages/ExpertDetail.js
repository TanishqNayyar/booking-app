import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchExpertById, fetchBookings } from '../api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  // Generate time slots (e.g., 9 AM to 5 PM)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await fetchExpertById(id);
        setExpert(data);
        await fetchSlots(id, selectedDate);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    loadData();

    // Real-time: Join room and listen for updates
    socket.emit('join_expert', id);
    
    socket.on('slot_update', ({ expertId, date }) => {
      if (expertId === id && date === selectedDate) {
        fetchSlots(id, selectedDate); // Refresh slots immediately
      }
    });

    return () => socket.off('slot_update');
  }, [id]);

  const fetchSlots = async (expertId, date) => {
    // Fetch all bookings for this expert on this specific date
    // Note: In a real app, you might create a specific endpoint like /experts/:id/slots?date=...
    // Here we fetch all bookings for the expert and filter client-side for simplicity
    const { data } = await fetchBookings(null); // Fetch all (or filter by expert ID if backend supports)
    
    // Filter bookings for this specific expert and date
    const relevantBookings = data.filter(
      b => b.expert._id === expertId && b.date === date
    );
    
    setBookedSlots(relevantBookings.map(b => b.slot));
  };

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    await fetchSlots(id, newDate);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/')}>← Back</button>
      
      <div className="expert-profile">
        <h2>{expert.name}</h2>
        <p><strong>Category:</strong> {expert.category}</p>
        <p><strong>Experience:</strong> {expert.experience} years</p>
        <p><strong>Rating:</strong> {expert.rating} / 5</p>
        <p>{expert.bio}</p>
      </div>

      <div className="booking-section">
        <h3>Book a Session</h3>
        
        <label>Select Date: </label>
        <input 
          type="date" 
          value={selectedDate} 
          min={new Date().toISOString().split('T')[0]} 
          onChange={handleDateChange} 
        />

        <div className="slots-grid">
          {timeSlots.map(slot => {
            const isBooked = bookedSlots.includes(slot);
            return (
              <div 
                key={slot} 
                className={`slot ${isBooked ? 'disabled' : 'available'}`}
                onClick={() => !isBooked && navigate(`/book/${expert._id}?date=${selectedDate}&time=${slot}`)}
              >
                {slot} {isBooked ? '(Booked)' : ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExpertDetail;