"use client";

import React, { useState, useEffect } from 'react';
import Banner from '@/components/Banner';
import CarList from '@/components/CarList';
import CategoryFilter from '@/components/CategoryFilter';
import { carsAPI, categoriesAPI } from '@/lib/api';

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
        console.log('Categories response structure:', {
          status: categoriesResponse?.status,
          statusText: categoriesResponse?.statusText,
          dataType: typeof categoriesResponse?.data,
          data: categoriesResponse?.data,
          isDataArray: Array.isArray(categoriesResponse?.data)
        });
        
        // Check data structure and ensure it's an array
        const categoriesData = categoriesResponse?.data?.data || 
                              categoriesResponse?.data || 
                              [];
        console.log('Final categories data:', categoriesData);
        console.log('Is categories data array?', Array.isArray(categoriesData));
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
        // Fetch cars (featured or all)
        const carsResponse = await carsAPI.getAllCars();
        console.log('Cars API response:', carsResponse);
        console.log('Cars response structure:', {
          status: carsResponse?.status,
          statusText: carsResponse?.statusText,
          dataType: typeof carsResponse?.data,
          data: carsResponse?.data,
          isDataArray: Array.isArray(carsResponse?.data)
        });
        
        // Check data structure and ensure it's an array
        const carsData = carsResponse?.data?.data || 
                        carsResponse?.data || 
                        [];
        console.log('Final cars data:', carsData);
        console.log('Is cars data array?', Array.isArray(carsData));
        setCars(Array.isArray(carsData) ? carsData : []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
        
        // Fallback to demo data if API fails
        setCategories([
          { id: 1, name: 'Sedan' },
          { id: 2, name: 'SUV' },
          { id: 3, name: 'Sports Car' },
          { id: 4, name: 'Electric' },
          { id: 5, name: 'Luxury' },
        ]);
        
        setCars([
          {
            id: 1,
            name: 'Toyota Camry',
            brand: 'Toyota',
            model: 'Camry',
            year: 2023,
            price: { daily: 45 },
            image: '/placeholder-car.jpg',
            specifications: {
              seats: 5,
              transmission: 'Automatic'
            }
          },
          {
            id: 2,
            name: 'Honda Civic',
            brand: 'Honda',
            model: 'Civic',
            year: 2023,
            price: { daily: 40 },
            image: '/placeholder-car.jpg',
            specifications: {
              seats: 5,
              transmission: 'Automatic'
            }
          },
          {
            id: 3,
            name: 'Tesla Model 3',
            brand: 'Tesla',
            model: 'Model 3',
            year: 2023,
            price: { daily: 80 },
            image: '/placeholder-car.jpg',
            specifications: {
              seats: 5,
              transmission: 'Automatic'
            }
          },
          {
            id: 4,
            name: 'BMW X5',
            brand: 'BMW',
            model: 'X5',
            year: 2023,
            price: { daily: 95 },
            image: '/placeholder-car.jpg',
            specifications: {
              seats: 7,
              transmission: 'Automatic'
            }
          }
        ]);
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
      console.log('Filtering with params:', params);
      const response = await carsAPI.getAllCars(params);
      console.log('Category filter response:', response);
      console.log('Response data structure:', {
        dataType: typeof response?.data,
        hasData: !!response?.data?.data,
        isDataArray: Array.isArray(response?.data?.data)
      });
      
      // Check return data structure
      const carsData = response?.data?.data || 
                      response?.data || 
                      [];
      console.log('Filtered cars data:', carsData);
      setCars(Array.isArray(carsData) ? carsData : []);
    } catch (err) {
      console.error("Error filtering cars:", err);
      setError("Failed to filter cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main>
      <Banner />
      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <CarList 
        cars={cars} 
        title="Featured Cars"
      />
      {error && (
        <div className="container">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}
    </main>
  );
} 