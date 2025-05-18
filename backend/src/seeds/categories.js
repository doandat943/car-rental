const mongoose = require('mongoose');
const { Category } = require('../models');

/**
 * Seeds the database with initial car categories
 * This function is also called from cars.js, but here we make it a standalone module
 */
const seedCategories = async () => {
  try {
    // Check if categories already exist in the database
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log('Categories already seeded');
      return;
    }

    // Sample categories data
    const categoriesData = [
      { name: 'Sedan', description: 'Traditional four-door car with separate trunk' },
      { name: 'SUV', description: 'Sport Utility Vehicle with elevated seating and robust design' },
      { name: 'Compact', description: 'Small, fuel-efficient cars perfect for city driving' },
      { name: 'Luxury', description: 'Premium vehicles with high-end features and comfort' },
      { name: 'Sports Car', description: 'High-performance vehicles built for speed and handling' },
      { name: 'Electric', description: 'Fully electric vehicles with zero emissions' },
      { name: 'Hybrid', description: 'Vehicles with both conventional engine and electric motor' },
      { name: 'Convertible', description: 'Cars with retractable roofs for open-air driving' },
      { name: 'Minivan', description: 'Family-oriented vehicles with spacious interiors and flexible seating' },
      { name: 'Truck', description: 'Utility vehicles with open cargo area' }
    ];

    // Insert categories into the database
    const createdCategories = await Category.insertMany(categoriesData);
    
    console.log(`${createdCategories.length} categories seeded successfully`);
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

module.exports = seedCategories; 