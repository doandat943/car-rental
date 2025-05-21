import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUsers, FaCog, FaStar, FaCar } from 'react-icons/fa';
import { API_BASE_URL } from '@/lib/api';

const CarList = ({ cars = [], title = "Our Cars" }) => {
  console.log("Cars passed to CarList:", cars);

  if (!cars || cars.length === 0) {
    return (
      <div className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">{title}</h2>
          <div className="text-center text-gray-500 py-10">
            No cars available at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Extracted CarCard component for consistency
const CarCard = ({ car }) => {
  const [imageError, setImageError] = useState(false);
  
  // Extract proper names from objects to prevent React DOM errors
  const brandName = typeof car.brand === 'object' ? car.brand.name : car.brand;
  const modelName = typeof car.model === 'object' ? car.model.name : car.model;
  const carName = car.name || `${brandName} ${modelName}`;
  const transmissionName = typeof car.transmission === 'object' ? car.transmission.name : car.transmission;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gray-100">
        {car.images && car.images.length > 0 && !imageError ? (
          <img 
            src={car.images[0].startsWith('http') ? car.images[0] : `${API_BASE_URL}${car.images[0]}`} 
            alt={carName}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <FaCar className="text-gray-400 text-5xl" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2">{carName}</h3>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-primary text-xl font-bold">
            ${car.price?.daily} <span className="text-sm font-normal text-gray-500">/day</span>
          </span>
          
          {car.rating && (
            <div className="flex items-center text-yellow-500">
              <FaStar className="mr-1" />
              <span>{car.rating}</span>
              {car.reviewCount && (
                <span className="text-xs text-gray-500 ml-1">({car.reviewCount})</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <FaUsers className="mr-1" />
            <span>{car.seats || 5} Seats</span>
          </div>
          <div className="flex items-center">
            <FaCog className="mr-1" />
            <span>{transmissionName || 'Auto'}</span>
          </div>
        </div>
        
        <Link href={`/car/${car._id}`}>
          <div className="w-full py-2 bg-primary text-white font-medium rounded text-center hover:bg-primary-dark transition-colors">
            View Details
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CarList; 