const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const { protect, authorize } = require('../middlewares/auth');

// All dashboard routes require authentication and admin rights
router.use(protect);
router.use(authorize('admin', 'superadmin'));

// Get dashboard overview stats
router.get('/stats', dashboardController.getStats);

// Get detailed statistics for statistics page
router.get('/statistics', dashboardController.getStatistics);

// Get booking statistics
router.get('/bookings', dashboardController.getBookingsStats);

// Get revenue statistics
router.get('/revenue', dashboardController.getRevenueStats);

// Get top cars (most booked)
router.get('/top-cars', dashboardController.getTopCars);

// Get cars by status
router.get('/cars-by-status', dashboardController.getCarsByStatus);

module.exports = router; 