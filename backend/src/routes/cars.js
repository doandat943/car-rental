const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const carController = require('../controllers/car');
const reviewController = require('../controllers/review');

// Public routes
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);

// Protected routes - Admin only
router.post('/', protect, authorize('admin'), carController.createCar);
router.put('/:id', protect, authorize('admin'), carController.updateCar);
router.delete('/:id', protect, authorize('admin'), carController.deleteCar);

// Add these routes for car reviews
router.get('/:carId/reviews', reviewController.getCarReviews);
router.post('/:carId/reviews', protect, reviewController.createReview);

module.exports = router; 