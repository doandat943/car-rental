const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental';

// Import models
const Car = require('./models/car');
const Category = require('./models/category');
const User = require('./models/user');
const Booking = require('./models/booking');
const Review = require('./models/review');
const Setting = require('./models/setting');
const Statistic = require('./models/statistic');
const Notification = require('./models/notification');

// Import utility functions
let uploadHelper;
try {
  uploadHelper = require('./utils/upload-helper');
} catch (error) {
  console.warn('Upload helper not found, asset copying will be limited:', error.message);
  // Create minimal implementations if the module is not found
  uploadHelper = {
    ensureUploadDir: (type) => {
      const dir = path.join(__dirname, 'public/uploads', type);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      return dir;
    },
    createPlaceholderFile: (type, filename, content) => {
      const dir = path.join(__dirname, 'public/uploads', type);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, filename);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
      }
      return `/uploads/${type}/${filename}`;
    }
  };
}

// Dữ liệu mẫu cho Categories (mở rộng từ dữ liệu mô phỏng)
const categories = [
  {
    name: 'Sedan',
    description: 'Xe sedan 4 cửa tiện nghi cho gia đình',
    image: '/uploads/categories/sedan.jpg'
  },
  {
    name: 'SUV',
    description: 'Xe gầm cao đa dụng cho mọi địa hình',
    image: '/uploads/categories/suv.jpg'
  },
  {
    name: 'Sports Car',
    description: 'Xe thể thao tốc độ cao',
    image: '/uploads/categories/sports.jpg'
  },
  {
    name: 'Electric',
    description: 'Xe điện thân thiện với môi trường',
    image: '/uploads/categories/electric.jpg'
  },
  {
    name: 'Luxury',
    description: 'Xe sang trọng đẳng cấp',
    image: '/uploads/categories/luxury.jpg'
  },
  {
    name: 'Compact',
    description: 'Xe nhỏ gọn, tiết kiệm nhiên liệu',
    image: '/uploads/categories/compact.jpg'
  }
];

// Dữ liệu mẫu cho Cars (kết hợp từ dữ liệu mô phỏng)
const cars = [
  {
    name: 'Toyota Camry',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    description: 'Sedan hạng D sang trọng và tiết kiệm nhiên liệu',
    price: {
      daily: 85,
      weekly: 500,
      monthly: 1800
    },
    specifications: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      engineCapacity: '2.5L'
    },
    features: [
      'Bluetooth',
      'Backup Camera',
      'Navigation',
      'Cruise Control',
      'Keyless Entry'
    ],
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb', '/uploads/cars/toyota-camry-1.jpg'],
    availability: true,
    rating: 4.3,
    reviewCount: 19,
    categoryName: 'Sedan'
  },
  {
    name: 'Honda Civic',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    description: 'Sedan hạng C thể thao và tiết kiệm',
    price: {
      daily: 75,
      weekly: 450,
      monthly: 1600
    },
    specifications: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      engineCapacity: '1.5L'
    },
    features: [
      'Bluetooth',
      'Backup Camera',
      'Apple CarPlay',
      'Android Auto',
      'Lane Keeping Assist'
    ],
    images: ['https://images.unsplash.com/photo-1590347607479-9d7c3a26e5e9', '/uploads/cars/honda-civic-1.jpg'],
    availability: true,
    rating: 4.5,
    reviewCount: 15,
    categoryName: 'Compact'
  },
  {
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    description: 'Xe điện hiệu suất cao với công nghệ tự lái',
    price: {
      daily: 120,
      weekly: 720,
      monthly: 2600
    },
    specifications: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Electric',
      engineCapacity: 'Electric Motor'
    },
    features: [
      'Autopilot',
      'Premium Sound System',
      'Glass Roof',
      'Supercharging',
      'Over-the-air Updates',
      'Heated Seats'
    ],
    images: ['https://images.unsplash.com/photo-1561580125-028ee3bd62eb', '/uploads/cars/tesla-model3-1.jpg'],
    availability: true,
    rating: 4.8,
    reviewCount: 28,
    categoryName: 'Electric'
  },
  {
    name: 'BMW X5',
    brand: 'BMW',
    model: 'X5',
    year: 2023,
    description: 'SUV hạng sang với hiệu suất vượt trội',
    price: {
      daily: 175,
      weekly: 1050,
      monthly: 3800
    },
    specifications: {
      seats: 7,
      doors: 5,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      engineCapacity: '3.0L'
    },
    features: [
      'Panoramic Sunroof',
      'Leather Seats',
      'Wireless Charging',
      'Harman Kardon Sound',
      'Gesture Control',
      'Navigation',
      'Panoramic Roof'
    ],
    images: ['https://images.unsplash.com/photo-1556189250-72ba954cfc2b', '/uploads/cars/bmw-x5-1.jpg'],
    availability: true,
    rating: 4.6,
    reviewCount: 22,
    categoryName: 'SUV'
  },
  {
    name: 'Ford Mustang',
    brand: 'Ford',
    model: 'Mustang GT',
    year: 2023,
    description: 'Xe thể thao biểu tượng của Mỹ',
    price: {
      daily: 150,
      weekly: 900,
      monthly: 3200
    },
    specifications: {
      seats: 4,
      doors: 2,
      transmission: 'Manual',
      fuelType: 'Gasoline',
      engineCapacity: '5.0L V8'
    },
    features: [
      'V8 Engine',
      'Performance Exhaust',
      'Track Mode',
      'Leather Seats',
      'Launch Control'
    ],
    images: ['/uploads/cars/ford-mustang-1.jpg', '/uploads/cars/ford-mustang-2.jpg'],
    availability: true,
    rating: 4.5,
    reviewCount: 12,
    categoryName: 'Sports Car'
  },
  {
    name: 'Mercedes C-Class',
    brand: 'Mercedes-Benz',
    model: 'C300',
    year: 2022,
    description: 'Sedan hạng sang với nội thất và công nghệ đẳng cấp',
    price: {
      daily: 150,
      weekly: 900,
      monthly: 3500
    },
    specifications: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      engineCapacity: '2.0L'
    },
    features: [
      'Leather Seats',
      'Heated Seats',
      'Premium Sound',
      'MBUX Infotainment',
      'LED Headlights',
      'Ambient Lighting'
    ],
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'],
    availability: true,
    rating: 4.7,
    reviewCount: 17,
    categoryName: 'Luxury'
  },
  {
    name: 'Audi A4',
    brand: 'Audi',
    model: 'A4',
    year: 2022,
    description: 'Sedan hạng sang với thiết kế tinh tế và công nghệ hiện đại',
    price: {
      daily: 145,
      weekly: 870,
      monthly: 3400
    },
    specifications: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      engineCapacity: '2.0L'
    },
    features: [
      'Quattro AWD',
      'Virtual Cockpit',
      'Bang & Olufsen Sound',
      'Leather Interior',
      'MMI Touch Interface'
    ],
    images: ['https://images.unsplash.com/photo-1581650107963-3e8c1f48241b'],
    availability: true,
    rating: 4.6,
    reviewCount: 14,
    categoryName: 'Luxury'
  }
];

