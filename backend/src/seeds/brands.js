const mongoose = require('mongoose');
const { Brand } = require('../models');

/**
 * Seeds the database with initial car brand data
 */
const seedBrands = async () => {
  try {
    // Check if brands already exist in the database
    const count = await Brand.countDocuments();
    if (count > 0) {
      console.log('Brands already seeded');
      return;
    }

    // Sample brands data
    const brandsData = [
      {
        name: 'Toyota',
        description: 'Japanese car manufacturer known for reliability and durability'
      },
      {
        name: 'Honda',
        description: 'Japanese car manufacturer with a reputation for quality and efficiency'
      },
      {
        name: 'Ford',
        description: 'American automobile manufacturer with a diverse range of vehicles'
      },
      {
        name: 'BMW',
        description: 'German luxury car manufacturer focusing on performance and technology'
      },
      {
        name: 'Mercedes-Benz',
        description: 'German luxury car manufacturer with a focus on comfort and innovation'
      },
      {
        name: 'Audi',
        description: 'German luxury automaker known for sophisticated design and engineering'
      },
      {
        name: 'Tesla',
        description: 'American electric vehicle manufacturer pioneering sustainable transport'
      },
      {
        name: 'Chevrolet',
        description: 'American automobile division of GM offering a wide range of vehicles'
      },
      {
        name: 'Hyundai',
        description: 'South Korean car manufacturer known for value and warranty'
      },
      {
        name: 'Nissan',
        description: 'Japanese automobile manufacturer with a global presence'
      }
    ];

    // Insert brands into the database
    const createdBrands = await Brand.insertMany(brandsData);
    
    console.log(`${createdBrands.length} brands seeded successfully`);
    return createdBrands;
  } catch (error) {
    console.error('Error seeding brands:', error);
    throw error;
  }
};

module.exports = seedBrands; 