const Notification = require('../models/notification');
const User = require('../models/user');
const mongoose = require('mongoose');

// Get all notifications for the current user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, read, type } = req.query;
    
    // Create options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };
    
    // Add filter for read status if provided
    if (read !== undefined) {
      options.read = read === 'true';
    }
    
    // Add filter for notification type if provided
    if (type && type !== 'all') {
      options.type = type;
    }
    
    // Get notifications
    const result = await Notification.getNotificationsForUser(userId, options);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to get notifications, please try again later'
    });
  }
};

// Count unread notifications
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
      message: 'Unable to count unread notifications, please try again later'
    });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is not valid'
      });
    }
    
    // Find notification
    const notification = await Notification.findOne({
      _id: id,
      user: userId
    });
    
    // Check if notification exists
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Mark as read
    notification.read = true;
    await notification.save();
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to mark notification as read, please try again later'
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await Notification.markAllAsRead(userId);
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to mark all notifications as read, please try again later'
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is not valid'
      });
    }
    
    // Find and delete notification
    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: userId
    });
    
    // Check if notification exists
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to delete notification, please try again later'
    });
  }
};

// Create test notification (only for development)
exports.createTestNotification = async (req, res) => {
  // Only allowed in development environment
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'This feature is only available in development environment'
    });
  }
  
  try {
    const userId = req.user._id;
    const { title, message, type = 'system' } = req.body;
    
    // Check data
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and notification message are required'
      });
    }
    
    // Create new notification
    const notification = await Notification.createNotification({
      title,
      message,
      type,
      user: userId
    });
    
    res.status(201).json({
      success: true,
      message: 'Test notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to create test notification, please try again later'
    });
  }
};

// Create multiple test notifications (only for development)
exports.createMultipleTestNotifications = async (req, res) => {
  // Only allowed in development environment
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'This feature is only available in development environment'
    });
  }
  
  try {
    const userId = req.user._id;
    const { count = 5 } = req.body;
    
    // Limit the number of notifications to create
    const notificationCount = Math.min(parseInt(count), 20);
    
    const types = ['booking_new', 'booking_canceled', 'booking_completed', 'review_new', 'message_new', 'payment_received', 'system'];
    const notificationPromises = [];
    
    // Create multiple notifications
    for (let i = 0; i < notificationCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const read = Math.random() > 0.6; // 40% unread, 60% read
      
      let title, message;
      
      switch (type) {
        case 'booking_new':
          title = 'New booking request';
          message = 'A new booking request has been received from a customer.';
          break;
        case 'booking_canceled':
          title = 'Booking canceled';
          message = 'A customer has canceled the booking.';
          break;
        case 'booking_completed':
          title = 'Booking completed';
          message = 'The booking has been completed successfully.';
          break;
        case 'review_new':
          title = 'New review';
          message = 'A new review has been sent for the vehicle.';
          break;
        case 'message_new':
          title = 'New message';
          message = 'You have a new message from a customer.';
          break;
        case 'payment_received':
          title = 'Payment received';
          message = 'Payment has been received from a customer.';
          break;
        default:
          title = 'System notification';
          message = 'This is a system notification.';
      }
      
      // Create notification and add to promises array
      const notification = new Notification({
        title,
        message,
        type,
        read,
        user: userId,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Randomize within 7 days ago
      });
      
      notificationPromises.push(notification.save());
    }
    
    // Wait for all notifications to be created
    const notifications = await Promise.all(notificationPromises);
    
    res.status(201).json({
      success: true,
      message: `Created ${notifications.length} test notifications successfully`,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error creating multiple test notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to create multiple test notifications, please try again later'
    });
  }
};

// Service helper to create notifications from other code (not API endpoint)
exports.createNotificationService = async (userId, notificationData) => {
  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User does not exist');
    }
    
    // Create notification
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