const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import database utilities
const { connectDatabase, initializeDatabase } = require('./utils/database');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Add logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Import routes
const setRoutes = require('./routes');
const users = require('./routes/users');
const cars = require('./routes/cars');
const bookings = require('./routes/bookings');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');
const notifications = require('./routes/notifications');
const statistics = require('./routes/statistics');

// Connect to MongoDB and initialize database
(async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Initialize database with seed data if needed
    await initializeDatabase();
    
    // Set routes
    setRoutes(app);
    
    // Mount routers
    app.use('/api/v1/users', users);
    app.use('/api/v1/cars', cars);
    app.use('/api/v1/bookings', bookings);
    app.use('/api/v1/reviews', reviews);
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/notifications', notifications);
    app.use('/api/v1/statistics', statistics);
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

module.exports = app; 