/**
 * Database Connection Utility
 * 
 * Provides functions to connect to the MongoDB database.
 * This is a centralized utility used by both the application and the seeding system.
 * It consolidates the database connection logic that was previously spread across multiple files.
 * 
 * Usage:
 * - In application: import { connectDB } from './db'
 * - In seeding system: import { connectDB } from '../db'
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables if not already loaded
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental';

/**
 * Connect to the MongoDB database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Close the MongoDB connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  closeDB,
  MONGODB_URI
}; 