// Dữ liệu mẫu cho Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '0901234567',
    password: 'admin123', // Sẽ được hash bởi middleware
    role: 'admin',
    avatar: '/uploads/users/admin.jpg'
  },
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '0912345678',
    password: 'password123',
    role: 'user',
    avatar: '/uploads/users/john.jpg'
  },
  {
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    phone: '0923456789',
    password: 'password456',
    role: 'user',
    avatar: '/uploads/users/jane.jpg'
  },
  {
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '0934567890',
    password: 'password789',
    role: 'user',
    status: 'inactive',
    avatar: '/uploads/users/robert.jpg'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '0945678901',
    password: 'emilypwd',
    role: 'user',
    avatar: '/uploads/users/emily.jpg'
  },
  {
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    phone: '0956789012',
    password: 'michaelpwd',
    role: 'user',
    avatar: '/uploads/users/michael.jpg'
  }
];

// Dữ liệu mẫu cho đánh giá
const reviewsData = [
  {
    user: 'John Smith',
    car: 'Tesla Model 3',
    rating: 5,
    comment: 'Amazing car, very smooth drive!',
    createdAt: '2023-05-03'
  },
  {
    user: 'Jane Cooper',
    car: 'BMW X5',
    rating: 4,
    comment: 'Great SUV, lots of space but high fuel consumption',
    createdAt: '2023-04-30'
  },
  {
    user: 'Robert Johnson',
    car: 'Mercedes C-Class',
    rating: 5,
    comment: 'Luxury at its finest, worth every penny',
    createdAt: '2023-04-26'
  },
  {
    user: 'Emily Davis',
    car: 'Toyota Camry',
    rating: 4,
    comment: 'Reliable and comfortable, great for family trips',
    createdAt: '2023-05-05'
  },
  {
    user: 'Michael Wilson',
    car: 'Honda Civic',
    rating: 4,
    comment: 'Fuel efficient and easy to drive',
    createdAt: '2023-05-04'
  }
];

