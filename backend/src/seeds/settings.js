const mongoose = require('mongoose');
const { Setting } = require('../models');

/**
 * Seeds the database with initial application settings
 * This includes site configuration, payment settings, etc.
 */
const seedSettings = async () => {
  try {
    
    // Sample application settings
    const settingsData = [
      {
        key: 'site_name',
        value: 'Car Rental Service',
        type: 'string',
        category: 'general',
        description: 'The name of the website'
      },
      {
        key: 'site_description',
        value: 'Premium car rental service for all your travel needs',
        type: 'string',
        category: 'general',
        description: 'Short description of the website'
      },
      {
        key: 'contact_email',
        value: 'contact@carental.com',
        type: 'string',
        category: 'contact',
        description: 'Main contact email address'
      },
      {
        key: 'contact_phone',
        value: '+1 (555) 123-4567',
        type: 'string',
        category: 'contact',
        description: 'Main contact phone number'
      },
      {
        key: 'address',
        value: '123 Rental Street, San Francisco, CA 94107',
        type: 'string',
        category: 'contact',
        description: 'Physical address'
      },
      {
        key: 'business_hours',
        value: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: Closed',
        type: 'string',
        category: 'contact',
        description: 'Business hours'
      },
      {
        key: 'currency',
        value: 'USD',
        type: 'string',
        category: 'payment',
        description: 'Currency for pricing'
      },
      {
        key: 'tax_rate',
        value: '8.5',
        type: 'number',
        category: 'payment',
        description: 'Tax rate percentage'
      },
      {
        key: 'enable_paypal',
        value: 'true',
        type: 'boolean',
        category: 'payment',
        description: 'Enable PayPal payments'
      },
      {
        key: 'enable_credit_card',
        value: 'true',
        type: 'boolean',
        category: 'payment',
        description: 'Enable credit card payments'
      },
      {
        key: 'enable_cash',
        value: 'true',
        type: 'boolean',
        category: 'payment',
        description: 'Enable cash payments'
      },
      {
        key: 'enable_bank_transfer',
        value: 'true',
        type: 'boolean',
        category: 'payment',
        description: 'Enable bank transfer payments'
      },
      {
        key: 'booking_advance_days',
        value: '1',
        type: 'number',
        category: 'booking',
        description: 'Minimum days in advance for booking'
      },
      {
        key: 'max_booking_days',
        value: '30',
        type: 'number',
        category: 'booking',
        description: 'Maximum days for a single booking'
      },
      {
        key: 'enable_reviews',
        value: 'true',
        type: 'boolean',
        category: 'features',
        description: 'Enable customer reviews'
      },
      {
        key: 'maintenance_mode',
        value: 'false',
        type: 'boolean',
        category: 'system',
        description: 'Enable maintenance mode'
      },
      {
        key: 'google_analytics_id',
        value: 'UA-XXXXXXXXX-X',
        type: 'string',
        category: 'integrations',
        description: 'Google Analytics ID'
      },
      {
        key: 'facebook_url',
        value: 'https://facebook.com/carental',
        type: 'string',
        category: 'social',
        description: 'Facebook page URL'
      },
      {
        key: 'twitter_url',
        value: 'https://twitter.com/carental',
        type: 'string',
        category: 'social',
        description: 'Twitter profile URL'
      },
      {
        key: 'instagram_url',
        value: 'https://instagram.com/carental',
        type: 'string',
        category: 'social',
        description: 'Instagram profile URL'
      }
    ];

    // Insert settings into the database
    const createdSettings = await Setting.insertMany(settingsData);
    
    console.log(`${createdSettings.length} settings seeded successfully`);
    return createdSettings;
  } catch (error) {
    console.error('Error seeding settings:', error);
    throw error;
  }
};

module.exports = seedSettings; 