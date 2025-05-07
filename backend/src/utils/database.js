const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Car, Category, WebsiteInfo } = require('../models');

/**
 * Connect to MongoDB
 */
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Initialize database with seed data if collections are empty
 */
const initializeDatabase = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('No admin user found. Creating default admin user...');
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@carental.com',
        password: 'Admin123!',
        phone: '555-123-4567',
        role: 'admin',
      });
      
      await adminUser.save();
      console.log('Default admin user created');
    }

    // Check if categories exist
    const categoriesCount = await Category.countDocuments();
    
    if (categoriesCount === 0) {
      console.log('No categories found. Creating default categories...');
      
      const categories = [
        { name: 'Sedan', description: 'Standard 4-door passenger cars' },
        { name: 'SUV', description: 'Sport Utility Vehicles with higher ground clearance' },
        { name: 'Luxury', description: 'Premium vehicles with high-end features' },
        { name: 'Electric', description: 'Electric vehicles' },
        { name: 'Compact', description: 'Small, fuel-efficient cars' },
      ];
      
      await Category.insertMany(categories);
      console.log('Default categories created');
    }

    // Check if website info exists
    const websiteInfoExists = await WebsiteInfo.findOne();
    
    if (!websiteInfoExists) {
      console.log('No website info found. Creating default website info...');
      
      const websiteInfo = new WebsiteInfo({
        websiteName: 'CarRental',
        contactInfo: {
          email: 'contact@carental.com',
          phone: '555-987-6543',
          address: '123 Main Street, New York, NY 10001'
        },
        socialLinks: {
          facebook: 'https://facebook.com/carental',
          twitter: 'https://twitter.com/carental',
          instagram: 'https://instagram.com/carental'
        }
      });
      
      await websiteInfo.save();
      console.log('Default website info created');
    }

    // Check if any cars exist
    const carsCount = await Car.countDocuments();
    
    if (carsCount === 0) {
      console.log('No cars found. Creating sample cars...');
      
      // Get category IDs
      const categories = await Category.find();
      const categoryMap = {};
      categories.forEach(category => {
        categoryMap[category.name] = category._id;
      });
      
      // Sample cars
      const cars = [
        {
          name: 'Toyota Camry',
          brand: 'Toyota',
          model: 'Camry',
          year: 2023,
          price: {
            hourly: 15,
            daily: 50,
            weekly: 300,
            monthly: 1200
          },
          description: 'Reliable mid-size sedan with excellent fuel efficiency.',
          features: ['Bluetooth', 'Backup Camera', 'Cruise Control', 'Lane Departure Warning'],
          category: categoryMap['Sedan'],
          images: ['/uploads/cars/toyota-camry.jpg'],
          specifications: {
            seats: 5,
            doors: 4,
            transmission: 'Automatic',
            fuelType: 'Gasoline',
            engineCapacity: '2.5L'
          },
          availability: true,
          rating: 4.5,
          reviewCount: 25
        },
        {
          name: 'Honda CR-V',
          brand: 'Honda',
          model: 'CR-V',
          year: 2023,
          price: {
            hourly: 20,
            daily: 65,
            weekly: 400,
            monthly: 1500
          },
          description: 'Spacious and efficient compact SUV with modern features.',
          features: ['Apple CarPlay', 'Android Auto', 'Heated Seats', 'Blind Spot Detection'],
          category: categoryMap['SUV'],
          images: ['/uploads/cars/honda-crv.jpg'],
          specifications: {
            seats: 5,
            doors: 5,
            transmission: 'Automatic',
            fuelType: 'Gasoline',
            engineCapacity: '1.5L Turbo'
          },
          availability: true,
          rating: 4.3,
          reviewCount: 18
        },
        {
          name: 'Tesla Model 3',
          brand: 'Tesla',
          model: 'Model 3',
          year: 2023,
          price: {
            hourly: 25,
            daily: 80,
            weekly: 500,
            monthly: 1800
          },
          description: 'Revolutionary electric sedan with cutting-edge technology.',
          features: ['Autopilot', 'Touch Screen', 'Supercharger Access', 'Over-the-air Updates'],
          category: categoryMap['Electric'],
          images: ['/uploads/cars/tesla-model3.jpg'],
          specifications: {
            seats: 5,
            doors: 4,
            transmission: 'Automatic',
            fuelType: 'Electric',
            engineCapacity: 'Electric Motor'
          },
          availability: true,
          rating: 4.8,
          reviewCount: 32
        }
      ];
      
      await Car.insertMany(cars);
      console.log('Sample cars created');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error(`Error initializing database: ${error.message}`);
    // Don't exit process here, just log the error
  }
};

module.exports = {
  connectDatabase,
  initializeDatabase
}; 