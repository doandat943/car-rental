const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const userController = require('../controllers/user');

// Public routes
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), userController.createUser);
router.put('/:id', protect, authorize('admin'), userController.updateUser);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

module.exports = router; 