const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics');
const { protect, authorize } = require('../middlewares/auth');

// Get overview statistics
router.get('/', protect, authorize('admin'), statisticsController.getStatistics);

// Get recent bookings
router.get('/recent-bookings', protect, authorize('admin'), statisticsController.getRecentBookings);

// Get most booked cars
router.get('/top-cars', protect, authorize('admin'), statisticsController.getTopCars);

module.exports = router; 