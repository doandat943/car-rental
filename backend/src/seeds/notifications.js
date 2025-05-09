const mongoose = require('mongoose');
const User = require('../models/user');
const Notification = require('../models/notification');

// Tạo dữ liệu mẫu cho thông báo
const seedNotifications = async () => {
  try {
    // Kiểm tra đã có thông báo trong cơ sở dữ liệu chưa
    const count = await Notification.countDocuments();
    if (count > 0) {
      console.log('Notifications already seeded');
      return;
    }

    // Lấy tất cả user admin để tạo thông báo cho họ
    const adminUsers = await User.find({ role: 'admin' });
    
    if (adminUsers.length === 0) {
      console.log('No admin users found. Cannot seed notifications');
      return;
    }

    // Danh sách loại thông báo
    const types = [
      'booking_new',
      'booking_canceled',
      'booking_completed',
      'review_new',
      'message_new',
      'payment_received',
      'system'
    ];

    // Tạo thông báo cho mỗi admin
    const notificationsToCreate = [];

    for (const user of adminUsers) {
      // Tạo khoảng 15-20 thông báo cho mỗi user
      const notificationCount = Math.floor(Math.random() * 6) + 15;
      
      for (let i = 0; i < notificationCount; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const read = Math.random() > 0.3; // 30% chưa đọc, 70% đã đọc
        // Tạo ngẫu nhiên trong 7 ngày qua
        const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
        
        let title, message;
        
        switch (type) {
          case 'booking_new':
            title = 'Yêu cầu đặt xe mới';
            message = `Khách hàng ${getRandomName()} vừa yêu cầu đặt xe ${getRandomCar()}.`;
            break;
          case 'booking_canceled':
            title = 'Đơn đặt xe đã bị hủy';
            message = `Khách hàng ${getRandomName()} đã hủy đơn đặt xe ${getRandomCar()}.`;
            break;
          case 'booking_completed':
            title = 'Đơn đặt xe hoàn thành';
            message = `Đơn đặt xe ${getRandomCar()} của khách hàng ${getRandomName()} đã hoàn thành.`;
            break;
          case 'review_new':
            title = 'Đánh giá mới';
            message = `Có một đánh giá ${Math.floor(Math.random() * 3) + 3} sao mới đã được gửi cho xe ${getRandomCar()}.`;
            break;
          case 'message_new':
            title = 'Tin nhắn mới';
            message = `Bạn có tin nhắn mới từ khách hàng ${getRandomName()}.`;
            break;
          case 'payment_received':
            title = 'Thanh toán thành công';
            message = `Đã nhận thanh toán ${Math.floor(Math.random() * 300) + 100}$ từ khách hàng ${getRandomName()}.`;
            break;
          default:
            title = 'Thông báo hệ thống';
            message = 'Chào mừng bạn đến với hệ thống quản lý cho thuê xe.';
        }
        
        notificationsToCreate.push({
          title,
          message,
          type,
          read,
          user: user._id,
          createdAt
        });
      }
    }

    // Tạo thông báo trong cơ sở dữ liệu
    await Notification.insertMany(notificationsToCreate);
    
    console.log(`${notificationsToCreate.length} notifications seeded successfully`);
  } catch (error) {
    console.error('Error seeding notifications:', error);
  }
};

// Hàm random tên khách hàng
function getRandomName() {
  const names = [
    'John Doe',
    'Jane Smith',
    'Michael Johnson',
    'Emily Williams',
    'David Brown',
    'Sarah Davis',
    'Robert Miller',
    'Jessica Wilson',
    'Thomas Moore',
    'Jennifer Taylor'
  ];
  
  return names[Math.floor(Math.random() * names.length)];
}

// Hàm random tên xe
function getRandomCar() {
  const cars = [
    'Toyota Camry',
    'Honda Civic',
    'Tesla Model 3',
    'BMW X5',
    'Mercedes-Benz C-Class',
    'Audi A4',
    'Ford Mustang',
    'Chevrolet Corvette',
    'Nissan Altima',
    'Hyundai Sonata'
  ];
  
  return cars[Math.floor(Math.random() * cars.length)];
}

module.exports = seedNotifications; 