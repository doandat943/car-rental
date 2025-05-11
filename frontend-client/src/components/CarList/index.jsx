import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CarCard = ({ car }) => {
  // Handle fields that might differ between API and mock data
  const carId = car._id || car.id;
  const carImage = car.images?.[0] || car.image || "/placeholder-car.jpg";
  const carPrice = car.price?.daily || car.price || 0;
  const carSeats = car.specifications?.seats || 5;
  const carTransmission = car.specifications?.transmission || 'Automatic';
  
  return (
    <div className="card car-card hover:shadow-lg transition-shadow duration-300">
      <div className="car-card-image">
        <Image 
          src={carImage} 
          alt={car.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="car-card-content">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{car.name}</h3>
          <span className="car-card-price">
            ${carPrice}/day
          </span>
        </div>
        <p className="text-sm text-secondary mb-3">
          {car.brand} {car.model} • {car.year}
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
          <CarCard key={car._id || car.id || Math.random()} car={car} />
        ))}
      </div>
    </div>
  );
};

export default CarList; 