// Dữ liệu mẫu cho đặt xe
const bookingsData = [
  {
    user: 'John Smith',
    car: 'Tesla Model 3',
    status: 'confirmed',
    startDate: '2023-05-01',
    endDate: '2023-05-03',
    totalAmount: 360,
    createdAt: '2023-04-28'
  },
  {
    user: 'Jane Cooper',
    car: 'BMW X5',
    status: 'completed',
    startDate: '2023-04-28',
    endDate: '2023-04-30',
    totalAmount: 525,
    createdAt: '2023-04-26'
  },
  {
    user: 'Robert Johnson',
    car: 'Mercedes C-Class',
    status: 'cancelled',
    startDate: '2023-04-25',
    endDate: '2023-04-26',
    totalAmount: 150,
    createdAt: '2023-04-23'
  },
  {
    user: 'Emily Davis',
    car: 'Toyota Camry',
    status: 'pending',
    startDate: '2023-05-03',
    endDate: '2023-05-05',
    totalAmount: 170,
    createdAt: '2023-05-01'
  },
  {
    user: 'Michael Wilson',
    car: 'Audi A4',
    status: 'confirmed',
    startDate: '2023-05-02',
    endDate: '2023-05-04',
    totalAmount: 435,
    createdAt: '2023-04-30'
  }
];

// Dữ liệu mẫu cho cài đặt hệ thống
const settingsData = {
  siteName: 'Car Rental Service',
  contactEmail: 'support@carrental.example.com',
  contactPhone: '+1 (555) 123-4567',
  address: '123 Rental Street, City, Country',
  currencySymbol: '$',
  taxRate: 10,
  bookingFee: 5,
  maintenanceFee: 25,
  depositPercentage: 15,
  minimumBookingHours: 4,
  maximumBookingDays: 30,
  cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
  termsAndConditions: 'Standard terms and conditions for vehicle rental',
  privacyPolicy: 'Privacy policy for user data and booking information',
};

