const express = require('express');
const authRoutes = require('./auth');
const carRoutes = require('./cars');
const bookingRoutes = require('./bookings');

/**
 * Initialize all routes
 * @param {express.Application} app - Express app instance
 */
function setRoutes(app) {
  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/cars', carRoutes);
  app.use('/api/bookings', bookingRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  });
}

module.exports = setRoutes; 