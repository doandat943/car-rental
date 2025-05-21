import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api';

const CarCard = ({ car }) => {
  // Handle car data fields
  const carId = car._id;
  const carImage = car.images?.[0]?.url || (car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `${API_BASE_URL}${car.images[0]}`) : null);
  const carPrice = car.price || 0;
  const carSeats = car.seats || 5;
  const carTransmission = typeof car.transmission === 'object' ? car.transmission.name : car.transmission || 'Automatic';
  const carBrand = typeof car.brand === 'object' ? car.brand.name : car.brand || '';
  const carModel = typeof car.model === 'object' ? car.model.name : car.model || '';
  
  return (
    <div className="card car-card hover:shadow-lg transition-shadow duration-300">
      <div className="car-card-image">
        {carImage ? (
          <Image 
            src={carImage} 
            alt={car.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <div className="car-card-content">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{car.name}</h3>
          <span className="car-card-price">
            ${carPrice}/day
          </span>
        </div>
        <p className="text-sm text-secondary mb-3">
          {carBrand} {carModel} • {car.year}
        </p>
        
        <div className="flex text-sm text-secondary mb-4">
          <div className="car-card-feature">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
            </svg>
            {carSeats} seats
          </div>
          <div className="car-card-feature">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            {carTransmission}
          </div>
        </div>
        
        <Link 
          href={`/car/${carId}`} 
          className="btn btn-primary w-full text-center mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const CarList = ({ cars = [], title = "Featured Cars" }) => {
  // Ensure cars is an array
  const carsList = Array.isArray(cars) ? cars : [];
  
  if (!carsList.length) {
    return (
      <div className="container py-16">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        <div className="flex justify-center items-center py-16">
          <p className="text-xl text-secondary">No cars available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {carsList.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default CarList; 