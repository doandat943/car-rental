'use client';

import Link from 'next/link';
import { useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { 
  FaCar, 
  FaUsers, 
  FaCog, 
  FaGasPump, 
  FaHeart,
  FaCalendarAlt,
  FaTag
} from 'react-icons/fa';
import { useCalendarModal } from '@/contexts/CalendarModalContext';

export default function CarCard({ car, viewMode = 'grid' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { openModal } = useCalendarModal();
  
  // Properly handle images from API
  const displayImage = car.images && car.images.length > 0 
    ? (car.images[0].url || (car.images[0].startsWith('http') ? car.images[0] : `${API_BASE_URL}${car.images[0]}`))
    : null;

  // Get brand name
  const brandName = typeof car.brand === 'object' ? car.brand.name : car.brand;
  const categoryName = typeof car.category === 'object' ? car.category.name : car.category;
  const transmissionName = typeof car.transmission === 'object' ? car.transmission.name : car.transmission;
  const fuelName = typeof car.fuel === 'object' ? car.fuel.name : car.fuel;

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl border border-gray-100"
        style={{ transform: isHovered ? 'translateY(-2px)' : 'none' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Car Image */}
          <div className="relative md:w-80 h-56 bg-gray-100 flex-shrink-0">
            {displayImage && !imageError ? (
              <img 
                src={displayImage}
                alt={car.name}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <FaCar className="text-gray-400 text-6xl" />
              </div>
            )}
            
            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
              ${car.price}<span className="text-sm font-normal">/day</span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
            >
              <FaHeart className={`${isFavorite ? 'text-red-500' : 'text-gray-400'} transition-colors`} />
            </button>

            {/* Status Badge */}
            <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Available
            </div>
          </div>
          
          {/* Car Details */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{car.name}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  {brandName && <span className="font-medium">{brandName}</span>}
                  {categoryName && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaTag className="text-blue-600" />
                        {categoryName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Car Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {/* Seats */}
              {car.seats && (
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FaUsers className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Seats</div>
                    <div className="font-semibold">{car.seats}</div>
                  </div>
                </div>
              )}
              
              {/* Transmission */}
              {transmissionName && (
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <FaCog className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Transmission</div>
                    <div className="font-semibold">{transmissionName}</div>
                  </div>
                </div>
              )}
              
              {/* Fuel */}
              {fuelName && (
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <FaGasPump className="text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Fuel</div>
                    <div className="font-semibold">{fuelName}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {car.features.slice(0, 4).map((feature, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {typeof feature === 'object' ? feature.name : feature}
                    </span>
                  ))}
                  {car.features.length > 4 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      +{car.features.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link 
                href={`/cars/${car._id || car.id}`} 
                className="flex-1 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg"
              >
                View Details
              </Link>
              <button 
                onClick={() => openModal(car)}
                className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all font-medium flex items-center justify-center gap-2"
              >
                <FaCalendarAlt />
                View Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl border border-gray-100"
      style={{ transform: isHovered ? 'translateY(-8px)' : 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Car Image */}
      <div className="relative h-56 bg-gray-100">
        {displayImage && !imageError ? (
          <img 
            src={displayImage}
            alt={car.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <FaCar className="text-gray-400 text-5xl" />
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-full text-lg font-bold shadow-lg">
          ${car.price}<span className="text-sm font-normal">/day</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
        >
          <FaHeart className={`${isFavorite ? 'text-red-500' : 'text-gray-400'} transition-colors`} />
        </button>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Available
        </div>
      </div>
      
      {/* Car Details */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{car.name}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            {brandName && <span className="font-medium">{brandName}</span>}
            {categoryName && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FaTag className="text-blue-600 text-sm" />
                  {categoryName}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Car Specifications */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
          {/* Seats */}
          {car.seats && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="p-1.5 bg-blue-50 rounded">
                <FaUsers className="text-blue-600 text-xs" />
              </div>
              <span>{car.seats} seats</span>
            </div>
          )}
          
          {/* Transmission */}
          {transmissionName && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="p-1.5 bg-green-50 rounded">
                <FaCog className="text-green-600 text-xs" />
              </div>
              <span className="truncate">{transmissionName}</span>
            </div>
          )}
          
          {/* Fuel */}
          {fuelName && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="p-1.5 bg-orange-50 rounded">
                <FaGasPump className="text-orange-600 text-xs" />
              </div>
              <span className="truncate">{fuelName}</span>
            </div>
          )}
        </div>

        {/* Features Preview */}
        {car.features && car.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {car.features.slice(0, 2).map((feature, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {typeof feature === 'object' ? feature.name : feature}
                </span>
              ))}
              {car.features.length > 2 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                  +{car.features.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <Link 
            href={`/cars/${car._id || car.id}`} 
            className="block text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg"
          >
            View Details
          </Link>
          <button 
            onClick={() => openModal(car)}
            className="w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all font-medium flex items-center justify-center gap-2"
          >
            <FaCalendarAlt />
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );
} 