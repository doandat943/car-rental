"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { carsAPI, API_BASE_URL, locationsAPI, bookingsAPI } from '@/lib/api';
import { FaStar, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Helper function to get tomorrow's date
const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

export default function CarDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize with today and tomorrow dates
  const today = new Date();
  const tomorrow = getTomorrow();
  const [pickupDate, setPickupDate] = useState(formatDate(today));
  const [returnDate, setReturnDate] = useState(formatDate(tomorrow));
  
  const [totalDays, setTotalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Additional state for new features
  const [pickupLocation, setPickupLocation] = useState('airport');
  const [includeDriver, setIncludeDriver] = useState(false);
  const [doorstepDelivery, setDoorstepDelivery] = useState(false);
  const [driverFee, setDriverFee] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  
  // State for pickup locations
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    // Fetch pickup locations
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await locationsAPI.getPickupLocations();
        if (response?.data?.data) {
          setLocations(response.data.data);
          
          // Set default location if locations are available
          if (response.data.data.length > 0) {
            setPickupLocation(response.data.data[0].code);
          }
        }
      } catch (err) {
        console.error('Error fetching pickup locations:', err);
      } finally {
        setLoadingLocations(false);
      }
    };
    
    fetchLocations();
  }, []);

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
          document.title = `${carData.name || `${carData.brand?.name || carData.brand} ${carData.model?.name || carData.model}`} | Car Rental Service`;
          
          // Set initial price calculation with default dates
          setTotalPrice(carData.price || 0);
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

  // Calculate total price when dates or services change
  useEffect(() => {
    if (pickupDate && returnDate && car) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTotalDays(diffDays || 1);
      
      // Base rental cost
      let total = (car.price || 0) * (diffDays || 1);
      
      // Add driver fee if selected
      if (includeDriver) {
        const driverCost = 30 * (diffDays || 1); // $30 per day
        setDriverFee(driverCost);
        total += driverCost;
      } else {
        setDriverFee(0);
      }
      
      // Add delivery fee if selected
      if (doorstepDelivery) {
        const delivery = 25; // Fixed $25 fee
        setDeliveryFee(delivery);
        total += delivery;
      } else {
        setDeliveryFee(0);
      }
      
      setTotalPrice(total);
    }
  }, [pickupDate, returnDate, car, includeDriver, doorstepDelivery]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Save booking details to localStorage
      localStorage.setItem('pendingBooking', JSON.stringify({
        carId: id,
        startDate: pickupDate,
        endDate: returnDate,
        pickupLocation,
        dropoffLocation: pickupLocation,
        includeDriver,
        doorstepDelivery,
        returnUrl: window.location.pathname
      }));
      
      // Redirect to login page
      alert('Please log in to book this car');
      router.push('/login');
      return;
    }
    
    // Validate booking dates
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (end <= start) {
      alert('Return date must be after pickup date');
      return;
    }
    
    console.log('Booking car with ID:', id);
    console.log('Pickup date:', pickupDate);
    console.log('Return date:', returnDate);
    console.log('Pickup location:', pickupLocation);
    console.log('Additional services:', {
      includeDriver,
      doorstepDelivery
    });
    console.log('Total price:', totalPrice);
    
    // Prepare booking data
    const bookingData = {
      carId: id,
      startDate: pickupDate,
      endDate: returnDate,
      pickupLocation,
      dropoffLocation: pickupLocation, // Same as pickup for now
      includeDriver,
      doorstepDelivery,
      totalAmount: totalPrice
    };
    
    try {
      setLoading(true); // Show loading state
      const response = await bookingsAPI.createBooking(bookingData);
      
      if (response?.data?.success) {
        // Navigate to booking confirmation page
        router.push(`/booking/confirmation/${response.data.data._id}`);
      } else {
        alert('Booking failed: ' + (response?.data?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Booking error:', err);
      
      if (err.status === 401) {
        // Authentication error
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } else if (err.status === 400) {
        // Validation error
        alert('Booking error: ' + (err.message || 'Please check your booking details'));
      } else if (err.status === 404) {
        // Car not found
        alert('Sorry, this car is no longer available.');
        router.push('/cars');
      } else {
        // General error
        alert('Sorry, we couldn\'t complete your booking: ' + (err.message || 'Please try again later'));
      }
    } finally {
      setLoading(false); // Hide loading state
    }
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
          <span className="text-gray-600">{car.name || `${car.brand?.name || car.brand} ${car.model?.name || car.model}`}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Images and Details */}
          <div className="lg:col-span-2">
            {/* Car Images */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
              <div className="bg-gray-200 h-80 relative mb-4 rounded-lg overflow-hidden">
                {car.images && Array.isArray(car.images) && car.images.length > 0 ? (
                  <Image 
                    src={
                      typeof car.images[0] === 'object' && car.images[0].url 
                        ? car.images[0].url 
                        : typeof car.images[0] === 'string' && car.images[0].startsWith('http') 
                          ? car.images[0] 
                          : `${API_BASE_URL}${car.images[0]}`
                    }
                    alt={car.name || `${typeof car.brand === 'object' ? car.brand.name : car.brand} ${typeof car.model === 'object' ? car.model.name : car.model}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-gray-500 text-xl">No Image Available</span>
                  </div>
                )}
              </div>
              {car.images && Array.isArray(car.images) && car.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {car.images.slice(1).map((image, index) => (
                    <div key={index} className="bg-gray-200 h-24 relative rounded-lg overflow-hidden">
                      <Image 
                        src={
                          typeof image === 'object' && image.url 
                            ? image.url 
                            : typeof image === 'string' && image.startsWith('http') 
                              ? image 
                              : `${API_BASE_URL}${image}`
                        }
                        alt={`${car.name || `${typeof car.brand === 'object' ? car.brand.name : car.brand} ${typeof car.model === 'object' ? car.model.name : car.model}`} - Image ${index + 2}`}
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
              <h1 className="text-3xl font-bold mb-2">{car.name || `${car.brand?.name || car.brand} ${car.model?.name || car.model}`}</h1>
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
                    <div className="font-semibold">{typeof car.brand === 'object' ? car.brand.name : car.brand?.name || car.brand}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Model</div>
                    <div className="font-semibold">{typeof car.model === 'object' ? car.model.name : car.model?.name || car.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Year</div>
                    <div className="font-semibold">{car.year}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Category</div>
                    <div className="font-semibold">{typeof car.category === 'object' ? car.category.name : car.category || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Seats</div>
                    <div className="font-semibold">{car.seats || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Transmission</div>
                    <div className="font-semibold">{typeof car.transmission === 'object' ? car.transmission.name : car.transmission || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Fuel</div>
                    <div className="font-semibold">{typeof car.fuel === 'object' ? car.fuel.name : car.fuel || 'N/A'}</div>
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
                    {Array.isArray(car.features) && car.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2"><FaCheck size={12} /></span>
                        <span>{typeof feature === 'object' ? feature.name : feature}</span>
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
                  <div className="text-gray-600">Daily Rate:</div>
                  <div className="font-semibold">${car.price || 'N/A'}</div>
                </div>
              </div>
              
              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Pickup Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded" 
                    value={pickupDate}
                    onChange={(e) => {
                      const newPickupDate = e.target.value;
                      setPickupDate(newPickupDate);
                      
                      // If return date is before new pickup date, adjust it
                      const pickupTime = new Date(newPickupDate).getTime();
                      const returnTime = new Date(returnDate).getTime();
                      if (returnTime <= pickupTime) {
                        const nextDay = new Date(newPickupDate);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setReturnDate(formatDate(nextDay));
                      }
                    }}
                    min={formatDate(new Date())}
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
                    min={pickupDate}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Pickup Location</label>
                  <select 
                    className="w-full p-2 border rounded" 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  >
                    {loadingLocations ? (
                      <option value="">Loading locations...</option>
                    ) : locations.length === 0 ? (
                      <option value="">No locations available</option>
                    ) : (
                      locations.map(location => (
                        <option key={location._id} value={location.code}>
                          {location.name} - {location.address}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                {/* Additional Services Section */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Additional Services</h3>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded mb-2">
                    <div>
                      <div className="font-medium">Include Driver</div>
                      <div className="text-sm text-gray-500">Professional driver for your journey</div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-3">${30}/day</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={includeDriver}
                          onChange={() => setIncludeDriver(!includeDriver)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Doorstep Delivery</div>
                      <div className="text-sm text-gray-500">We'll deliver the car to your location</div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-3">$25</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={doorstepDelivery}
                          onChange={() => setDoorstepDelivery(!doorstepDelivery)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Daily Rate:</span>
                    <span>${car.price || 0}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Number of days:</span>
                    <span>{totalDays}</span>
                  </div>
                  {includeDriver && (
                    <div className="flex justify-between mb-2">
                      <span>Driver Service:</span>
                      <span>${driverFee}</span>
                    </div>
                  )}
                  {doorstepDelivery && (
                    <div className="flex justify-between mb-2">
                      <span>Doorstep Delivery:</span>
                      <span>${deliveryFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
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