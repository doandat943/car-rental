const mongoose = require('mongoose');
const { Transmission } = require('../models');

/**
 * Seeds the database with initial car transmission types
 */
const seedTransmissions = async () => {
  try {
    
    // Sample transmissions data
    const transmissionsData = [
      {
        name: 'Automatic',
        description: 'Automatic transmission that shifts gears without driver input'
      },
      {
        name: 'Manual',
        description: 'Manual transmission requiring driver to shift gears with a clutch'
      },
      {
        name: 'CVT',
        description: 'Continuously Variable Transmission that provides seamless acceleration'
      },
      {
        name: 'Dual-Clutch',
        description: 'Automated manual transmission with two separate clutches for odd and even gear sets'
      },
      {
        name: 'Semi-Automatic',
        description: 'Transmission that allows manual gear selection without a clutch pedal'
      }
    ];

    // Insert transmissions into the database
    const createdTransmissions = await Transmission.insertMany(transmissionsData);
    
    console.log(`${createdTransmissions.length} transmissions seeded successfully`);
    return createdTransmissions;
  } catch (error) {
    console.error('Error seeding transmissions:', error);
    throw error;
  }
};

module.exports = seedTransmissions; 