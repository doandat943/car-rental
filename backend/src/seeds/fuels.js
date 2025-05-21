const mongoose = require('mongoose');
const { Fuel } = require('../models');

/**
 * Seeds the database with initial car fuel types
 */
const seedFuels = async () => {
  try {
    
    // Sample fuels data
    const fuelsData = [
      {
        name: 'Gasoline',
        description: 'Traditional petroleum-based fuel for internal combustion engines'
      },
      {
        name: 'Diesel',
        description: 'High-efficiency fuel for diesel engines with greater torque'
      },
      {
        name: 'Electric',
        description: 'Battery-powered propulsion system with zero direct emissions'
      },
      {
        name: 'Hybrid',
        description: 'Combination of internal combustion engine and electric motor'
      },
      {
        name: 'Plug-in Hybrid',
        description: 'Hybrid with larger battery that can be charged externally'
      },
      {
        name: 'Natural Gas',
        description: 'Alternative fuel that burns cleaner than gasoline or diesel'
      },
      {
        name: 'Hydrogen',
        description: 'Fuel cell technology that generates electricity with water as exhaust'
      }
    ];

    // Insert fuels into the database
    const createdFuels = await Fuel.insertMany(fuelsData);
    
    console.log(`${createdFuels.length} fuels seeded successfully`);
    return createdFuels;
  } catch (error) {
    console.error('Error seeding fuels:', error);
    throw error;
  }
};

module.exports = seedFuels; 