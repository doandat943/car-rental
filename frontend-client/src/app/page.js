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
  const [pendingCategory, setPendingCategory] = useState(null); // Track category being loaded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await categoriesAPI.getAllCategories();
        
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
          ? carsData.map(car => {
              if (!car) return null;
              
              return {
                ...car,
                brand: typeof car.brand === 'object' ? car.brand.name : car.brand,
                model: typeof car.model === 'object' ? car.model.name : car.model,
                category: typeof car.category === 'object' ? car.category.name : car.category,
                transmission: typeof car.transmission === 'object' ? car.transmission.name : car.transmission,
                fuel: typeof car.fuel === 'object' ? car.fuel.name : car.fuel,
                features: Array.isArray(car.features) 
                  ? car.features.map(feature => typeof feature === 'object' ? feature.name : feature)
                  : car.features || []
              };
            }).filter(car => car !== null)
          : [];
        
        setCars(processedCars);
        
        // Ensure no pending category on initial load
        setPendingCategory(null);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to handle category selection
  const handleSelectCategory = async (categoryId) => {
    // Prevent unnecessary re-selection of the same category
    if (selectedCategory === categoryId && pendingCategory === null) {
      return;
    }
    
    // Set pending category immediately to prevent UI mismatch
    setPendingCategory(categoryId);
    setError(null); // Clear any previous errors
    
    // Only show loading if we don't have any cars currently displayed
    // This prevents the flash when switching between categories
    const shouldShowLoading = cars.length === 0;
    if (shouldShowLoading) {
      setLoading(true);
    }
    
    try {
      let params = {};
      if (categoryId) {
        params.category = categoryId;
      } else {
        // If no category selected, get featured cars
        params.featured = true;
        params.limit = 8;
      }
      
      const response = await carsAPI.getAllCars(params);
      
      // Check return data structure
      const carsData = response?.data?.data || 
                      response?.data || 
                      [];
      
      // Process cars to ensure references are properly handled
      const processedCars = Array.isArray(carsData)
        ? carsData.map(car => {
            if (!car) return null;
            
            return {
              ...car,
              brand: typeof car.brand === 'object' ? car.brand.name : car.brand,
              model: typeof car.model === 'object' ? car.model.name : car.model,
              category: typeof car.category === 'object' ? car.category.name : car.category,
              transmission: typeof car.transmission === 'object' ? car.transmission.name : car.transmission,
              fuel: typeof car.fuel === 'object' ? car.fuel.name : car.fuel,
              features: Array.isArray(car.features) 
                ? car.features.map(feature => typeof feature === 'object' ? feature.name : feature)
                : car.features || []
            };
          }).filter(car => car !== null)
        : [];
      
      // Update both cars and selectedCategory atomically
      setCars(processedCars);
      setSelectedCategory(categoryId);
      setPendingCategory(null); // Clear pending state
      
    } catch (err) {
      setError("Failed to filter cars. Please try again later.");
      setCars([]); // Clear cars on error
      setPendingCategory(null); // Clear pending state on error
    } finally {
      // Always clear loading state
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

  // Only show full page loading on initial load
  if (loading && cars.length === 0 && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-light">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 spinner-xl"></div>
          <p className="text-gray-700 text-heading-sm">Loading amazing cars for you...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      <Banner />
      
      <CategoryFilter 
        categories={categories} 
        selectedCategory={pendingCategory || selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      
      {/* Featured Cars Section */}
      <CarList 
        cars={cars} 
        loading={loading || pendingCategory !== null}
        categoryKey={pendingCategory || selectedCategory}
      />
          
      {error && (
        <section className="bg-white section">
          <div className="container">
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-6 text-red-700 border-l-4 border-red-500 rounded-lg bg-red-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
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
          </div>
        </section>
      )}
      
      {/* How It Works Section */}
      <section id="how-it-works" className="section bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container">
          <motion.div 
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="mb-6 text-display-sm">How It Works</h2>
            <p className="max-w-3xl mx-auto text-gray-600 text-body-lg">
              Renting a car with us is quick and easy. Follow these simple steps to get on the road in no time.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <motion.div 
              className="text-center card card-hover"
              variants={itemVariants}
            >
              <div className="card-body">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-white shadow-lg bg-gradient-primary rounded-2xl">
                  <FaSearch size={32} />
                </div>
                <h3 className="mb-4 text-heading-md">Choose Your Car</h3>
                <p className="leading-relaxed text-gray-600 text-body-md">
                  Browse our selection of vehicles and choose the perfect car for your needs and budget.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center card card-hover"
              variants={itemVariants}
            >
              <div className="card-body">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-white shadow-lg bg-gradient-secondary rounded-2xl">
                  <FaCalendarCheck size={32} />
                </div>
                <h3 className="mb-4 text-heading-md">Book & Pay</h3>
                <p className="leading-relaxed text-gray-600 text-body-md">
                  Select your dates, complete the booking process, and make secure payment online.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center card card-hover"
              variants={itemVariants}
            >
              <div className="card-body">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-white shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
                  <FaKey size={32} />
                </div>
                <h3 className="mb-4 text-heading-md">Pick Up & Drive</h3>
                <p className="leading-relaxed text-gray-600 text-body-md">
                  Pick up your car at the designated location and enjoy your journey with confidence.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="bg-white section">
        <div className="container">
          <motion.div 
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="mb-6 text-display-sm">Why Choose Us</h2>
            <p className="max-w-3xl mx-auto text-gray-600 text-body-lg">
              We're committed to providing the best car rental experience with premium service and unmatched reliability.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <motion.div 
              className="text-center group"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-600 transition-transform duration-300 bg-blue-100 rounded-2xl group-hover:scale-110">
                <MdSecurity size={28} />
              </div>
              <h3 className="mb-3 text-heading-sm">Secure & Safe</h3>
              <p className="text-gray-600 text-body-sm">All vehicles are thoroughly inspected and insured for your safety.</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-green-600 transition-transform duration-300 bg-green-100 rounded-2xl group-hover:scale-110">
                <MdSupport size={28} />
              </div>
              <h3 className="mb-3 text-heading-sm">24/7 Support</h3>
              <p className="text-gray-600 text-body-sm">Round-the-clock customer support for any assistance you need.</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-yellow-600 transition-transform duration-300 bg-yellow-100 rounded-2xl group-hover:scale-110">
                <FaHandshake size={28} />
              </div>
              <h3 className="mb-3 text-heading-sm">Best Prices</h3>
              <p className="text-gray-600 text-body-sm">Competitive rates with no hidden fees or surprise charges.</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-purple-600 transition-transform duration-300 bg-purple-100 rounded-2xl group-hover:scale-110">
                <FaCarSide size={28} />
              </div>
              <h3 className="mb-3 text-heading-sm">Premium Fleet</h3>
              <p className="text-gray-600 text-body-sm">Wide selection of well-maintained, modern vehicles.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
            
      {/* Testimonials Section */}
      <section className="section bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container">
            <motion.div 
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
              viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="mb-6 text-display-sm">What Our Customers Say</h2>
            <p className="max-w-3xl mx-auto text-gray-600 text-body-lg">
              Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
            </p>
            </motion.div>
            
            <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
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
                    <FaQuoteLeft className="mr-3 text-xl text-blue-500" />
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
              </div>
                  <p className="mb-6 italic leading-relaxed text-gray-700 text-body-md">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="object-cover w-12 h-12 mr-4 rounded-full"
                    />
              <div>
                      <h4 className="text-heading-sm">{testimonial.name}</h4>
                      <p className="text-gray-500 text-body-sm">{testimonial.role}</p>
                    </div>
                  </div>
              </div>
            </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="text-white section bg-gradient-primary">
        <div className="container">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h2 className="mb-6 text-display-sm">Ready to Hit the Road?</h2>
            <p className="mb-8 text-blue-100 text-body-lg">
              Join thousands of satisfied customers and experience the best car rental service. 
              Book your perfect ride today and start your adventure!
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="text-blue-600 bg-white btn btn-lg hover:bg-gray-100 group">
                <span>Browse All Cars</span>
                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="text-white border-white btn btn-outline btn-lg hover:bg-white hover:text-blue-600">
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