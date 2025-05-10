const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Cho phép thông báo hệ thống không thuộc về user cụ thể
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

// Tạo index để tăng tốc truy vấn
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ createdAt: -1 });

// Method để đánh dấu thông báo đã đọc
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  return this.save();
};

// Tạo thông báo mới
notificationSchema.statics.createNotification = async function(notificationData) {
  try {
    const notification = new this(notificationData);
    return notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Lấy tất cả thông báo của một người dùng
notificationSchema.statics.getNotificationsForUser = async function(userId, options = {}) {
  const { page = 1, limit = 10, read, type } = options;
  
  const query = { user: userId };
  
  // Thêm điều kiện lọc nếu có
  if (read !== undefined) {
    query.read = read;
  }
  
  if (type) {
    query.type = type;
  }
  
  // Tính số lượng bỏ qua
  const skip = (page - 1) * limit;
  
  try {
    // Đếm tổng số thông báo
    const total = await this.countDocuments(query);
    
    // Lấy thông báo với phân trang
    const notifications = await this.find(query)
      .sort({ createdAt: -1 }) // Mới nhất lên đầu
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

// Đánh dấu tất cả thông báo của một người dùng là đã đọc
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

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 