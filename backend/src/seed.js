/**
 * Car Rental Application - Database Seeder
 * 
 * This script initializes the database with sample data for development/testing.
 * Run with: node src/seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Display banner
console.log('\x1b[32m%s\x1b[0m', `
╔═══════════════════════════════════════════════════════════════╗
║                CAR RENTAL - DATABASE SEEDER                   ║
╚═══════════════════════════════════════════════════════════════╝
`);

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental';

// Function to seed the database
async function main() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '🚀 Starting database seed process...');
    
    console.log('   Checking database connection...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('\x1b[32m%s\x1b[0m', '✓ Connected to MongoDB');
    
    // Drop the database first
    console.log('\x1b[33m%s\x1b[0m', '🗑️  Dropping existing database...');
    await mongoose.connection.dropDatabase();
    console.log('\x1b[32m%s\x1b[0m', '✓ Database dropped successfully');
    
    // Run the modular seed system
    console.log('\n📦 Running modular seed system...');
    require('./seeds');
    
    // Don't disconnect here - the seeds/index.js will handle that
    console.log('\n\x1b[33m%s\x1b[0m', 'ℹ️  Seed process is running. Please wait for completion message...');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error during database seeding:');
    console.error(error);
    process.exit(1);
  }
}

// Create global error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\x1b[31m%s\x1b[0m', '❌ Uncaught Exception:');
  console.error(err);
  process.exit(1);
});

// Run the main function
main(); 