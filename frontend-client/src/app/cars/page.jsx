"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { carsAPI, categoriesAPI, brandsAPI, fuelsAPI, transmissionsAPI } from '@/lib/api';
import { API_BASE_URL } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  FaFilter, 
  FaCheck, 
  FaCar, 
  FaSearch, 
  FaTimes,
  FaChevronDown,
  FaMapMarkerAlt,
  FaUsers,
  FaCog,
  FaGasPump,
  FaTag
} from 'react-icons/fa';
import CarCard from '@/components/CarCard';

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
  const [filteredCars, setFilteredCars] = useState([]);
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
    priceRange: '',
    search: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
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
        setFilteredCars(processedCars);
        
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
        setFilteredCars([]);
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
  
  // Apply filters locally for better performance
  useEffect(() => {
    let filtered = [...cars];
    
    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (car.brandName && car.brandName.toLowerCase().includes(filters.search.toLowerCase())) ||
        (car.categoryName && car.categoryName.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(car => 
        car.category === filters.category || 
        (car.category && car.category._id === filters.category)
      );
    }
    
    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(car => 
        car.brand === filters.brand || 
        (car.brand && car.brand._id === filters.brand)
      );
    }
    
    // Apply fuel filter
    if (filters.fuel) {
      filtered = filtered.filter(car => 
        car.fuel === filters.fuel || 
        (car.fuel && car.fuel._id === filters.fuel)
      );
    }
    
    // Apply transmission filter
    if (filters.transmission) {
      filtered = filtered.filter(car => 
        car.transmission === filters.transmission || 
        (car.transmission && car.transmission._id === filters.transmission)
      );
    }
    
    // Apply seats filter
    if (filters.seats) {
      filtered = filtered.filter(car => car.seats == filters.seats);
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'budget':
          filtered = filtered.filter(car => car.price <= 75);
          break;
        case 'mid':
          filtered = filtered.filter(car => car.price > 75 && car.price <= 125);
          break;
        case 'premium':
          filtered = filtered.filter(car => car.price > 125);
          break;
      }
    }
    
    setFilteredCars(filtered);
  }, [cars, filters]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      fuel: '',
      transmission: '',
      seats: '',
      priceRange: '',
      search: ''
    });
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
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
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16"
        variants={itemVariants}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Find Your Perfect Rental Car
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-blue-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Choose from our premium fleet of vehicles for your next adventure
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by car name, brand, or type..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 text-gray-800 rounded-full border-0 shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        {/* Filter and Results Header */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Cars
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'})
              </span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Filter Toggle */}
            <button 
              onClick={() => setFilterVisible(!filterVisible)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FaFilter className="text-blue-600" />
              <span>Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
              <FaChevronDown className={`transform transition-transform ${filterVisible ? 'rotate-180' : ''}`} />
            </button>
            
            {/* View Mode Toggle */}
            <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Advanced Filters */}
        {filterVisible && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaFilter className="text-blue-600" />
                Advanced Filters
              </h3>
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <FaTimes />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaTag className="text-blue-600" />
                  Car Type
                </label>
                <select 
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Types</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaCar className="text-blue-600" />
                  Brand
                </label>
                <select 
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">$</span>
                  Price Range
                </label>
                <select 
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Any Price</option>
                  <option value="budget">Budget ($0 - $75)</option>
                  <option value="mid">Mid-range ($75 - $125)</option>
                  <option value="premium">Premium ($125+)</option>
                </select>
              </div>

              {/* Seats Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaUsers className="text-blue-600" />
                  Seats
                </label>
                <select 
                  name="seats"
                  value={filters.seats}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Any Seats</option>
                  <option value="2">2 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="7">7+ Seats</option>
                </select>
              </div>

              {/* Fuel Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaGasPump className="text-blue-600" />
                  Fuel Type
                </label>
                <select 
                  name="fuel"
                  value={filters.fuel}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Fuel Types</option>
                  {fuels.map(fuel => (
                    <option key={fuel._id} value={fuel._id}>
                      {fuel.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaCog className="text-blue-600" />
                  Transmission
                </label>
                <select 
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Transmissions</option>
                  {transmissions.map(transmission => (
                    <option key={transmission._id} value={transmission._id}>
                      {transmission.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Cars List */}
        <motion.div variants={itemVariants}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading amazing cars for you...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">Oops! Something went wrong</h3>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <FaCar className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Cars Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any cars matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
                <Link 
                  href="/"
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredCars.map((car, index) => (
                <motion.div 
                  key={car._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CarCard car={car} viewMode={viewMode} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
} 