// Hàm để hash password trước khi lưu vào database
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Thực hiện seeding tất cả các dữ liệu
async function seedDatabase() {
  try {
    // Kiểm tra kết nối tới database
    if (mongoose.connection.readyState !== 1) {
      console.log('Please connect to MongoDB first');
      return;
    }
    
    // Xóa toàn bộ dữ liệu cũ
    await Promise.all([
      Category.deleteMany({}),
      Car.deleteMany({}),
      User.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Setting.deleteMany({}),
      Statistic.deleteMany({}),
      Notification.deleteMany({})
    ]);

    // Thêm categories mới
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories added`);

    // Map category ID vào car data
    const carData = cars.map(car => {
      const categoryName = car.categoryName || (car.name.includes('Sedan') ? 'Sedan' : 
                           car.name.includes('SUV') ? 'SUV' : 
                           car.name.includes('Tesla') ? 'Electric' : 
                           car.name.includes('Mustang') ? 'Sports Car' : 'Luxury');
      
      const category = createdCategories.find(c => c.name === categoryName);
      
      return {
        ...car,
        category: category._id
      };
    });

    // Thêm cars mới
    const createdCars = await Car.insertMany(carData);
    console.log(`${createdCars.length} cars added`);

    // Tạo user
    const createdUsers = await createUsers();
    console.log(`${createdUsers.length} users added`);
    
    // Tạo bookings
    const createdBookings = await createBookings(createdUsers, createdCars);
    console.log(`${createdBookings.length} bookings added`);
    
    // Tạo reviews
    const createdReviews = await createReviews(createdUsers, createdCars);
    console.log(`${createdReviews.length} reviews added`);
    
    // Tạo settings
    const createdSettings = await createSettings();
    console.log('System settings added');

    // Copy assets from frontend to backend
    await copyPublicAssets();

    // Tạo thống kê
    await createStatistics();
    
    // Tạo thông báo
    await createNotifications(createdUsers);

    // Đóng kết nối
    await mongoose.connection.close();
    
    console.log('Database seeded successfully');
    
    return {
      categories: createdCategories,
      cars: createdCars,
      users: createdUsers,
      bookings: createdBookings,
      reviews: createdReviews,
      settings: createdSettings
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.connection.close();
    throw error;
  }
}

// Tạo users
async function createUsers() {
  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await hashPassword(user.password);
      return {
        ...user,
        password: hashedPassword,
      };
    })
  );

  const createdUsers = await User.insertMany(hashedUsers);
  return createdUsers;
}

// Tạo bookings
async function createBookings(users, cars) {
  const bookings = await Promise.all(
    bookingsData.map(async (booking) => {
      const user = users.find(u => u.name === booking.user);
      const car = cars.find(c => c.name === booking.car);
      
      if (!user || !car) return null;
      
      return {
        user: user._id,
        car: car._id,
        status: booking.status,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
        totalAmount: booking.totalAmount,
        createdAt: new Date(booking.createdAt)
      };
    })
  );

  const validBookings = bookings.filter(b => b !== null);
  const createdBookings = await Booking.insertMany(validBookings);
  return createdBookings;
}

// Tạo reviews
async function createReviews(users, cars) {
  const reviews = await Promise.all(
    reviewsData.map(async (review) => {
      const user = users.find(u => u.name === review.user);
      const car = cars.find(c => c.name === review.car);
      
      if (!user || !car) return null;
      
      return {
        user: user._id,
        car: car._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: new Date(review.createdAt)
      };
    })
  );

  const validReviews = reviews.filter(r => r !== null);
  const createdReviews = await Review.insertMany(validReviews);
  return createdReviews;
}

// Tạo settings
async function createSettings() {
  const createdSettings = await Setting.create(settingsData);
  return createdSettings;
}

// Copy assets from frontend to backend
const copyPublicAssets = async () => {
  try {
    console.log('Setting up asset directories and placeholder files...');
    
    // Create sample image content for categories
    const categoryImages = {
      'sedan.jpg': 'Sedan category image',
      'suv.jpg': 'SUV category image',
      'sports.jpg': 'Sports Car category image',
      'electric.jpg': 'Electric category image',
      'luxury.jpg': 'Luxury category image',
      'compact.jpg': 'Compact category image',
    };
    
    // Create sample images for categories
    Object.entries(categoryImages).forEach(([filename, content]) => {
      const filePath = uploadHelper.createPlaceholderFile('categories', filename, content);
      console.log(`Created placeholder file: ${filePath}`);
    });
    
    // Create sample image content for cars
    const carImages = {
      'toyota-camry-1.jpg': 'Toyota Camry image 1',
      'toyota-camry-2.jpg': 'Toyota Camry image 2',
      'honda-civic-1.jpg': 'Honda Civic image 1',
      'honda-civic-2.jpg': 'Honda Civic image 2',
      'bmw-x5-1.jpg': 'BMW X5 image 1',
      'bmw-x5-2.jpg': 'BMW X5 image 2',
      'tesla-model3-1.jpg': 'Tesla Model 3 image 1',
      'tesla-model3-2.jpg': 'Tesla Model 3 image 2',
      'ford-mustang-1.jpg': 'Ford Mustang image 1',
      'ford-mustang-2.jpg': 'Ford Mustang image 2',
    };
    
    // Create sample images for cars
    Object.entries(carImages).forEach(([filename, content]) => {
      const filePath = uploadHelper.createPlaceholderFile('cars', filename, content);
      console.log(`Created placeholder file: ${filePath}`);
    });
    
    // Create sample image content for users
    const userImages = {
      'admin.jpg': 'Admin user image',
      'john.jpg': 'John user image',
      'jane.jpg': 'Jane user image',
      'robert.jpg': 'Robert user image',
      'emily.jpg': 'Emily user image',
      'michael.jpg': 'Michael user image',
    };
    
    // Create sample images for users
    Object.entries(userImages).forEach(([filename, content]) => {
      const filePath = uploadHelper.createPlaceholderFile('users', filename, content);
      console.log(`Created placeholder file: ${filePath}`);
    });
    
    console.log('Asset setup completed');
    return true;
  } catch (error) {
    console.error('Error setting up assets:', error);
    return false;
  }
};

// Tạo thống kê
async function createStatistics() {
  console.log('Seeding statistics...');
  
  // Clear existing statistics
  await Statistic.deleteMany({});
  
  // Create overview stats
  const totalUsers = await User.countDocuments();
  const totalCars = await Car.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });
  const availableCars = await Car.countDocuments({ status: 'available' });
  
  // Calculate total revenue from bookings
  const bookings = await Booking.find();
  const totalRevenue = bookings.reduce((total, booking) => {
    return total + (booking.totalAmount || 0);
  }, 0);
  
  // Generate monthly data (mock for last 6 months)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  const monthlyRevenue = [];
  const monthlyBookings = [];
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    
    // Random values for demonstration
    const randomRevenue = 5000 + Math.floor(Math.random() * 15000);
    const randomBookings = 10 + Math.floor(Math.random() * 40);
    
    monthlyRevenue.push({
      label: months[monthIndex],
      value: randomRevenue
    });
    
    monthlyBookings.push({
      label: months[monthIndex],
      value: randomBookings
    });
  }
  
  // Car status distribution
  const carStatus = [
    { status: 'available', count: availableCars, label: 'Available' },
    { status: 'maintenance', count: Math.floor(Math.random() * 10), label: 'Maintenance' },
    { status: 'rented', count: Math.floor(Math.random() * 15), label: 'Rented' }
  ];
  
  // Create statistics document
  const statistic = new Statistic({
    overview: {
      totalRevenue,
      totalBookings,
      totalUsers,
      totalCars,
      pendingBookings,
      availableCars,
      monthlyRevenue: monthlyRevenue[5].value,
      monthlyBookings: monthlyBookings[5].value
    },
    monthlyRevenue,
    monthlyBookings,
    carStatus,
    date: new Date()
  });
  
  await statistic.save();
  console.log('Statistics created successfully!');
}

// Tạo dữ liệu thông báo giả
async function createNotifications(users) {
  console.log("Creating notifications data...");
  
  const notificationTypes = ['booking', 'system', 'user', 'payment'];
  const notificationActions = ['created', 'updated', 'cancelled', 'completed', 'pending'];
  const notifications = [];
  
  // Tạo thông báo hệ thống (không liên quan đến user cụ thể)
  for (let i = 0; i < 5; i++) {
    notifications.push({
      title: `Thông báo hệ thống #${i+1}`,
      content: `Nội dung thông báo hệ thống ${i+1} - ${Math.random().toString(36).substring(7)}`,
      type: 'system',
      read: Math.random() > 0.5,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    });
  }
  
  // Tạo thông báo cho mỗi user
  for (const user of users) {
    const userNotificationCount = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < userNotificationCount; i++) {
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const action = notificationActions[Math.floor(Math.random() * notificationActions.length)];
      
      notifications.push({
        user: user._id,
        title: `Thông báo ${type} ${action}`,
        content: `Thông báo cho ${user.name} - ${type} đã được ${action} - ${Math.random().toString(36).substring(7)}`,
        type: type,
        read: Math.random() > 0.7,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      });
    }
  }
  
  // Lưu thông báo vào DB
  await Notification.insertMany(notifications);
  
  console.log(`${notifications.length} notifications created successfully!`);
}

