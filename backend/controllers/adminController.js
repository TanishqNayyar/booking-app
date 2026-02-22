const Expert = require('../models/Expert');
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalExperts = await Expert.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    
    const recentBookings = await Booking.find()
      .populate('expert', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalExperts,
        totalBookings,
        totalUsers,
        pendingBookings,
        revenue: totalBookings * 100
      },
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('expert', 'name category')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('expert');
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addExpert = async (req, res) => {
  try {
    const expert = await Expert.create(req.body);
    res.status(201).json(expert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpert = async (req, res) => {
  try {
    await Expert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expert deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};