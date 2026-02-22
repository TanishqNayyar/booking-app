const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { expertId, date, slot, userName, userEmail, userPhone, notes } = req.body;

    const booking = await Booking.create({
      expert: expertId,
      date,
      slot,
      userName,
      userEmail,
      userPhone,
      notes,
      status: 'Confirmed'
    });

    const io = req.app.get('io');
    io.to(`expert_${expertId}`).emit('slot_update', { expertId, date, slot });

    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'This time slot has already been booked!' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) query.userEmail = email;

    const bookings = await Booking.find(query).populate('expert').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookedSlots = async (req, res) => {
  try {
    const { expertId, date } = req.query;
    const bookings = await Booking.find({
      expert: expertId,
      date,
      status: { $in: ['Pending', 'Confirmed'] }
    });
    res.json(bookings.map(b => b.slot));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    ).populate('expert');

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};