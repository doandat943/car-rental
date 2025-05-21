"use client";

import React, { useState, useEffect } from 'react';
import Banner from '@/components/Banner';
import CarList from '@/components/CarList';
import CategoryFilter from '@/components/CategoryFilter';
import { carsAPI, categoriesAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { FaRoute, FaCalendarCheck, FaCarSide } from 'react-icons/fa';
import { MdSecurity, MdSupport, MdLocationOn } from 'react-icons/md';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await categoriesAPI.getAllCategories();
        console.log('Categories API response:', categoriesResponse);
        
        // Check data structure and ensure it's an array
        const categoriesData = categoriesResponse?.data?.data || 
                              categoriesResponse?.data || 
                              [];
        
        // Process categories to ensure they're properly formatted
        const processedCategories = Array.isArray(categoriesData) 
          ? categoriesData.map(category => ({
              id: category._id || category.id,
              name: category.name
            }))
          : [];
        
        setCategories(processedCategories);
        
        // Fetch cars (featured or all)
        const carsResponse = await carsAPI.getAllCars({ featured: true, limit: 8 });
        
        // Check data structure and ensure it's an array
        const carsData = carsResponse?.data?.data || 
                        carsResponse?.data || 
                        [];
        
        // Process cars to ensure references are properly handled
        const processedCars = Array.isArray(carsData)
          ? carsData.map(car => ({
              ...car,
              brand: typeof car.brand === 'object' ? car.brand.name : car.brand,
              model: typeof car.model === 'object' ? car.model.name : car.model,
              category: typeof car.category === 'object' ? car.category.name : car.category,
              transmission: typeof car.transmission === 'object' ? car.transmission.name : car.transmission,
              fuel: typeof car.fuel === 'object' ? car.fuel.name : car.fuel,
              features: Array.isArray(car.features) 
                ? car.features.map(feature => typeof feature === 'object' ? feature.name : feature)
                : car.features
            }))
          : [];
            
        setCars(processedCars);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to handle category selection
  const handleSelectCategory = async (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    
    try {
      const params = categoryId ? { category: categoryId } : {};
      const response = await carsAPI.getAllCars(params);
      
      // Check return data structure
      const carsData = response?.data?.data || 
                      response?.data || 
                      [];
      
      // Process cars to ensure references are properly handled
      const processedCars = Array.isArray(carsData)
        ? carsData.map(car => ({
            ...car,
            brand: typeof car.brand === 'object' ? car.brand.name : car.brand,
            model: typeof car.model === 'object' ? car.model.name : car.model,
            category: typeof car.category === 'object' ? car.category.name : car.category,
            transmission: typeof car.transmission === 'object' ? car.transmission.name : car.transmission,
            fuel: typeof car.fuel === 'object' ? car.fuel.name : car.fuel,
            features: Array.isArray(car.features) 
              ? car.features.map(feature => typeof feature === 'object' ? feature.name : feature)
              : car.features
          }))
        : [];
          
      setCars(processedCars);
    } catch (err) {
      console.error("Error filtering cars:", err);
      setError("Failed to filter cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (loading && cars.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-gray-700">Loading amazing cars for you...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Banner />
      
      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      
      <section className="py-16 px-6">
        <div className="container mx-auto">
      <CarList 
        cars={cars} 
            title={selectedCategory ? "Filtered Cars" : "Featured Cars"}
      />
          
      {error && (
            <div className="mt-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Renting a car with us is quick and easy. Follow these simple steps to get on the road in no time.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                <MdLocationOn size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Choose Your Car</h3>
              <p className="text-gray-600">
                Browse our selection of vehicles and choose the perfect car for your needs and budget.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                <FaCalendarCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Make a Reservation</h3>
              <p className="text-gray-600">
                Select your pickup and return dates, add any additional services, and confirm your booking.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                <FaCarSide size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Enjoy Your Ride</h3>
              <p className="text-gray-600">
                Pick up your car at the designated location and enjoy your journey with our well-maintained vehicles.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We pride ourselves on providing exceptional service and value for our customers.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary flex-shrink-0">
                <FaRoute size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Flexible Rental Options</h3>
                <p className="text-gray-600">
                  Choose from daily, weekly, or monthly rental options to suit your travel needs and budget.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary flex-shrink-0">
                <MdSecurity size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Well-Maintained Vehicles</h3>
                <p className="text-gray-600">
                  All of our cars undergo regular maintenance and thorough cleaning for your safety and comfort.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary flex-shrink-0">
                <MdSupport size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">24/7 Customer Support</h3>
                <p className="text-gray-600">
                  Our customer service team is available around the clock to assist you with any questions or concerns.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">
                  No hidden fees or surprises. Our pricing is straightforward and competitive.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Easy Booking Process</h3>
                <p className="text-gray-600">
                  Our user-friendly platform makes booking a car quick and hassle-free.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Convenient Locations</h3>
                <p className="text-gray-600">
                  Multiple pickup and drop-off locations across the city for your convenience.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Hit the Road?</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Browse our collection of premium vehicles and find the perfect car for your next adventure.
            </p>
            <a 
              href="/cars" 
              className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              Explore All Cars
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
} 