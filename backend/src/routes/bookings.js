const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Protected routes - Authenticated users
router.get('/', authenticate, bookingController.getBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.post('/', authenticate, bookingController.createBooking);
router.patch('/:id/status', authenticate, bookingController.updateBookingStatus);

// Protected routes - Admin only
router.delete('/:id', authenticate, isAdmin, bookingController.deleteBooking);

module.exports = router; 