const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// Tạm thời sử dụng controller giả để tránh lỗi
const tempController = (req, res) => {
  res.status(200).json({ message: 'This endpoint is under development' });
};

// Public routes
router.get('/', tempController);
router.get('/:id', tempController);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), tempController);
router.put('/:id', protect, authorize('admin'), tempController);
router.delete('/:id', protect, authorize('admin'), tempController);

module.exports = router; 