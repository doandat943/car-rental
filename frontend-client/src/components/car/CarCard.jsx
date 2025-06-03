'use client';

import Link from 'next/link';
import { useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { FaCar } from 'react-icons/fa';

export default function CarCard({ car }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Properly handle images from API
  const displayImage = car.images && car.images.length > 0 
    ? (car.images[0].url || (car.images[0].startsWith('http') ? car.images[0] : `${API_BASE_URL}${car.images[0]}`))
    : null;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out"
      style={{ transform: isHovered ? 'translateY(-5px)' : 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Car Image */}
      <div className="relative h-48 bg-gray-100">
        {displayImage && !imageError ? (
          <img 
            src={displayImage}
            alt={car.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <FaCar className="text-gray-400 text-5xl" />
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${car.price}/day
        </div>
      </div>
      
      {/* Car Details */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">{typeof car.category === 'object' ? car.category.name : car.category}</span>
        </div>
        
        {/* Car Specifications */}
        <div className="flex text-sm text-gray-600 mb-4">
          {/* Seats */}
          {car.seats && (
            <div className="mr-4 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {car.seats} Seats
            </div>
          )}
          
          {/* Transmission */}
          {car.transmission && (
            <div className="mr-4 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {typeof car.transmission === 'object' ? car.transmission.name : car.transmission}
            </div>
          )}
          
          {/* Fuel */}
          {car.fuel && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {typeof car.fuel === 'object' ? car.fuel.name : car.fuel}
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <Link 
          href={`/car/${car._id || car.id}`} 
          className="block text-center bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 