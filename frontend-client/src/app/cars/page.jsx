"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { carsAPI, categoriesAPI, brandsAPI, fuelsAPI, transmissionsAPI } from '@/lib/api';
import { API_BASE_URL } from '@/lib/api';
import { motion } from 'framer-motion';
import { FaFilter, FaCheck, FaCar } from 'react-icons/fa';
import CarCard from '@/components/car/CarCard';

// Helper function to process car data and handle nested objects
const processCarData = (car) => {
  if (!car) return null;
  
  // Create a new object to avoid mutating the original
  const processed = { ...car };
  
  // Process nested objects if they exist
  if (processed.brand && typeof processed.brand === 'object') {
    processed.brandName = processed.brand.name;
  }
  
  if (processed.category && typeof processed.category === 'object') {
    processed.categoryName = processed.category.name;
  }
  
  if (processed.fuel && typeof processed.fuel === 'object') {
    processed.fuelName = processed.fuel.name;
  }
  
  if (processed.transmission && typeof processed.transmission === 'object') {
    processed.transmissionName = processed.transmission.name;
  }
  
  return processed;
};

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    fuel: '',
    transmission: '',
    seats: '',
    priceRange: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterVisible, setFilterVisible] = useState(true);
  
  useEffect(() => {
    // Load initial data and available filter options
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch cars first
        const carsResponse = await carsAPI.getAllCars();
        const carsData = carsResponse?.data?.data || [];
        
        // Process each car to handle nested objects
        const processedCars = Array.isArray(carsData) 
          ? carsData.map(car => processCarData(car))
          : [];
          
        setCars(processedCars);
        
        // Fetch filter options - using Promise.allSettled to handle failing API endpoints
        const [categoriesResult, brandsResult, fuelsResult, transmissionsResult] = await Promise.allSettled([
          categoriesAPI.getAllCategories(),
          brandsAPI.getAllBrands(),
          fuelsAPI.getAllFuels(),
          transmissionsAPI.getAllTransmissions()
        ]);
        
        // Handle categories
        if (categoriesResult.status === 'fulfilled') {
          const categoriesData = categoriesResult.value?.data?.data || [];
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } else {
          console.error('Failed to fetch categories:', categoriesResult.reason);
          setCategories([]);
        }
        
        // Handle brands
        if (brandsResult.status === 'fulfilled') {
          const brandsData = brandsResult.value?.data?.data || [];
          setBrands(Array.isArray(brandsData) ? brandsData : []);
        } else {
          console.error('Failed to fetch brands:', brandsResult.reason);
          setBrands([]);
        }
        
        // Handle fuels
        if (fuelsResult.status === 'fulfilled') {
          const fuelsData = fuelsResult.value?.data?.data || [];
          setFuels(Array.isArray(fuelsData) ? fuelsData : []);
        } else {
          console.error('Failed to fetch fuels:', fuelsResult.reason);
          setFuels([]);
        }
        
        // Handle transmissions
        if (transmissionsResult.status === 'fulfilled') {
          const transmissionsData = transmissionsResult.value?.data?.data || [];
          setTransmissions(Array.isArray(transmissionsData) ? transmissionsData : []);
        } else {
          console.error('Failed to fetch transmissions:', transmissionsResult.reason);
          setTransmissions([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load cars. Please try again later.");
        setLoading(false);
        setCars([]);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Apply filters
  const applyFilters = async () => {
    try {
      setLoading(true);
      
      // Build params object from filters
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.fuel) params.fuel = filters.fuel;
      if (filters.transmission) params.transmission = filters.transmission;
      if (filters.seats) params.seats = filters.seats;
      
      // Handle price range
      if (filters.priceRange) {
        switch (filters.priceRange) {
          case 'budget':
            params.minPrice = 0;
            params.maxPrice = 75;
            break;
          case 'mid':
            params.minPrice = 75;
            params.maxPrice = 125;
            break;
          case 'premium':
            params.minPrice = 125;
            break;
        }
      }
      
      console.log('Filtering with params:', params);
      const response = await carsAPI.getAllCars(params);
      
      const carsData = response?.data?.data || [];
      
      // Process each car to handle nested objects
      const processedCars = Array.isArray(carsData) 
        ? carsData.map(car => processCarData(car))
        : [];
        
      setCars(processedCars);
    } catch (err) {
      console.error("Error filtering cars:", err);
      setError("Failed to filter cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for the page
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <motion.main 
      className="min-h-screen bg-gray-50 py-12"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="container mx-auto px-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-2">Available Cars</h1>
          <p className="text-gray-600 mb-8">Find and book your perfect rental car</p>
        </motion.div>
        
        {/* Filters */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button 
              onClick={() => setFilterVisible(!filterVisible)}
              className="flex items-center gap-2 text-primary hover:text-primary-dark"
            >
              <FaFilter />
              <span>{filterVisible ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>
          
          {filterVisible && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* First row */}
                <div>
                  <label className="block text-sm font-medium mb-2">Car Type</label>
                  <select 
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  >
                    <option value="">All Types</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <select 
                    name="brand"
                    value={filters.brand}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <select 
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  >
                    <option value="">Any Price</option>
                    <option value="budget">$0 - $75</option>
                    <option value="mid">$75 - $125</option>
                    <option value="premium">$125+</option>
                  </select>
                </div>
                
                {/* Second row */}
                <div>
                  <label className="block text-sm font-medium mb-2">Fuel</label>
                  <select 
                    name="fuel"
                    value={filters.fuel}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  >
                    <option value="">All Fuel Types</option>
                    {fuels.map(fuel => (
                      <option key={fuel._id} value={fuel._id}>
                        {fuel.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Transmission</label>
                  <select 
                    name="transmission"
                    value={filters.transmission}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  >
                    <option value="">All Transmissions</option>
                    {transmissions.map(transmission => (
                      <option key={transmission._id} value={transmission._id}>
                        {transmission.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Seats</label>
                  <select 
                    name="seats"
                    value={filters.seats}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  >
                    <option value="">Any Seats</option>
                    <option value="2">2 Seats</option>
                    <option value="4">4 Seats</option>
                    <option value="5">5 Seats</option>
                    <option value="7">7+ Seats</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={applyFilters}
                    className="bg-primary text-white w-full px-6 py-2 rounded hover:bg-primary-dark transition flex justify-center items-center gap-2"
                  >
                    <FaCheck />
                    <span>Apply Filters</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Cars List */}
        <motion.div variants={itemVariants}>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5">
              <p>{error}</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaCar className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Cars Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any cars matching your criteria. Try adjusting your filters.
              </p>
              <button 
                onClick={() => {
                  setFilters({
                    category: '',
                    brand: '',
                    fuel: '',
                    transmission: '',
                    seats: '',
                    priceRange: ''
                  });
                  applyFilters();
                }}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">Found {cars.length} car{cars.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map(car => (
                  <motion.div 
                    key={car._id}
                    variants={itemVariants}
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.main>
  );
} 