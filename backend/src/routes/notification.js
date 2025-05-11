const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const notificationController = require('../controllers/notification');

// Middleware bắt buộc xác thực cho tất cả routes
router.use(protect);

// Lấy tất cả thông báo của người dùng hiện tại
router.get('/', notificationController.getNotifications);

// Count unread notifications
router.get('/unread-count', notificationController.getUnreadCount);

// Đánh dấu một thông báo đã đọc
router.patch('/:id/mark-read', notificationController.markAsRead);

// Đánh dấu tất cả thông báo đã đọc
router.patch('/mark-all-read', notificationController.markAllAsRead);

// Xóa một thông báo
router.delete('/:id', notificationController.deleteNotification);

// Route chỉ dùng cho phát triển
if (process.env.NODE_ENV === 'development') {
  // Tạo thông báo kiểm thử
  router.post('/test', notificationController.createTestNotification);
  
  // Tạo nhiều thông báo kiểm thử
  router.post('/test-multiple', notificationController.createMultipleTestNotifications);
}

module.exports = router; 