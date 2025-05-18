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