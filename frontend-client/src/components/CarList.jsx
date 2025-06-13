import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCar, 
  FaArrowRight
} from 'react-icons/fa';
import CarCard from '@/components/CarCard';

const CarList = ({ cars = [], loading = false, categoryKey = null }) => {

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };



  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const carItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoother feel
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Always render the section to avoid layout shift
  const isEmpty = !cars || cars.length === 0;
  const showEmptyState = isEmpty && !loading;

  return (
    <section className="bg-white section">
      <div className="container">

        
        {/* Content Area with smooth transitions */}
        <div className="relative min-h-[400px]">
          {/* Subtle loading overlay */}
          <AnimatePresence>
            {loading && cars.length > 0 && (
              <motion.div
                key="loading-overlay"
                className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {loading && (
            <motion.div 
              key="loading"
              className="py-16 text-center"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mb-4 spinner-lg"></div>
              <p className="text-gray-600">Loading cars...</p>
            </motion.div>
          )}
          
          {/* Empty State */}
          {showEmptyState && (
            <motion.div 
              key="empty"
              className="py-16 text-center card"
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                <FaCar className="text-4xl text-gray-400" />
              </div>
              <h3 className="mb-4 text-gray-800 text-heading-lg">No Cars Available</h3>
              <p className="max-w-md mx-auto text-gray-600 text-body-lg">
                We're currently updating our fleet. Please check back soon for amazing vehicles!
              </p>
            </motion.div>
          )}
          
          {/* Cars Grid */}
          {!loading && cars.length > 0 && (
            <motion.div 
              key={`car-list-${categoryKey || 'featured'}`}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {cars.map((car, index) => (
                <motion.div
                  key={`car-${car._id}`}
                  variants={{
                    ...carItemVariants,
                    visible: {
                      ...carItemVariants.visible,
                      transition: {
                        ...carItemVariants.visible.transition,
                        delay: index * 0.05 // Staggered animation
                      }
                    }
                  }}
                  layout
                  layoutId={`car-${car._id}`}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                >
                  <CarCard car={car} viewMode="grid" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* View More Button */}
        <AnimatePresence>
          {!loading && cars.length >= 8 && (
            <motion.div 
              key="view-more-button"
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                delay: cars.length * 0.05 + 0.3,
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <Link href="/cars">
                <motion.button 
                  className="btn btn-primary btn-lg group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>View All Cars</span>
                  <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CarList; 