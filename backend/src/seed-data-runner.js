const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental';

async function main() {
  try {
    // Kết nối đến MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB. Starting to seed data...');
    
    // Import seed-data.js và chạy hàm seedDatabase
    const { seedDatabase } = require('./seed-data');
    await seedDatabase();
    
    console.log('Seeding completed! Database has been populated with initial data.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

// Chạy hàm main
main(); 