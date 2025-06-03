import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaCar, 
  FaArrowRight
} from 'react-icons/fa';
import CarCard from '@/components/CarCard';

const CarList = ({ cars = [], title = "Our Cars" }) => {
  console.log("Cars passed to CarList:", cars);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  if (!cars || cars.length === 0) {
    return (
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={titleVariants}
          >
            <h2 className="text-display-sm text-center mb-12">{title}</h2>
          </motion.div>
          
          <motion.div 
            className="card text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <FaCar className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-heading-lg text-gray-800 mb-4">No Cars Available</h3>
            <p className="text-body-lg text-gray-600 max-w-md mx-auto">
              We're currently updating our fleet. Please check back soon for amazing vehicles!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-white">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={titleVariants}
          className="text-center mb-12"
        >
          <h2 className="text-display-sm mb-4">{title}</h2>
          <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of vehicles, each carefully selected for quality and performance.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {cars.map((car, index) => (
            <motion.div
              key={car._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }
                }
              }}
            >
              <CarCard car={car} viewMode="grid" />
            </motion.div>
          ))}
        </motion.div>
        
        {/* View More Button */}
        {cars.length >= 8 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/cars">
              <button className="btn btn-primary btn-lg group">
                <span>View All Cars</span>
                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CarList; 