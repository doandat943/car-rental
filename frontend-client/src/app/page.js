"use client";

import { useState, useEffect } from 'react';
import Banner from '@/components/Banner';
import CarList from '@/components/CarList';
import CategoryFilter from '@/components/CategoryFilter';
import { carsAPI, categoriesAPI } from '@/lib/api';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch cars and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch cars and categories in parallel
        const [carsResponse, categoriesResponse] = await Promise.all([
          carsAPI.getAllCars(),
          categoriesAPI.getAllCategories()
        ]);
        
        setCars(carsResponse.data.data || []);
        setCategories(categoriesResponse.data.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle category selection
  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    
    try {
      if (categoryId === 'all') {
        const response = await carsAPI.getAllCars();
        setCars(response.data.data || []);
      } else {
        const response = await carsAPI.getCarsByCategory(categoryId);
        setCars(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error filtering by category:", err);
      setError("Failed to filter cars. Please try again.");
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      // If search query is empty, reset to all or current category
      handleCategoryChange(selectedCategory);
      return;
    }
    
    setLoading(true);
    try {
      const response = await carsAPI.searchCars({ 
        query,
        category: selectedCategory !== 'all' ? selectedCategory : undefined 
      });
      
      setCars(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error searching cars:", err);
      setError("Failed to search cars. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Banner onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore Our Fleet</h2>
        
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
            >
              Retry
            </button>
          </div>
        ) : (
          <CarList cars={cars} />
        )}
      </div>
    </main>
  );
} 