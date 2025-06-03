'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCar, 
  FaTaxi, 
  FaTruck, 
  FaCarSide,
  FaFilter,
  FaChevronRight 
} from 'react-icons/fa';
import { GiElectric, GiRaceCar, GiJeep } from 'react-icons/gi';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

// Map category names to icons with colors
const categoryConfig = {
  sedan: { 
    icon: <FaCarSide className="text-xl" />, 
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  suv: { 
    icon: <GiJeep className="text-xl" />, 
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-600'
  },
  truck: { 
    icon: <FaTruck className="text-xl" />, 
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-600'
  },
  sports: { 
    icon: <GiRaceCar className="text-xl" />, 
    color: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-600'
  },
  luxury: { 
    icon: <FaCar className="text-xl" />, 
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600'
  },
  electric: { 
    icon: <GiElectric className="text-xl" />, 
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600'
  },
  hybrid: { 
    icon: <GiElectric className="text-xl" />, 
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    text: 'text-teal-600'
  },
  minivan: { 
    icon: <MdAirlineSeatReclineNormal className="text-xl" />, 
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600'
  },
  convertible: { 
    icon: <FaCarSide className="text-xl" />, 
    color: 'from-yellow-500 to-yellow-600',
    bg: 'bg-yellow-50',
    text: 'text-yellow-600'
  },
  default: { 
    icon: <FaCar className="text-xl" />, 
    color: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    text: 'text-gray-600'
  }
};

const getCategoryConfig = (categoryName) => {
  if (!categoryName) return categoryConfig.default;
  
  const key = categoryName.toLowerCase().replace(/\s+/g, '');
  return categoryConfig[key] || categoryConfig.default;
};

const CategoryFilter = ({ categories = [], selectedCategory, onSelectCategory }) => {
  // Ensure categories is an array
  const categoriesList = Array.isArray(categories) ? categories : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  return (
    <section className="bg-white shadow-sm border-b border-gray-100">
      <div className="container section-sm">
        <motion.div 
          className="mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={titleVariants}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
              <FaFilter className="text-lg" />
            </div>
            <div>
              <h2 className="text-heading-lg">Browse by Category</h2>
              <p className="text-body-md text-gray-600">Find your perfect car by category</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap items-center gap-4 justify-center lg:justify-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* All Cars Button */}
          <motion.button
            variants={itemVariants}
            onClick={() => onSelectCategory(null)}
            className={`group relative overflow-hidden px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              !selectedCategory 
                ? 'bg-gradient-primary text-white shadow-lg hover:shadow-xl' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                !selectedCategory ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
              }`}>
                <FaCar className="text-lg" />
              </div>
              <div className="text-left">
                <span className="font-semibold block">All Cars</span>
                <span className="text-sm opacity-75">View all vehicles</span>
              </div>
              <FaChevronRight className={`text-sm transition-transform ${
                !selectedCategory ? 'group-hover:translate-x-1' : 'group-hover:translate-x-1'
              }`} />
            </div>
            
            {/* Animated background for selected state */}
            {!selectedCategory && (
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </motion.button>
          
          {/* Category Buttons */}
          {categoriesList.map((category) => {
            const config = getCategoryConfig(category.name);
            const isSelected = selectedCategory === (category.id || category._id);
            
            return (
              <motion.button
                variants={itemVariants}
                key={category.id || category._id}
                onClick={() => onSelectCategory(category.id || category._id)}
                className={`group relative overflow-hidden px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg hover:shadow-xl`
                    : `${config.bg} ${config.text} hover:shadow-md border border-gray-200 hover:border-gray-300`
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-white/20' : 'bg-white'
                  }`}>
                    <div className={isSelected ? 'text-white' : config.text}>
                      {config.icon}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">{category.name}</span>
                    <span className="text-sm opacity-75">Premium selection</span>
                  </div>
                  <FaChevronRight className={`text-sm transition-transform group-hover:translate-x-1 ${
                    isSelected ? 'text-white/75' : 'text-gray-400'
                  }`} />
                </div>
                
                {/* Animated background for hover state */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 opacity-0 group-active:opacity-30 bg-white transition-opacity duration-150"></div>
              </motion.button>
            );
          })}
        </motion.div>
        
        {/* Category Count Info */}
        {categoriesList.length > 0 && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-body-sm text-gray-500">
              Choose from <span className="font-semibold text-blue-600">{categoriesList.length + 1}</span> categories
              {selectedCategory && (
                <span className="ml-2 text-gray-400">
                  • Currently viewing: <span className="font-medium">{
                    categoriesList.find(cat => (cat.id || cat._id) === selectedCategory)?.name || 'Category'
                  }</span>
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoryFilter; 