/**
 * Dữ liệu mô phỏng (mock data) cho API responses
 * Giữ lại để tham khảo và dễ dàng cập nhật nếu cần
 */
const MOCK_DATA = {
  dashboard: {
    stats: {
      data: {
        totalUsers: 2856,
        totalCars: 48,
        totalBookings: 142,
        totalRevenue: 35800,
        userGrowth: 12.5,
        carGrowth: -3.2,
        bookingGrowth: 8.7,
        revenueGrowth: 14.2,
        userTrend: [12, 15, 18, 14, 22, 25, 28, 26, 30],
        carTrend: [24, 25, 20, 18, 15, 16, 15, 14, 13],
        bookingTrend: [45, 50, 55, 60, 58, 65, 70, 68, 78],
        revenueTrend: [15000, 16000, 18000, 17000, 19000, 22000, 25000, 28000, 30000],
      }
    },
    topCars: {
      data: [
        { _id: 1, name: 'Tesla Model 3', bookingsCount: 28, totalRevenue: 3360, averageRating: 4.8 },
        { _id: 2, name: 'BMW X5', bookingsCount: 22, totalRevenue: 7700, averageRating: 4.6 },
        { _id: 3, name: 'Toyota Camry', bookingsCount: 19, totalRevenue: 1615, averageRating: 4.3 },
        { _id: 4, name: 'Mercedes C-Class', bookingsCount: 17, totalRevenue: 3400, averageRating: 4.7 },
        { _id: 5, name: 'Honda Civic', bookingsCount: 15, totalRevenue: 1275, averageRating: 4.5 },
      ]
    }
  }
};

if (require.main === module) {
  // Chạy trực tiếp từ dòng lệnh node seed-data.js
  if (process.argv.includes('--copyAssets')) {
    // Chỉ chạy hàm copy assets
    copyPublicAssets()
      .then(() => {
        console.log('Assets copied successfully');
        process.exit(0);
      })
      .catch(err => {
        console.error('Error copying assets:', err);
        process.exit(1);
      });
  } else if (process.argv.includes('--runAll')) {
    // Chạy tất cả các hàm
    seedDatabase()
      .then(() => process.exit(0))
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  } else {
    console.log('Please specify an operation: --copyAssets or --runAll');
    process.exit(1);
  }
} else {
  // Export để sử dụng trong module khác
  module.exports = {
    seedDatabase,
    copyPublicAssets,
    categories,
    cars,
    users,
    MOCK_DATA,
    hashPassword
  };
} 