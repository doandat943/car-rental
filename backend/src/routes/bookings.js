const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const bookingController = require('../controllers/booking');

// Protected routes - Authenticated users
router.get('/', protect, bookingController.getBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.post('/', protect, bookingController.createBooking);
router.patch('/:id/status', protect, bookingController.updateBookingStatus);

// Protected routes - Admin only
router.delete('/:id', protect, authorize('admin'), bookingController.deleteBooking);

module.exports = router; 