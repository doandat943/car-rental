'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaClock, 
  FaShieldAlt, 
  FaDollarSign,
  FaPlay,
  FaStar,
  FaUsers
} from 'react-icons/fa';

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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const statsData = [
    { number: "5000+", label: "Happy Customers" },
    { number: "500+", label: "Cars Available" },
    { number: "4.9", label: "Rating", icon: FaStar },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-hero">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-900/95 via-blue-800/85 to-indigo-900/90"></div>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
            opacity: 0.3
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 min-h-screen flex flex-col justify-center">
        <motion.div 
          className="max-w-4xl text-white"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Hero Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <FaStar className="text-yellow-400" />
              <span className="text-sm font-medium">Premium Car Rental Service</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-display-lg md:text-display-lg font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
              Perfect Ride
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-body-lg md:text-xl mb-8 text-blue-100 max-w-2xl leading-relaxed"
            variants={itemVariants}
          >
            Explore our premium selection of vehicles and book your dream car today.
            Affordable rates, reliable service, unforgettable experience.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-12"
            variants={itemVariants}
          >
            <Link href="/cars">
              <button className="btn btn-primary btn-lg group">
                <span>Browse Cars</span>
                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="#how-it-works">
              <button className="btn btn-outline btn-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-800">
                <FaPlay className="mr-2" />
                How It Works
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12"
            variants={itemVariants}
          >
            {statsData.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center sm:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="text-heading-lg font-bold text-blue-200">{stat.number}</span>
                  {stat.icon && <stat.icon className="text-yellow-400" />}
                </div>
                <p className="text-blue-100 text-body-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Key Benefits */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            <div className="card bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="card-body p-6 text-center">
                <div className="w-14 h-14 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-blue-200 mb-4 mx-auto">
                  <FaClock size={24} />
                </div>
                <h3 className="text-heading-sm font-semibold mb-2">24/7 Support</h3>
                <p className="text-body-sm text-blue-100">Always available when you need us</p>
              </div>
            </div>
            
            <div className="card bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="card-body p-6 text-center">
                <div className="w-14 h-14 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-green-200 mb-4 mx-auto">
                  <FaShieldAlt size={24} />
                </div>
                <h3 className="text-heading-sm font-semibold mb-2">Verified Vehicles</h3>
                <p className="text-body-sm text-blue-100">Quality guaranteed for your safety</p>
              </div>
            </div>
            
            <div className="card bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="card-body p-6 text-center">
                <div className="w-14 h-14 bg-yellow-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-yellow-200 mb-4 mx-auto">
                  <FaDollarSign size={24} />
                </div>
                <h3 className="text-heading-sm font-semibold mb-2">Best Rates</h3>
                <p className="text-body-sm text-blue-100">Guaranteed competitive pricing</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      
      {/* Floating Decorative Circles */}
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl"></div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-body-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Banner; 