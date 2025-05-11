const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// Temporary controller to avoid errors
const tempController = (req, res) => {
  res.status(200).json({ message: 'This endpoint is under development' });
};

// Public routes
router.get('/info', tempController);
router.get('/contact', tempController);
router.post('/contact', tempController);

// Protected routes (admin only)
router.put('/info', protect, authorize('admin'), tempController);

module.exports = router; 