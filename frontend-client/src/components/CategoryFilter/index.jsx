'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaTaxi, FaTruck, FaCarSide } from 'react-icons/fa';
import { GiElectric, GiRaceCar, GiJeep } from 'react-icons/gi';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

// Map category names to icons
const categoryIcons = {
  sedan: <FaCarSide className="text-xl" />,
  suv: <GiJeep className="text-xl" />,
  truck: <FaTruck className="text-xl" />,
  sports: <GiRaceCar className="text-xl" />,
  luxury: <FaCar className="text-xl" />,
  electric: <GiElectric className="text-xl" />,
  hybrid: <GiElectric className="text-xl" />,
  minivan: <MdAirlineSeatReclineNormal className="text-xl" />,
  convertible: <FaCarSide className="text-xl" />,
  default: <FaCar className="text-xl" />
};

const getIconForCategory = (categoryName) => {
  if (!categoryName) return categoryIcons.default;
  
  const key = categoryName.toLowerCase().replace(/\s+/g, '');
  return categoryIcons[key] || categoryIcons.default;
};

const CategoryFilter = ({ categories = [], selectedCategory, onSelectCategory }) => {
  // Ensure categories is an array
  const categoriesList = Array.isArray(categories) ? categories : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <div className="bg-white shadow-sm py-8">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Browse by Category</h2>
          <p className="text-gray-600">Find your perfect car by category</p>
        </div>
        
        <motion.div 
          className="flex flex-wrap items-center gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            variants={itemVariants}
            onClick={() => onSelectCategory(null)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
              !selectedCategory 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCar className="text-xl" />
            <span>All Cars</span>
          </motion.button>
          
          {categoriesList.map((category) => (
            <motion.button
              variants={itemVariants}
              key={category.id || category._id}
              onClick={() => onSelectCategory(category.id || category._id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === (category.id || category._id)
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getIconForCategory(category.name)}
              <span>{category.name}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryFilter; 