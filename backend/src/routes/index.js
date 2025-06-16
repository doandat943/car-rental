const express = require('express');
const authRoutes = require('./auth');
const carRoutes = require('./cars');
const bookingRoutes = require('./bookings');
const dashboardRoutes = require('./dashboard');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const uploadRoutes = require('./upload');
const notificationRoutes = require('./notification');
const statisticsRoutes = require('./statistics');
const websiteInfoRoutes = require('./website-info');
const brandRoutes = require('./brands');
const transmissionRoutes = require('./transmissions');
const fuelRoutes = require('./fuels');
const featureRoutes = require('./features');
const chatbotRoutes = require('./chatbot');
const paymentRoutes = require('./payment');

/**
 * Initialize all routes
 * @param {express.Application} app - Express app instance
 */
function setRoutes(app) {
  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/cars', carRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/statistics', statisticsRoutes);
  app.use('/api/website-info', websiteInfoRoutes);
  app.use('/api/brands', brandRoutes);
  app.use('/api/transmissions', transmissionRoutes);
  app.use('/api/fuels', fuelRoutes);
  app.use('/api/features', featureRoutes);
  app.use('/api/chatbot', chatbotRoutes);
  app.use('/api/payment', paymentRoutes);

  // Home route
  app.get('/', (req, res) => {
    res.json({ message: 'Car Rental API' });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  });
}

module.exports = setRoutes; 