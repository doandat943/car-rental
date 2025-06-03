"use client";

import React, { useState, useEffect } from 'react';
import Banner from '@/components/Banner';
import CarList from '@/components/CarList';
import CategoryFilter from '@/components/CategoryFilter';
import { carsAPI, categoriesAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  FaRoute, 
  FaCalendarCheck, 
  FaCarSide, 
  FaSearch,
  FaHandshake,
  FaKey,
  FaQuoteLeft,
  FaStar,
  FaArrowRight,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Sample testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Traveler",
      content: "Excellent service and amazing cars! The booking process was seamless and the car was spotless.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b02c?ixlib=rb-4.0.3&w=150"
    },
    {
      name: "Michael Chen",
      role: "Family Vacation",
      content: "Perfect for our family trip. The SUV was spacious and comfortable. Highly recommend!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150"
    },
    {
      name: "Emma Davis",
      role: "Weekend Getaway",
      content: "Great selection of vehicles and competitive prices. Will definitely use again!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150"
    }
  ];

  if (loading && cars.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-light">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="spinner-xl mb-6"></div>
          <p className="text-heading-sm text-gray-700">Loading amazing cars for you...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      <Banner />
      
      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      
      {/* Featured Cars Section */}
      <section className="section bg-white">
        <div className="container">
      <CarList 
        cars={cars} 
            title={selectedCategory ? "Filtered Cars" : "Featured Cars"}
      />
          
      {error && (
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-heading-sm">Something went wrong</h3>
                    <p className="mt-1">{error}</p>
                  </div>
          </div>
        </div>
            </motion.div>
      )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="section bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="text-display-sm mb-6">How It Works</h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              Renting a car with us is quick and easy. Follow these simple steps to get on the road in no time.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <motion.div 
              className="card card-hover text-center"
              variants={itemVariants}
            >
              <div className="card-body">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                  <FaSearch size={32} />
                </div>
                <h3 className="text-heading-md mb-4">Choose Your Car</h3>
                <p className="text-body-md text-gray-600 leading-relaxed">
                  Browse our selection of vehicles and choose the perfect car for your needs and budget.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="card card-hover text-center"
              variants={itemVariants}
            >
              <div className="card-body">
                <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                  <FaCalendarCheck size={32} />
                </div>
                <h3 className="text-heading-md mb-4">Book & Pay</h3>
                <p className="text-body-md text-gray-600 leading-relaxed">
                  Select your dates, complete the booking process, and make secure payment online.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="card card-hover text-center"
              variants={itemVariants}
            >
              <div className="card-body">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                  <FaKey size={32} />
                </div>
                <h3 className="text-heading-md mb-4">Pick Up & Drive</h3>
                <p className="text-body-md text-gray-600 leading-relaxed">
                  Pick up your car at the designated location and enjoy your journey with confidence.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="text-display-sm mb-6">Why Choose Us</h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best car rental experience with premium service and unmatched reliability.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <motion.div 
              className="text-center group"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <MdSecurity size={28} />
              </div>
              <h3 className="text-heading-sm mb-3">Secure & Safe</h3>
              <p className="text-body-sm text-gray-600">All vehicles are thoroughly inspected and insured for your safety.</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <MdSupport size={28} />
              </div>
              <h3 className="text-heading-sm mb-3">24/7 Support</h3>
              <p className="text-body-sm text-gray-600">Round-the-clock customer support for any assistance you need.</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaHandshake size={28} />
              </div>
              <h3 className="text-heading-sm mb-3">Best Prices</h3>
              <p className="text-body-sm text-gray-600">Competitive rates with no hidden fees or surprise charges.</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaCarSide size={28} />
              </div>
              <h3 className="text-heading-sm mb-3">Premium Fleet</h3>
              <p className="text-body-sm text-gray-600">Wide selection of well-maintained, modern vehicles.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
            
      {/* Testimonials Section */}
      <section className="section bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container">
            <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
              viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="text-display-sm mb-6">What Our Customers Say</h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
            </p>
            </motion.div>
            
            <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
              viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="card card-hover"
                variants={itemVariants}
              >
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <FaQuoteLeft className="text-blue-500 text-xl mr-3" />
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
              </div>
                  <p className="text-body-md text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
              <div>
                      <h4 className="text-heading-sm">{testimonial.name}</h4>
                      <p className="text-body-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
              </div>
            </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section bg-gradient-primary text-white">
        <div className="container">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="text-display-sm mb-6">Ready to Hit the Road?</h2>
            <p className="text-body-lg mb-8 text-blue-100">
              Join thousands of satisfied customers and experience the best car rental service. 
              Book your perfect ride today and start your adventure!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-lg bg-white text-blue-600 hover:bg-gray-100 group">
                <span>Browse All Cars</span>
                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-blue-600">
                <FaPhone className="mr-2" />
                Call Us Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 