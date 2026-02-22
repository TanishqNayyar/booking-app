const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  slot: { type: String, required: true }, // Format: HH:MM
  notes: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed'], 
    default: 'Confirmed' // Auto-confirm for demo 
  },
  createdAt: { type: Date, default: Date.now }
});

// Index to prevent double booking efficiently
BookingSchema.index({ expert: 1, date: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);