const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const notificationController = require('../controllers/notification');

// Authentication middleware required for all routes
router.use(protect);

// Get all notifications for the current user
router.get('/', notificationController.getNotifications);

// Count unread notifications
router.get('/unread-count', notificationController.getUnreadCount);

// Mark a notification as read
router.patch('/:id/mark-read', notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

// Routes only used for development
if (process.env.NODE_ENV === 'development') {
  // Create test notification
  router.post('/test', notificationController.createTestNotification);
  
  // Create multiple test notifications
  router.post('/test-multiple', notificationController.createMultipleTestNotifications);
}

module.exports = router; 