const express = require('express');
const authRoutes = require('./auth');
const carRoutes = require('./cars');
const bookingRoutes = require('./bookings');
const dashboardRoutes = require('./dashboard');

/**
 * Initialize all routes
 * @param {express.Application} app - Express app instance
 */
function setRoutes(app) {
  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/cars', carRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  });
}

module.exports = setRoutes; 