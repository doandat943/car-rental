const mongoose = require('mongoose');
const { connectDB } = require('../db');

// Import all seed modules with error handling
let seedUsers, seedBrands, seedTransmissions, seedFuels, seedFeatures, seedCategories, seedCars, seedBookings, seedNotifications, seedWebsiteInfo, seedStatistics;

try {
  seedUsers = require('./users');
} catch (error) {
  console.warn('Users seed module not found:', error.message);
  seedUsers = async () => {
    console.log('Skipping users seed (module not available)');
  };
}

try {
  seedBrands = require('./brands');
} catch (error) {
  console.warn('Brands seed module not found:', error.message);
  seedBrands = async () => {
    console.log('Skipping brands seed (module not available)');
  };
}

try {
  seedTransmissions = require('./transmissions');
} catch (error) {
  console.warn('Transmissions seed module not found:', error.message);
  seedTransmissions = async () => {
    console.log('Skipping transmissions seed (module not available)');
  };
}

try {
  seedFuels = require('./fuels');
} catch (error) {
  console.warn('Fuels seed module not found:', error.message);
  seedFuels = async () => {
    console.log('Skipping fuels seed (module not available)');
  };
}

try {
  seedFeatures = require('./features');
} catch (error) {
  console.warn('Features seed module not found:', error.message);
  seedFeatures = async () => {
    console.log('Skipping features seed (module not available)');
  };
}

try {
  seedCategories = require('./categories');
} catch (error) {
  console.warn('Categories seed module not found:', error.message);
  seedCategories = async () => {
    console.log('Skipping categories seed (module not available)');
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
  seedNotifications = require('./notifications');
} catch (error) {
  console.warn('Notifications seed module not found:', error.message);
  seedNotifications = async () => {
    console.log('Skipping notifications seed (module not available)');
  };
}

try {
  seedWebsiteInfo = require('./websiteInfo');
} catch (error) {
  console.warn('Website info seed module not found:', error.message);
  seedWebsiteInfo = async () => {
    console.log('Skipping website info seed (module not available)');
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

// Seed all data
const seedAll = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('Connected to database. Starting seed process...');
    
    // Execute seed functions in order
    // 1. Seed users first to have user IDs for other models
    await seedUsers();
    
    // 2. Seed car attributes first (needed for cars)
    await seedBrands();
    await seedTransmissions();
    await seedFuels();
    await seedFeatures();
    await seedCategories();
    
    // 3. Seed cars
    await seedCars();
    
    // 4. Seed bookings 
    await seedBookings();
    
    // 5. Seed notifications
    await seedNotifications();
    
    // 6. Seed website info and FAQs
    await seedWebsiteInfo();
    
    // 7. Seed statistics (should run last to get accurate counts)
    await seedStatistics();
    
    console.log('Seed process completed successfully');
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    // Close database connection even if there's an error
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(1);
  }
};

// Execute seed function
seedAll(); 