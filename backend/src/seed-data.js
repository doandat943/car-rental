const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental';

// Import models
const Car = require('./models/car');
const Category = require('./models/category');
const User = require('./models/User');
const Booking = require('./models/booking');

// Dữ liệu mẫu cho Categories
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
  }
];

// Dữ liệu mẫu cho Cars
const cars = [
  {
    name: 'Toyota Camry',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    description: 'Sedan hạng D sang trọng và tiết kiệm nhiên liệu',
    price: {
      daily: 45,
      weekly: 280,
      monthly: 1100
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
    images: ['/uploads/cars/toyota-camry-1.jpg', '/uploads/cars/toyota-camry-2.jpg'],
    availability: true,
    rating: 4.7,
    reviewCount: 12
  },
  {
    name: 'Honda Civic',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    description: 'Sedan hạng C thể thao và tiết kiệm',
    price: {
      daily: 40,
      weekly: 250,
      monthly: 950
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
    images: ['/uploads/cars/honda-civic-1.jpg', '/uploads/cars/honda-civic-2.jpg'],
    availability: true,
    rating: 4.5,
    reviewCount: 8
  },
  {
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    description: 'Xe điện hiệu suất cao với công nghệ tự lái',
    price: {
      daily: 80,
      weekly: 500,
      monthly: 1800
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
      'Over-the-air Updates'
    ],
    images: ['/uploads/cars/tesla-model3-1.jpg', '/uploads/cars/tesla-model3-2.jpg'],
    availability: true,
    rating: 4.9,
    reviewCount: 15
  },
  {
    name: 'BMW X5',
    brand: 'BMW',
    model: 'X5',
    year: 2023,
    description: 'SUV hạng sang với hiệu suất vượt trội',
    price: {
      daily: 95,
      weekly: 600,
      monthly: 2200
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
      'Gesture Control'
    ],
    images: ['/uploads/cars/bmw-x5-1.jpg', '/uploads/cars/bmw-x5-2.jpg'],
    availability: true,
    rating: 4.8,
    reviewCount: 10
  },
  {
    name: 'Ford Mustang',
    brand: 'Ford',
    model: 'Mustang GT',
    year: 2023,
    description: 'Xe thể thao biểu tượng của Mỹ',
    price: {
      daily: 85,
      weekly: 550,
      monthly: 2000
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
    rating: 4.6,
    reviewCount: 7
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
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '0912345678',
    password: 'password123',
    role: 'user',
    avatar: '/uploads/users/john.jpg'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '0923456789',
    password: 'password456',
    role: 'user',
    avatar: '/uploads/users/jane.jpg'
  }
];

// Hàm để hash password trước khi lưu vào database
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Hàm kết nối đến MongoDB và import dữ liệu
async function seedDatabase() {
  try {
    // Kết nối đến MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    console.log('Using database:', MONGODB_URI);

    // Xóa dữ liệu cũ (nếu có)
    await Category.deleteMany({});
    await Car.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    console.log('Old data deleted');

    // Import Categories
    console.log('Importing categories...');
    console.log('Categories data:', JSON.stringify(categories, null, 2));
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories imported`);
    console.log('First category ID:', createdCategories[0]._id);

    // Cập nhật category cho cars
    console.log('Updating car categories...');
    for (let i = 0; i < cars.length; i++) {
      // Gán category cho từng loại xe
      if (i < 2) {
        cars[i].category = createdCategories[0]._id; // Sedan
      } else if (i === 2) {
        cars[i].category = createdCategories[3]._id; // Electric
      } else if (i === 3) {
        cars[i].category = createdCategories[1]._id; // SUV
      } else {
        cars[i].category = createdCategories[2]._id; // Sports Car
      }
    }

    // Import Cars
    console.log('Importing cars...');
    console.log('First car data:', JSON.stringify(cars[0], null, 2));
    const createdCars = await Car.insertMany(cars);
    console.log(`${createdCars.length} cars imported`);
    console.log('First car ID:', createdCars[0]._id);

    // Hash passwords và import Users
    console.log('Importing users...');
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await hashPassword(user.password);
        return { ...user, password: hashedPassword };
      })
    );
    
    console.log('First user data:', JSON.stringify({...usersWithHashedPasswords[0], password: '[HIDDEN]'}, null, 2));
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`${createdUsers.length} users imported`);
    console.log('First user ID:', createdUsers[0]._id);

    // Tạo một số booking mẫu
    console.log('Creating bookings...');
    const bookings = [
      {
        customer: createdUsers[1]._id, // John Doe
        car: createdCars[0]._id, // Toyota Camry
        startDate: new Date('2023-06-10'),
        endDate: new Date('2023-06-15'),
        totalAmount: 225, // 5 days * $45
        status: 'completed',
        paymentStatus: 'paid',
        pickupLocation: 'Hà Nội',
        dropoffLocation: 'Hà Nội'
      },
      {
        customer: createdUsers[2]._id, // Jane Smith
        car: createdCars[2]._id, // Tesla Model 3
        startDate: new Date('2023-07-05'),
        endDate: new Date('2023-07-10'),
        totalAmount: 400, // 5 days * $80
        status: 'completed',
        paymentStatus: 'paid',
        pickupLocation: 'TP. Hồ Chí Minh',
        dropoffLocation: 'TP. Hồ Chí Minh'
      },
      {
        customer: createdUsers[1]._id, // John Doe
        car: createdCars[3]._id, // BMW X5
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        totalAmount: 475, // 5 days * $95
        status: 'confirmed',
        paymentStatus: 'paid',
        pickupLocation: 'Đà Nẵng',
        dropoffLocation: 'Đà Nẵng'
      }
    ];

    console.log('First booking data:', JSON.stringify(bookings[0], null, 2));
    // Import Bookings
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`${createdBookings.length} bookings imported`);

    // Kiểm tra dữ liệu đã import
    const categoriesCount = await Category.countDocuments();
    const carsCount = await Car.countDocuments();
    const usersCount = await User.countDocuments();
    const bookingsCount = await Booking.countDocuments();

    console.log('\nVerifying imported data:');
    console.log(`- Categories: ${categoriesCount}`);
    console.log(`- Cars: ${carsCount}`);
    console.log(`- Users: ${usersCount}`);
    console.log(`- Bookings: ${bookingsCount}`);

    console.log('\nDatabase seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: john.doe@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:');
    console.error(error.message);
    console.error(error.stack);
    
    if (error.errors) {
      console.error('Validation errors:');
      for (let field in error.errors) {
        console.error(`- ${field}: ${error.errors[field].message}`);
      }
    }
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Chạy hàm import dữ liệu
seedDatabase(); 