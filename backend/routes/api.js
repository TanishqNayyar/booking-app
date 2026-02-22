const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

// AUTH
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authController.getMe);

// EXPERTS
router.get('/experts', expertController.getExperts);
router.get('/experts/:id', expertController.getExpertById);
router.get('/experts/categories', expertController.getCategories);

// BOOKINGS
router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getBookings);
router.get('/bookings/slots', bookingController.getBookedSlots);
router.patch('/bookings/:id/cancel', bookingController.cancelBooking);

// ADMIN
router.get('/admin/dashboard', adminController.getDashboardStats);
router.get('/admin/bookings', adminController.getAllBookings);
router.patch('/admin/bookings/:id/status', adminController.updateBookingStatus);
router.post('/admin/experts', adminController.addExpert);
router.delete('/admin/experts/:id', adminController.deleteExpert);

module.exports = router;