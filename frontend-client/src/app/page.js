"use client";

import React, { useState } from 'react';
import Banner from '@/components/Banner';
import CarList from '@/components/CarList';
import CategoryFilter from '@/components/CategoryFilter';

// Demo data - sẽ được thay thế bằng dữ liệu từ API
const demoCategories = [
  { id: 1, name: 'Sedan' },
  { id: 2, name: 'SUV' },
  { id: 3, name: 'Sports Car' },
  { id: 4, name: 'Electric' },
  { id: 5, name: 'Luxury' },
];

const demoCars = [
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
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Hàm xử lý khi chọn danh mục
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    // Sau này sẽ gọi API để lọc xe theo danh mục
  };

  return (
    <main>
      <Banner />
      <CategoryFilter 
        categories={demoCategories} 
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <CarList 
        cars={demoCars} 
        title="Featured Cars"
      />
    </main>
  );
} 