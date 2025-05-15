const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const reviewController = require('../controllers/review');

// Primary reviews routes
router.get('/', protect, authorize('admin'), reviewController.getReviews);
router.patch('/:id/status', protect, authorize('admin'), reviewController.updateReviewStatus);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router; 