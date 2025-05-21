const { Location } = require('../models');

/**
 * Seeds the database with initial location data
 */
const seedLocations = async () => {
  try {

    // Default locations data
    const defaultLocations = [
      {
        name: 'Airport Terminal',
        code: 'airport',
        address: '123 Airport Blvd, International Terminal',
        hours: '24/7',
        description: 'Convenient pickup point at the airport terminal',
        isActive: true,
        coordinates: {
          latitude: 10.8188,
          longitude: 106.6523
        }
      },
      {
        name: 'Downtown Office',
        code: 'downtown',
        address: '456 Main St, Central District',
        hours: '8:00 AM - 8:00 PM',
        description: 'Our main office in the heart of downtown',
        isActive: true,
        coordinates: {
          latitude: 10.7758,
          longitude: 106.7029
        }
      },
      {
        name: 'Shopping Mall',
        code: 'mall',
        address: '789 Mall Way, East Wing Entrance',
        hours: '9:00 AM - 9:00 PM',
        description: 'Pickup point at the east entrance of the main shopping mall',
        isActive: true,
        coordinates: {
          latitude: 10.7544,
          longitude: 106.6601
        }
      },
      {
        name: 'Hotel Zone',
        code: 'hotel',
        address: '101 Hotel Circle, Tourism District',
        hours: '24/7',
        description: 'Service desk at the main hotel area',
        isActive: true,
        coordinates: {
          latitude: 10.7872,
          longitude: 106.7058
        }
      },
      {
        name: 'Train Station',
        code: 'station',
        address: '202 Station Ave, Central Terminal',
        hours: '6:00 AM - 11:00 PM',
        description: 'Pickup point at the main train station',
        isActive: true,
        coordinates: {
          latitude: 10.7827,
          longitude: 106.6989
        }
      }
    ];
    
    // Insert locations into the database
    const createdLocations = await Location.insertMany(defaultLocations);
    
    console.log(`${createdLocations.length} locations seeded successfully`);
    return createdLocations;
  } catch (error) {
    console.error('Error seeding locations:', error);
    throw error;
  }
};

module.exports = seedLocations; 