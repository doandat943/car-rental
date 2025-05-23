const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const userController = require('../controllers/user');

// Public routes
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

// Password reset routes (public)
router.post('/reset-password', userController.requestPasswordReset);
router.put('/reset-password/:token', userController.resetPassword);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), userController.createUser);
router.put('/:id', protect, authorize('admin'), userController.updateUser);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);
router.patch('/:id/status', protect, authorize('admin'), userController.updateUserStatus);
router.patch('/:id/role', protect, authorize('admin'), userController.updateUserRole);

module.exports = router; 