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

// Thực hiện seeding tất cả các dữ liệu
async function seedDatabase() {
  try {
    // Kết nối đến cơ sở dữ liệu
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Xóa toàn bộ dữ liệu cũ
    await Promise.all([
      Category.deleteMany({}),
      Car.deleteMany({}),
      User.deleteMany({}),
      Booking.deleteMany({})
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
    const userIds = await createUsers();
    
    // Tạo bookings
    await createBookings(userIds, createdCars);
    
    // Copy assets from frontend to backend
    await copyPublicAssets();

    // Đóng kết nối
    await mongoose.connection.close();
    
    console.log('Database seeded successfully');
    
    return {
      categories: createdCategories,
      cars: createdCars
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.connection.close();
    throw error;
  }
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
    
    console.log('Asset setup completed');
    return true;
  } catch (error) {
    console.error('Error setting up assets:', error);
    return false;
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
  module.exports = { seedDatabase, createUsers, createBookings, copyPublicAssets };
} 