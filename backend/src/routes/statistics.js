const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics');
const { protect, authorize } = require('../middleware/auth');

// Lấy dữ liệu thống kê tổng quan
router.get('/', protect, authorize('admin'), statisticsController.getStatistics);

// Lấy danh sách đơn đặt xe gần đây
router.get('/recent-bookings', protect, authorize('admin'), statisticsController.getRecentBookings);

// Lấy danh sách xe được đặt nhiều nhất
router.get('/top-cars', protect, authorize('admin'), statisticsController.getTopCars);

module.exports = router; 