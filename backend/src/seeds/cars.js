const mongoose = require('mongoose');
const { Car, Category } = require('../models');

/**
 * Seeds the database with initial car and category data
 * This includes various car types, categories, and their specifications
 */
const seedCars = async () => {
  try {
    // Check if cars already exist in the database
    const carCount = await Car.countDocuments();
    if (carCount > 0) {
      console.log('Cars already seeded');
      return;
    }

    // Check if categories already exist in the database
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      // Create categories first
      await seedCategories();
    }

    // Fetch categories to reference in cars
    const categories = await Category.find();
    if (categories.length === 0) {
      throw new Error('Categories not found. Cannot seed cars');
    }

    // Create map for quick category lookup by name
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    // Sample cars data with varied attributes
    const carsData = [
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
        images: ['/uploads/cars/toyota-camry-1.jpg', '/uploads/cars/toyota-camry-2.jpg'],
        status: 'available',
        rating: 4.3,
        reviewCount: 19,
        category: categoryMap['Sedan']
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
        images: ['/uploads/cars/honda-civic-1.jpg', '/uploads/cars/honda-civic-2.jpg'],
        status: 'available',
        rating: 4.5,
        reviewCount: 15,
        category: categoryMap['Compact']
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
        images: ['/uploads/cars/tesla-model3-1.jpg', '/uploads/cars/tesla-model3-2.jpg'],
        status: 'available',
        rating: 4.8,
        reviewCount: 28,
        category: categoryMap['Electric']
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
        ],
        images: ['/uploads/cars/bmw-x5-1.jpg', '/uploads/cars/bmw-x5-2.jpg'],
        status: 'available',
        rating: 4.6,
        reviewCount: 22,
        category: categoryMap['SUV']
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
        status: 'available',
        rating: 4.5,
        reviewCount: 12,
        category: categoryMap['Sports Car']
      },
      {
        name: 'Mercedes C-Class',
        brand: 'Mercedes-Benz',
        model: 'C300',
        year: 2022,
        description: 'Sedan hạng sang với công nghệ tiên tiến',
        price: {
          daily: 160,
          weekly: 960,
          monthly: 3500
        },
        specifications: {
          seats: 5,
          doors: 4,
          transmission: 'Automatic',
          fuelType: 'Gasoline',
          engineCapacity: '2.0L'
        },
        features: [
          'MBUX Infotainment',
          'LED Headlights',
          'Burmester Sound System',
          'Heated Seats',
          'Ambient Lighting',
          'Driver Assistance Package'
        ],
        images: ['/uploads/cars/mercedes-c-class-1.jpg', '/uploads/cars/mercedes-c-class-2.jpg'],
        status: 'available',
        rating: 4.7,
        reviewCount: 18,
        category: categoryMap['Luxury']
      },
      {
        name: 'Toyota Prius',
        brand: 'Toyota',
        model: 'Prius',
        year: 2023,
        description: 'Xe hybrid tiết kiệm nhiên liệu vượt trội',
        price: {
          daily: 70,
          weekly: 420,
          monthly: 1500
        },
        specifications: {
          seats: 5,
          doors: 4,
          transmission: 'CVT',
          fuelType: 'Hybrid',
          engineCapacity: '1.8L'
        },
        features: [
          'Hybrid Powertrain',
          'Toyota Safety Sense',
          'Smart Key System',
          'Energy Monitor',
          'Wireless Charging'
        ],
        images: ['/uploads/cars/toyota-prius-1.jpg', '/uploads/cars/toyota-prius-2.jpg'],
        status: 'available',
        rating: 4.2,
        reviewCount: 16,
        category: categoryMap['Electric']
      }
    ];

    // Insert the cars into the database
    const createdCars = await Car.insertMany(carsData);
    
    console.log(`${createdCars.length} cars seeded successfully`);
    return createdCars;
  } catch (error) {
    console.error('Error seeding cars:', error);
    throw error;
  }
};

/**
 * Seeds the database with car categories
 */
async function seedCategories() {
  try {
    const categoriesData = [
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

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`${createdCategories.length} categories seeded successfully`);
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
}

module.exports = seedCars; 