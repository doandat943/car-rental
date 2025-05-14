const mongoose = require('mongoose');
const { connectDB } = require('../db');

// Import all seed modules with error handling
let seedUsers, seedCars, seedBookings, seedReviews, seedNotifications, seedSettings, seedStatistics;

try {
  seedUsers = require('./users');
} catch (error) {
  console.warn('Users seed module not found:', error.message);
  seedUsers = async () => {
    console.log('Skipping users seed (module not available)');
  };
}

try {
  seedCars = require('./cars');
} catch (error) {
  console.warn('Cars seed module not found:', error.message);
  seedCars = async () => {
    console.log('Skipping cars seed (module not available)');
  };
}

try {
  seedBookings = require('./bookings');
} catch (error) {
  console.warn('Bookings seed module not found:', error.message);
  seedBookings = async () => {
    console.log('Skipping bookings seed (module not available)');
  };
}

try {
  seedReviews = require('./reviews');
} catch (error) {
  console.warn('Reviews seed module not found:', error.message);
  seedReviews = async () => {
    console.log('Skipping reviews seed (module not available)');
  };
}

try {
  seedNotifications = require('./notifications');
} catch (error) {
  console.warn('Notifications seed module not found:', error.message);
  seedNotifications = async () => {
    console.log('Skipping notifications seed (module not available)');
  };
}

try {
  seedSettings = require('./settings');
} catch (error) {
  console.warn('Settings seed module not found:', error.message);
  seedSettings = async () => {
    console.log('Skipping settings seed (module not available)');
  };
}

try {
  seedStatistics = require('./statistics');
} catch (error) {
  console.warn('Statistics seed module not found:', error.message);
  seedStatistics = async () => {
    console.log('Skipping statistics seed (module not available)');
  };
}

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
    
    // 6. Seed settings
    await seedSettings();
    
    // 7. Seed statistics (should run last to get accurate counts)
    await seedStatistics();
    
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