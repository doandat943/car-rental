"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { carsAPI, categoriesAPI, brandsAPI, fuelsAPI, transmissionsAPI } from '@/lib/api';
import { API_BASE_URL } from '@/lib/api';

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
  
  useEffect(() => {
    // Load initial data and available filter options
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch cars
        const carsResponse = await carsAPI.getAllCars();
        const carsData = carsResponse?.data?.data || [];
        setCars(Array.isArray(carsData) ? carsData : []);
        
        // Fetch categories for filters
        const categoriesResponse = await categoriesAPI.getAllCategories();
        const categoriesData = categoriesResponse?.data?.data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
        // Fetch brands for filters (if API available)
        try {
          const brandsResponse = await brandsAPI.getAllBrands();
          const brandsData = brandsResponse?.data?.data || [];
          setBrands(Array.isArray(brandsData) ? brandsData : []);
        } catch (err) {
          console.error('Failed to fetch brands:', err);
          setBrands([]);
        }
        
        // Fetch fuels for filters (if API available)
        try {
          const fuelsResponse = await fuelsAPI.getAllFuels();
          const fuelsData = fuelsResponse?.data?.data || [];
          setFuels(Array.isArray(fuelsData) ? fuelsData : []);
        } catch (err) {
          console.error('Failed to fetch fuels:', err);
          setFuels([]);
        }
        
        // Fetch transmissions for filters (if API available)
        try {
          const transmissionsResponse = await transmissionsAPI.getAllTransmissions();
          const transmissionsData = transmissionsResponse?.data?.data || [];
          setTransmissions(Array.isArray(transmissionsData) ? transmissionsData : []);
        } catch (err) {
          console.error('Failed to fetch transmissions:', err);
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
      setCars(Array.isArray(carsData) ? carsData : []);
    } catch (err) {
      console.error("Error filtering cars:", err);
      setError("Failed to filter cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Available Cars</h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* First row */}
            <div>
              <label className="block text-sm font-medium mb-2">Car Type</label>
              <select 
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="bg-blue-600 text-white w-full px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-pulse text-xl">Loading...</div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}
        
        {/* No results */}
        {!loading && !error && cars.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-8">
            No cars found matching your filters. Try adjusting your search criteria.
          </div>
        )}
        
        {/* Cars Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div key={car._id || car.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {car.images && car.images.length > 0 ? (
                    <img 
                      src={car.images[0].startsWith('http') ? car.images[0] : `${API_BASE_URL}${car.images[0]}`}
                      alt={car.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-gray-500">Car Image</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">{car.category?.name || car.category}</span>
                    <span className="font-bold text-blue-600">${car.price?.daily || 0}/day</span>
                  </div>
                  <div className="flex text-sm text-gray-600 mb-4">
                    <div className="mr-4">{car.seats} Seats</div>
                    <div className="mr-4">{car.transmission?.name || car.transmission}</div>
                    <div>{car.fuel?.name || car.fuel}</div>
                  </div>
                  <Link 
                    href={`/car/${car._id || car.id}`} 
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && cars.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <button className="px-4 py-2 border rounded bg-white hover:bg-gray-50">Previous</button>
              <button className="px-4 py-2 border rounded bg-blue-600 text-white">1</button>
              <button className="px-4 py-2 border rounded bg-white hover:bg-gray-50">2</button>
              <button className="px-4 py-2 border rounded bg-white hover:bg-gray-50">3</button>
              <button className="px-4 py-2 border rounded bg-white hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 