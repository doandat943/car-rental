const mongoose = require('mongoose');
const { Car, Category, Brand, Transmission, Fuel, Feature } = require('../models');

/**
 * Seeds the database with initial car data
 * This assumes categories, brands, transmissions, fuels, and features are already seeded
 */
const seedCars = async () => {
  try {
    
    // Verify required reference data exists
    const categoryCount = await Category.countDocuments();
    const brandCount = await Brand.countDocuments();
    const transmissionCount = await Transmission.countDocuments();
    const fuelCount = await Fuel.countDocuments();
    const featureCount = await Feature.countDocuments();

    if (categoryCount === 0 || brandCount === 0 || transmissionCount === 0 || 
        fuelCount === 0 || featureCount === 0) {
      throw new Error('Required reference data is missing. Please run the complete seed sequence.');
    }

    // Fetch all the lookup data for references
    const categories = await Category.find();
    const brands = await Brand.find();
    const transmissions = await Transmission.find();
    const fuels = await Fuel.find();
    const features = await Feature.find();

    // Create maps for quick lookup by name
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.name] = category._id;
    });
    
    const brandMap = {};
    brands.forEach(brand => {
      brandMap[brand.name] = brand._id;
    });
    
    const transmissionMap = {};
    transmissions.forEach(transmission => {
      transmissionMap[transmission.name] = transmission._id;
    });
    
    const fuelMap = {};
    fuels.forEach(fuel => {
      fuelMap[fuel.name] = fuel._id;
    });
    
    const featureMap = {};
    features.forEach(feature => {
      featureMap[feature.name] = feature._id;
    });

    // Sample cars data with varied attributes
    const carsData = [
      {
        name: 'Toyota Camry',
        brand: brandMap['Toyota'],
        model: 'Camry',
        year: 2023,
        description: 'Luxury D-segment sedan with excellent fuel efficiency',
        price: 85,
        seats: 5,
        transmission: transmissionMap['Automatic'],
        fuel: fuelMap['Gasoline'],
        features: [
          featureMap['Bluetooth Connectivity'],
          featureMap['Parking Sensors'],
          featureMap['Touchscreen Navigation'],
          featureMap['Adaptive Cruise Control'],
          featureMap['Keyless Entry']
        ],
        images: [],
        status: 'available',
        rating: 4.3,
        reviewCount: 19,
        category: categoryMap['Sedan']
      },
      {
        name: 'Honda Civic',
        brand: brandMap['Honda'],
        model: 'Civic',
        year: 2023,
        description: 'Sporty and efficient C-segment sedan',
        price: 75,
        seats: 5,
        transmission: transmissionMap['Automatic'],
        fuel: fuelMap['Gasoline'],
        features: [
          featureMap['Bluetooth Connectivity'],
          featureMap['Parking Sensors'],
          featureMap['Apple CarPlay'],
          featureMap['Android Auto'],
          featureMap['Lane Departure Warning']
        ],
        images: [],
        status: 'available',
        rating: 4.5,
        reviewCount: 15,
        category: categoryMap['Compact']
      },
      {
        name: 'Tesla Model 3',
        brand: brandMap['Tesla'],
        model: 'Model 3',
        year: 2023,
        description: 'High-performance electric car with self-driving technology',
        price: 120,
        seats: 5,
        transmission: transmissionMap['Automatic'],
        fuel: fuelMap['Electric'],
        features: [
          featureMap['Touchscreen Navigation'],
          featureMap['Premium Sound System'],
          featureMap['Panoramic Sunroof'],
          featureMap['Wireless Charging'],
          featureMap['Heated Seats']
        ],
        images: [],
        status: 'available',
        rating: 4.8,
        reviewCount: 28,
        category: categoryMap['Electric']
      },
      {
        name: 'BMW X5',
        brand: brandMap['BMW'],
        model: 'X5',
        year: 2023,
        description: 'Luxury SUV with outstanding performance',
        price: 175,
        seats: 7,
        transmission: transmissionMap['Automatic'],
        fuel: fuelMap['Diesel'],
        features: [
          featureMap['Panoramic Sunroof'],
          featureMap['Leather Seats'],
          featureMap['Wireless Charging'],
          featureMap['Premium Sound System'],
          featureMap['Touchscreen Navigation']
        ],
        images: [],
        status: 'available',
        rating: 4.6,
        reviewCount: 22,
        category: categoryMap['SUV']
      },
      {
        name: 'Ford Mustang',
        brand: brandMap['Ford'],
        model: 'Mustang GT',
        year: 2023,
        description: 'Iconic American sports car',
        price: 150,
        seats: 4,
        transmission: transmissionMap['Manual'],
        fuel: fuelMap['Gasoline'],
        features: [
          featureMap['Sport Mode'],
          featureMap['Performance Exhaust'],
          featureMap['Leather Seats'],
          featureMap['Premium Sound System'],
          featureMap['Touchscreen Navigation']
        ],
        images: [],
        status: 'available',
        rating: 4.5,
        reviewCount: 12,
        category: categoryMap['Sports Car']
      },
      {
        name: 'Mercedes C-Class',
        brand: brandMap['Mercedes-Benz'],
        model: 'C300',
        year: 2022,
        description: 'Luxury sedan with advanced technology',
        price: 160,
        seats: 5,
        transmission: transmissionMap['Automatic'],
        fuel: fuelMap['Gasoline'],
        features: [
          featureMap['Touchscreen Navigation'],
          featureMap['Premium Sound System'],
          featureMap['Heated Seats'],
          featureMap['Ambient Lighting'],
          featureMap['Blind Spot Monitor']
        ],
        images: [],
        status: 'available',
        rating: 4.7,
        reviewCount: 18,
        category: categoryMap['Luxury']
      },
      {
        name: 'Toyota Prius',
        brand: brandMap['Toyota'],
        model: 'Prius',
        year: 2023,
        description: 'Fuel-efficient hybrid vehicle',
        price: 70,
        seats: 5,
        transmission: transmissionMap['CVT'],
        fuel: fuelMap['Hybrid'],
        features: [
          featureMap['Bluetooth Connectivity'],
          featureMap['Lane Departure Warning'],
          featureMap['Keyless Entry'],
          featureMap['Wireless Charging'],
          featureMap['Apple CarPlay']
        ],
        images: [],
        status: 'available',
        rating: 4.4,
        reviewCount: 14,
        category: categoryMap['Hybrid']
      }
    ];

    // Insert cars into database
    await Car.insertMany(carsData);
    console.log(`${carsData.length} cars seeded successfully`);
  } catch (error) {
    console.error('Error seeding cars:', error);
    throw error;
  }
};

module.exports = seedCars; 