const mongoose = require('mongoose');
const { Feature } = require('../models');

/**
 * Seeds the database with initial car features
 */
const seedFeatures = async () => {
  try {
    
    // Sample features data organized by category
    const featuresData = [
      // Comfort features
      {
        name: 'Leather Seats',
        description: 'Premium leather upholstery for comfort and luxury',
        category: 'comfort'
      },
      {
        name: 'Heated Seats',
        description: 'Seats with heating elements for cold weather comfort',
        category: 'comfort'
      },
      {
        name: 'Ventilated Seats',
        description: 'Seats with ventilation for hot weather comfort',
        category: 'comfort'
      },
      {
        name: 'Panoramic Sunroof',
        description: 'Extended glass roof for natural light and open feel',
        category: 'comfort'
      },
      {
        name: 'Climate Control',
        description: 'Automated temperature control system',
        category: 'comfort'
      },
      
      // Safety features
      {
        name: 'Lane Departure Warning',
        description: 'System that alerts driver when vehicle drifts from lane',
        category: 'safety'
      },
      {
        name: 'Blind Spot Monitor',
        description: 'Alerts driver to vehicles in blind spots',
        category: 'safety'
      },
      {
        name: 'Automatic Emergency Braking',
        description: 'System that automatically applies brakes to prevent collision',
        category: 'safety'
      },
      {
        name: 'Adaptive Cruise Control',
        description: 'Cruise control that adjusts speed to maintain safe distance',
        category: 'safety'
      },
      {
        name: 'Parking Sensors',
        description: 'Sensors that detect obstacles while parking',
        category: 'safety'
      },
      
      // Technology features
      {
        name: 'Touchscreen Navigation',
        description: 'Built-in GPS navigation with touch interface',
        category: 'technology'
      },
      {
        name: 'Bluetooth Connectivity',
        description: 'Wireless connection for phone and audio devices',
        category: 'technology'
      },
      {
        name: 'Wireless Charging',
        description: 'Pad for wirelessly charging compatible devices',
        category: 'technology'
      },
      {
        name: 'Apple CarPlay',
        description: 'Integration with Apple devices for phone, messaging, and media',
        category: 'technology'
      },
      {
        name: 'Android Auto',
        description: 'Integration with Android devices for phone, messaging, and media',
        category: 'technology'
      },
      
      // Performance features
      {
        name: 'Sport Mode',
        description: 'Performance-oriented driving mode',
        category: 'performance'
      },
      {
        name: 'All-Wheel Drive',
        description: 'Power delivery to all four wheels for improved traction',
        category: 'performance'
      },
      {
        name: 'Paddle Shifters',
        description: 'Steering wheel-mounted controls for manual gear selection',
        category: 'performance'
      },
      {
        name: 'Turbocharger',
        description: 'Forced induction system for increased power',
        category: 'performance'
      },
      {
        name: 'Performance Exhaust',
        description: 'Enhanced exhaust system for improved sound and performance',
        category: 'performance'
      }
    ];

    // Insert features into the database
    const createdFeatures = await Feature.insertMany(featuresData);
    
    console.log(`${createdFeatures.length} features seeded successfully`);
    return createdFeatures;
  } catch (error) {
    console.error('Error seeding features:', error);
    throw error;
  }
};

module.exports = seedFeatures; 