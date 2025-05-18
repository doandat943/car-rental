"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { carsAPI } from '@/lib/api';
import { FaStar, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function CarDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching car details for ID:', id);
        const response = await carsAPI.getCarById(id);
        console.log('Car details response:', response);
        
        // Check if data exists and set car state
        if (response?.data?.data) {
          const carData = response.data.data;
          setCar(carData);
          
          // Set page title dynamically
          document.title = `${carData.name || `${carData.brand} ${carData.model}`} | Car Rental Service`;
          
          // Set initial price calculation
          setTotalPrice(carData.price?.daily || 0);
        } else {
          setError('Car details not found');
        }
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Failed to load car details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  // Calculate total price when dates change
  useEffect(() => {
    if (pickupDate && returnDate && car) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTotalDays(diffDays || 1);
      setTotalPrice((car.price?.daily || 0) * (diffDays || 1));
    }
  }, [pickupDate, returnDate, car]);

  const handleBooking = (e) => {
    e.preventDefault();
    // Implement booking logic here
    console.log('Booking car with ID:', id);
    console.log('Pickup date:', pickupDate);
    console.log('Return date:', returnDate);
    console.log('Total price:', totalPrice);
    
    alert('Booking functionality will be implemented in the next phase!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading car details...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Car not found'}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cars" className="text-blue-600 hover:text-blue-800">Cars</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{car.name || `${car.brand} ${car.model}`}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Images and Details */}
          <div className="lg:col-span-2">
            {/* Car Images */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
              <div className="bg-gray-200 h-80 relative mb-4 rounded-lg overflow-hidden">
                {car.images && car.images.length > 0 ? (
                  <Image 
                    src={car.images[0].startsWith('http') ? car.images[0] : `http://localhost:5000${car.images[0]}`}
                    alt={car.name || `${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-gray-500 text-xl">No Image Available</span>
                  </div>
                )}
              </div>
              {car.images && car.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {car.images.slice(1).map((image, index) => (
                    <div key={index} className="bg-gray-200 h-24 relative rounded-lg overflow-hidden">
                      <Image 
                        src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
                        alt={`${car.name || `${car.brand} ${car.model}`} - Image ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h1 className="text-3xl font-bold mb-2">{car.name || `${car.brand} ${car.model}`}</h1>
              {car.rating && (
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(car.rating) ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-gray-600">{car.rating} ({car.reviewCount || 0} reviews)</span>
                </div>
              )}
              
              <div className="border-t border-b py-4 my-4">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-gray-600">Brand</div>
                    <div className="font-semibold">{car.brand}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Model</div>
                    <div className="font-semibold">{car.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Year</div>
                    <div className="font-semibold">{car.year}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Category</div>
                    <div className="font-semibold">{car.category?.name || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Seats</div>
                    <div className="font-semibold">{car.seats || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Transmission</div>
                    <div className="font-semibold">{car.transmission || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Fuel</div>
                    <div className="font-semibold">{car.fuel || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{car.description}</p>
              </div>
              
              {car.features && car.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2"><FaCheck size={12} /></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Form */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Book This Car</h2>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Rental Prices</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  {car.price?.hourly && (
                    <>
                      <div className="text-gray-600">Hourly:</div>
                      <div className="font-semibold">${car.price.hourly}</div>
                    </>
                  )}
                  <div className="text-gray-600">Daily:</div>
                  <div className="font-semibold">${car.price?.daily || 'N/A'}</div>
                  {car.price?.weekly && (
                    <>
                      <div className="text-gray-600">Weekly:</div>
                      <div className="font-semibold">${car.price.weekly}</div>
                    </>
                  )}
                  {car.price?.monthly && (
                    <>
                      <div className="text-gray-600">Monthly:</div>
                      <div className="font-semibold">${car.price.monthly}</div>
                    </>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Pickup Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Return Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded" 
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Pickup Location</label>
                  <select className="w-full p-2 border rounded" required>
                    <option value="">Select location</option>
                    <option value="airport">Airport Terminal</option>
                    <option value="downtown">Downtown Office</option>
                    <option value="mall">Shopping Mall</option>
                  </select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Daily Rate:</span>
                    <span>${car.price?.daily || 0}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Number of days:</span>
                    <span>{totalDays}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
                  disabled={car.status !== 'available'}
                >
                  {car.status === 'available' ? 'Book Now' : 'Currently Unavailable'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 