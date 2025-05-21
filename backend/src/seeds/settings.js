const mongoose = require('mongoose');
const { Setting, User } = require('../models');

/**
 * Seeds the database with user settings for admin users
 */
const seedSettings = async () => {
  try {
    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' });
    
    if (!adminUsers || adminUsers.length === 0) {
      console.log('No admin users found, skipping settings seed');
      return [];
    }
    
    const settingsPromises = adminUsers.map(async (user) => {
      // Create default settings for each admin user
      const userSettings = await Setting.create({
        user: user._id,
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: {
            email: {
              newBookings: true,
              bookingUpdates: true,
              promotions: false
            },
            sms: {
              newBookings: false,
              bookingUpdates: false,
              promotions: false
            },
            inApp: {
              newBookings: true,
              bookingUpdates: true,
              promotions: true,
              systemUpdates: true
            }
          },
          displayPreferences: {
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            showPricesWithTax: true
          }
        }
      });
      
      return userSettings;
    });
    
    const createdSettings = await Promise.all(settingsPromises);
    
    console.log(`${createdSettings.length} user settings created for admin users`);
    return createdSettings;
  } catch (error) {
    console.error('Error seeding settings:', error);
    throw error;
  }
};

module.exports = seedSettings; 