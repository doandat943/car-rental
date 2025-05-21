'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Banner = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [
    '/images/banner-car-1.jpg',
    '/images/banner-car-2.jpg',
    '/images/banner-car-3.jpg'
  ];

  // Simulate background image rotation for a dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative h-[650px] md:h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-900/90 to-blue-900/60">
        {/* Add placeholder for background image (in production, use actual images) */}
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
             style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
                opacity: 0.7
             }}>
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 h-full mx-auto px-6 flex flex-col justify-center">
        <motion.div 
          className="max-w-2xl text-white"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            Find Your <span className="text-primary">Perfect Ride</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl mb-8 text-gray-200"
            variants={itemVariants}
          >
            Explore our premium selection of vehicles and book your dream car today.
            Affordable rates, reliable service, unforgettable experience.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
          >
            <Link href="/cars">
              <button className="btn btn-primary py-3 px-8 rounded-full text-lg font-semibold flex items-center gap-2">
                Browse Cars
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </Link>
            <Link href="#how-it-works">
              <button className="btn btn-outline py-3 px-8 rounded-full text-lg font-semibold border-2">
                How It Works
              </button>
            </Link>
          </motion.div>
          
          {/* Key Benefits */}
          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">24/7 Support</p>
                <p className="text-sm text-gray-300">Always available</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Verified Vehicles</p>
                <p className="text-sm text-gray-300">Quality guaranteed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Best Rates</p>
                <p className="text-sm text-gray-300">Guaranteed pricing</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute bottom-0 right-0 w-full h-20 bg-gradient-to-t from-gray-50 to-transparent z-0"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5 z-0"></div>
      <div className="absolute top-20 right-20 w-20 h-20 rounded-full bg-white/10 z-0"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-white/10 z-0"></div>
    </div>
  );
};

export default Banner; 