const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow system notifications that don't belong to a specific user
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['booking', 'system', 'user', 'payment'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index to speed up queries
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ createdAt: -1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  return this.save();
};

// Create new notification
notificationSchema.statics.createNotification = async function(data) {
  try {
    const notification = new this(data);
    return notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get all notifications for a user
notificationSchema.statics.getNotificationsForUser = async function(userId, options = {}) {
  const { page = 1, limit = 10, read, type } = options;
  
  const query = { user: userId };
  
  // Add filter conditions if available
  if (read !== undefined) {
    query.read = read;
  }
  
  if (type) {
    query.type = type;
  }
  
  // Calculate skip count
  const skip = (page - 1) * limit;
  
  try {
    // Count total notifications
    const total = await this.countDocuments(query);
    
    // Get notifications with pagination
    const notifications = await this.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);
    
    return {
      data: notifications,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

// Mark all notifications of a user as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  try {
    const result = await this.updateMany(
      { user: userId, read: false },
      { $set: { read: true } }
    );
    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = Notification; 