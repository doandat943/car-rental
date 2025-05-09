const Notification = require('../models/notification');
const User = require('../models/user');
const mongoose = require('mongoose');

// Lấy tất cả thông báo của người dùng hiện tại
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, read, type } = req.query;
    
    // Tạo options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };
    
    // Thêm lọc theo trạng thái đã đọc nếu có
    if (read !== undefined) {
      options.read = read === 'true';
    }
    
    // Thêm lọc theo loại thông báo nếu có
    if (type && type !== 'all') {
      options.type = type;
    }
    
    // Lấy thông báo
    const result = await Notification.getNotificationsForUser(userId, options);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông báo, vui lòng thử lại sau'
    });
  }
};

// Đếm thông báo chưa đọc
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const count = await Notification.countDocuments({
      user: userId,
      read: false
    });
    
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể đếm thông báo chưa đọc, vui lòng thử lại sau'
    });
  }
};

// Đánh dấu một thông báo đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    // Kiểm tra id hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID thông báo không hợp lệ'
      });
    }
    
    // Tìm thông báo
    const notification = await Notification.findOne({
      _id: id,
      user: userId
    });
    
    // Kiểm tra thông báo tồn tại
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }
    
    // Đánh dấu đã đọc
    notification.read = true;
    await notification.save();
    
    res.status(200).json({
      success: true,
      message: 'Đã đánh dấu thông báo là đã đọc',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể đánh dấu thông báo đã đọc, vui lòng thử lại sau'
    });
  }
};

// Đánh dấu tất cả thông báo đã đọc
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await Notification.markAllAsRead(userId);
    
    res.status(200).json({
      success: true,
      message: 'Đã đánh dấu tất cả thông báo là đã đọc',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể đánh dấu tất cả thông báo đã đọc, vui lòng thử lại sau'
    });
  }
};

// Xóa một thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    // Kiểm tra id hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID thông báo không hợp lệ'
      });
    }
    
    // Tìm và xóa thông báo
    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: userId
    });
    
    // Kiểm tra thông báo tồn tại
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Đã xóa thông báo thành công',
      data: notification
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể xóa thông báo, vui lòng thử lại sau'
    });
  }
};

// Tạo thông báo kiểm thử (chỉ dùng cho phát triển)
exports.createTestNotification = async (req, res) => {
  // Chỉ cho phép trong môi trường phát triển
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Tính năng này chỉ khả dụng trong môi trường phát triển'
    });
  }
  
  try {
    const userId = req.user._id;
    const { title, message, type = 'system' } = req.body;
    
    // Kiểm tra dữ liệu
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề và nội dung thông báo là bắt buộc'
      });
    }
    
    // Tạo thông báo mới
    const notification = await Notification.createNotification({
      title,
      message,
      type,
      user: userId
    });
    
    res.status(201).json({
      success: true,
      message: 'Đã tạo thông báo kiểm thử thành công',
      data: notification
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tạo thông báo kiểm thử, vui lòng thử lại sau'
    });
  }
};

// Tạo nhiều thông báo kiểm thử (chỉ dùng cho phát triển)
exports.createMultipleTestNotifications = async (req, res) => {
  // Chỉ cho phép trong môi trường phát triển
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Tính năng này chỉ khả dụng trong môi trường phát triển'
    });
  }
  
  try {
    const userId = req.user._id;
    const { count = 5 } = req.body;
    
    // Giới hạn số lượng thông báo tạo
    const notificationCount = Math.min(parseInt(count), 20);
    
    const types = ['booking_new', 'booking_canceled', 'booking_completed', 'review_new', 'message_new', 'payment_received', 'system'];
    const notificationPromises = [];
    
    // Tạo nhiều thông báo
    for (let i = 0; i < notificationCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const read = Math.random() > 0.6; // 40% chưa đọc, 60% đã đọc
      
      let title, message;
      
      switch (type) {
        case 'booking_new':
          title = 'Yêu cầu đặt xe mới';
          message = 'Có một yêu cầu đặt xe mới từ khách hàng.';
          break;
        case 'booking_canceled':
          title = 'Đơn đặt xe đã bị hủy';
          message = 'Một khách hàng đã hủy đơn đặt xe.';
          break;
        case 'booking_completed':
          title = 'Đơn đặt xe hoàn thành';
          message = 'Một đơn đặt xe đã hoàn thành thành công.';
          break;
        case 'review_new':
          title = 'Đánh giá mới';
          message = 'Có một đánh giá mới đã được gửi cho xe.';
          break;
        case 'message_new':
          title = 'Tin nhắn mới';
          message = 'Bạn có tin nhắn mới từ khách hàng.';
          break;
        case 'payment_received':
          title = 'Thanh toán thành công';
          message = 'Đã nhận thanh toán từ khách hàng.';
          break;
        default:
          title = 'Thông báo hệ thống';
          message = 'Đây là thông báo từ hệ thống.';
      }
      
      // Tạo thông báo và thêm vào mảng promises
      const notification = new Notification({
        title,
        message,
        type,
        read,
        user: userId,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Tạo ngẫu nhiên trong 7 ngày qua
      });
      
      notificationPromises.push(notification.save());
    }
    
    // Chờ tất cả thông báo được tạo
    const notifications = await Promise.all(notificationPromises);
    
    res.status(201).json({
      success: true,
      message: `Đã tạo ${notifications.length} thông báo kiểm thử thành công`,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error creating multiple test notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tạo nhiều thông báo kiểm thử, vui lòng thử lại sau'
    });
  }
};

// Service helper để tạo thông báo từ code khác (không phải API endpoint)
exports.createNotificationService = async (userId, notificationData) => {
  try {
    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User không tồn tại');
    }
    
    // Tạo thông báo
    const notification = await Notification.createNotification({
      ...notificationData,
      user: userId
    });
    
    return notification;
  } catch (error) {
    console.error('Error in notification service:', error);
    throw error;
  }
}; 