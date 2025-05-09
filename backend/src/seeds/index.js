const mongoose = require('mongoose');
const seedUsers = require('./users');
const seedCars = require('./cars');
const seedBookings = require('./bookings');
const seedReviews = require('./reviews');
const seedNotifications = require('./notifications');
const { connectDB } = require('../db');

// Seed tất cả dữ liệu
const seedAll = async () => {
  try {
    // Kết nối đến database
    await connectDB();
    
    console.log('Connected to database. Starting seed process...');
    
    // Thực thi các hàm seed theo thứ tự
    // 1. Seed users trước để có ID user dùng cho các model khác
    await seedUsers();
    
    // 2. Seed cars
    await seedCars();
    
    // 3. Seed bookings 
    await seedBookings();
    
    // 4. Seed reviews
    await seedReviews();
    
    // 5. Seed notifications
    await seedNotifications();
    
    console.log('Seed process completed successfully');
    
    // Đóng kết nối database
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    // Đóng kết nối database ngay cả khi có lỗi
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(1);
  }
};

// Thực thi hàm seed
seedAll(); 