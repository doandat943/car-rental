"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { carsAPI, API_BASE_URL, locationsAPI, bookingsAPI } from '@/lib/api';
import { FaStar, FaCheck, FaCalendarAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { formatDate, getTomorrow, normalizeDate, hasBookedDatesBetween, findMaxValidEndDate } from '@/utils/dateUtils';

// Dynamically import the BookingCalendar to avoid SSR issues with date-fns
const BookingCalendar = dynamic(() => import('@/components/BookingCalendar'), {
  ssr: false,
  loading: () => <p>Loading calendar...</p>
});

export default function CarDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize with today and tomorrow dates
  const today = new Date();
  const tomorrow = getTomorrow();
  
  // Start with empty dates to avoid unwanted automatic selection
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
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
  
  // Car availability only for Book Now button
  const [carAvailability, setCarAvailability] = useState(null);
  // Remove unused state
  const [bookedDates, setBookedDates] = useState([]);

  // Remove unused calendar state
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true); // Only used for first load
  
  // Remove unused state
  const [hasFoundAvailableDates, setHasFoundAvailableDates] = useState(false);
  const [autoFindingDates, setAutoFindingDates] = useState(false);
  
  // Add state to track last user action (pickup or return date selection)
  const [lastActionType, setLastActionType] = useState('pickup'); // 'pickup' or 'return'
  
  // State for refresh indicator
  const [isRefreshingCalendar, setIsRefreshingCalendar] = useState(false);

  // Function to refresh calendar data
  const refreshCalendarData = async () => {
    try {
      setIsRefreshingCalendar(true);
      
      // Calculate current date and 90 days later
      const today = new Date();
      const in90Days = new Date();
      in90Days.setDate(today.getDate() + 90);
      
      // Get updated booking data
      const availabilityResponse = await carsAPI.checkStatus(id, {
        startDate: formatDate(today),
        endDate: formatDate(in90Days)
      });
      
      if (availabilityResponse?.bookedDates && Array.isArray(availabilityResponse.bookedDates)) {
        // Format booked dates
        const formattedBookedDates = availabilityResponse.bookedDates.map(booking => ({
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
          status: booking.status || 'booked'
        }));
        
        setBookedDates(formattedBookedDates);
        
        // Reset date selection to avoid conflicts
        setPickupDate('');
        setReturnDate('');
        setHasFoundAvailableDates(false);
        setAutoFindingDates(false);
        
        console.log('Calendar data refreshed successfully');
      } else {
        console.warn('No booking date data received during refresh');
        setBookedDates([]);
      }
    } catch (error) {
      console.error('Error refreshing calendar data:', error);
    } finally {
      setIsRefreshingCalendar(false);
    }
  };

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
        setInitialLoading(true); // Use initialLoading instead of loading
        const response = await carsAPI.getCarById(id);
        
        // Check if data exists and set car state
        if (response?.data?.data) {
          const carData = response.data.data;
          setCar(carData);
          
          // Set page title dynamically
          document.title = `${carData.name || `${carData.brand?.name || carData.brand} ${carData.model?.name || carData.model}`} | Car Rental Service`;
          
          // Set initial price calculation with default dates
          setTotalPrice(carData.price || 0);
          
          // Get information about booked dates right after getting car info
          try {
            // Calculate current date and 90 days later
            const today = new Date();
            const in90Days = new Date();
            in90Days.setDate(today.getDate() + 90);
            
            // Get data about booked dates within 90 days
            const availabilityResponse = await carsAPI.checkStatus(id, {
              startDate: formatDate(today),
              endDate: formatDate(in90Days)
            });
            
            if (availabilityResponse?.bookedDates && Array.isArray(availabilityResponse.bookedDates)) {
              
              // Ensure bookedDates have the correct format
              const formattedBookedDates = availabilityResponse.bookedDates.map(booking => ({
                startDate: new Date(booking.startDate),
                endDate: new Date(booking.endDate),
                status: booking.status || 'booked'
              }));
              
              setBookedDates(formattedBookedDates);
            } else {
              console.warn('No booking date data received or invalid format');
              setBookedDates([]);
            }
          } catch (error) {
            console.error('Error checking car availability:', error);
            setBookedDates([]);
          }
        } else {
          setError('Car details not found');
        }
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Failed to load car details. Please try again later.');
      } finally {
        setInitialLoading(false);
        setIsInitialLoad(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  // Separate availability checking from price calculation useEffect
  useEffect(() => {
    // Skip first render to avoid flash
    if (isInitialLoad) {
      // Reset isInitialLoad after initial data is loaded
      if (car && !initialLoading) {
        setIsInitialLoad(false);
      }
      return;
    }
    
    // Only calculate total price, not availability
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
  }, [pickupDate, returnDate, car, includeDriver, doorstepDelivery, isInitialLoad, initialLoading]);

  const handleBooking = async (e) => {
    // Prevent default form behavior
    if (e) {
    e.preventDefault();
      e.stopPropagation();
    }
    
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
    
    // Proceed with booking directly since calendar already shows availability
    try {
      
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
      
      const response = await bookingsAPI.createBooking(bookingData);
      
      if (response?.data?.success) {
        // Navigate to booking confirmation page
        router.push(`/booking/confirmation/${response.data.data._id}`);
      } else {
        const errorMessage = response?.data?.message || 'Unknown error';
        
        // If it's a date conflict error, refresh calendar and show specific message
        if (errorMessage.includes('already booked') || errorMessage.includes('not available')) {
          alert('Booking failed: ' + errorMessage + '\n\nThe calendar will be updated with the latest availability.');
          await refreshCalendarData();
        } else {
          alert('Booking failed: ' + errorMessage);
        }
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
        const errorMessage = err.message || 'Please check your booking details';
        
        // If it's a date conflict error, refresh calendar and show specific message
        if (errorMessage.includes('already booked') || errorMessage.includes('not available')) {
          alert('Booking error: ' + errorMessage + '\n\nThe calendar will be updated with the latest availability.');
          await refreshCalendarData();
        } else {
          alert('Booking error: ' + errorMessage);
        }
      } else if (err.status === 404) {
        // Car not found
        alert('Sorry, this car is no longer available.');
        router.push('/cars');
      } else {
        // General error
        const errorMessage = err.message || 'Please try again later';
        
        // For general errors that might be date conflicts, also refresh
        if (errorMessage.includes('already booked') || errorMessage.includes('not available')) {
          alert('Sorry, we couldn\'t complete your booking: ' + errorMessage + '\n\nThe calendar will be updated with the latest availability.');
          await refreshCalendarData();
        } else {
          alert('Sorry, we couldn\'t complete your booking: ' + errorMessage);
        }
      }
    }
  };

  // Handle date selection from calendar - Enhanced with blocked date handling
  const handleDateSelect = (date) => {
    // Ensure date is a valid Date object
    if (!(date instanceof Date) || isNaN(date)) {
      console.error('Invalid date object received:', date);
      return;
    }
    
    // Prevent automatic date finding when user is selecting
    setHasFoundAvailableDates(true);
    
    // Normalize the date using utility function
    const selectedDate = normalizeDate(date);
    if (!selectedDate) return;
    
    // Convert to YYYY-MM-DD string
    const formattedDate = formatDate(selectedDate);
    
    // Get normalized date objects for current pickup and return dates
    const returnDateObj = returnDate ? normalizeDate(new Date(returnDate)) : null;
    const pickupDateObj = pickupDate ? normalizeDate(new Date(pickupDate)) : null;
    
    // If no dates are selected yet, set as pickup date
    if (!pickupDate && !returnDate) {
      setPickupDate(formattedDate);
      setLastActionType('pickup');
      return;
    }
    
    // If only pickup date is selected
    if (pickupDate && !returnDate) {
      // If user clicks the same date, do nothing
      if (selectedDate.getTime() === pickupDateObj.getTime()) {
        return;
      }
      
      // If selected date is before pickup, update pickup
      if (selectedDate < pickupDateObj) {
        setPickupDate(formattedDate);
        setLastActionType('pickup');
        return;
      }
      
      // Check if there are booked dates between pickup and selected date
      if (hasBookedDatesBetween(pickupDateObj, selectedDate, isDateBooked)) {
        // User clicked on a "blocked" date - start new selection with this date
        setPickupDate(formattedDate);
        setReturnDate('');
        setLastActionType('pickup');
        return;
      }
      
      // Valid range, set as return date
      setReturnDate(formattedDate);
      setLastActionType('return');
      return;
    }
    
    // If both dates are selected, start fresh with the new date as pickup
    if (pickupDate && returnDate) {
      setPickupDate(formattedDate);
      setReturnDate('');
      setLastActionType('pickup');
      return;
    }
  };

  // Find available dates when component loads
  useEffect(() => {
    // Ensure car data is loaded and initialization is complete
    if (!car || initialLoading) {
      return;
    }
    
    // Add a waiting period to ensure bookedDates data has been loaded
    const timerId = setTimeout(() => {
      // Only find available dates if we have booking data and haven't found dates before
      if (bookedDates.length > 0 && !hasFoundAvailableDates && !autoFindingDates) {
        findAvailableDates();
      } else if (bookedDates.length === 0) {
        // If no booked dates, we can still find available dates (all dates are available)
        findAvailableDates();
      }
    }, 1000); // Wait 1 second after data is loaded
    
    // Clean up timer if component unmounts
    return () => clearTimeout(timerId);
  }, [car, bookedDates, hasFoundAvailableDates, autoFindingDates, initialLoading]);
  
  // Check if a date is booked
  const isDateBooked = (date) => {
    // Check input data
    if (!bookedDates || !bookedDates.length) {
      return false;
    }
    
    // Ensure date is a valid Date object
    if (!(date instanceof Date) || isNaN(date)) {
      console.error('isDateBooked: Invalid date to check:', date);
      return false;
    }
    
    // Ensure comparison is only by day, month, year
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const compareTime = compareDate.getTime();
    
    for (const booking of bookedDates) {
      // Check validity of booking
      if (!booking || !booking.startDate || !booking.endDate) {
        console.warn('isDateBooked: Invalid booking data:', booking);
        continue;
      }
      
      try {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        
        // Ensure dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn('isDateBooked: Invalid dates in booking:', {
            start: booking.startDate,
            end: booking.endDate
          });
          continue;
        }
        
        // Normalize comparison by day only
        const compareStart = new Date(start);
        compareStart.setHours(0, 0, 0, 0);
        
        const compareEnd = new Date(end);
        compareEnd.setHours(0, 0, 0, 0);
        
        // Compare timestamps instead of Date objects
        if (compareTime >= compareStart.getTime() && compareTime <= compareEnd.getTime()) {
          return true;
        }
      } catch (error) {
        console.error('isDateBooked: Error checking date:', error);
      }
    }
    
    return false;
  };

  // Find the first available date range
  const findAvailableDates = () => {
    // If already searching for dates, don't search again
    if (autoFindingDates) return;
    
    setAutoFindingDates(true);
    
    // Start from today
    let checkDate = new Date();
    let foundStart = false;
    let startDate = null;
    
    // Set maximum time for search
    const maxSearchDate = new Date();
    maxSearchDate.setDate(maxSearchDate.getDate() + 60); // Search up to 60 days
    
    // If no booked dates, just select today and tomorrow
    if (!bookedDates.length) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      
      setPickupDate(formatDate(today));
      setReturnDate(formatDate(tomorrow));
      setHasFoundAvailableDates(true);
      setAutoFindingDates(false);
      setLastActionType('pickup');
      return;
    }
    
    // Find first available date
    let currentDate = new Date(checkDate);
    let consecutiveAvailableDays = 0;
    let potentialStartDate = null;
    
    for (let i = 0; i < 60 && currentDate <= maxSearchDate; i++) {
      const testDate = new Date(currentDate);
      
      // Check if this date is booked
      if (isDateBooked(testDate)) {
        consecutiveAvailableDays = 0; // Reset count
        potentialStartDate = null; // Reset potential start date
      } else {
        // Date is available
        if (consecutiveAvailableDays === 0) {
          potentialStartDate = new Date(testDate); // Mark as potential start date
        }
        consecutiveAvailableDays++;
        
        // If we found at least 2 consecutive available days
        if (consecutiveAvailableDays >= 2) {
          const endDate = new Date(potentialStartDate);
          endDate.setDate(potentialStartDate.getDate() + 1); // Default to 1 night
          
          // Set dates and end search
          setPickupDate(formatDate(potentialStartDate));
          setReturnDate(formatDate(endDate));
          setHasFoundAvailableDates(true);
          setAutoFindingDates(false);
          setLastActionType('pickup');
          
          return;
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // If no available dates found
    setAutoFindingDates(false);
    
    alert("No available dates found within the next 60 days. Please select dates manually.");
  };

  // Double-check selected dates to ensure they are not booked
  useEffect(() => {
    // Only run when both start and end dates are selected
    if (!pickupDate || !returnDate || !bookedDates.length) {
      return;
    }

    // Check both selected dates
    const startDateObj = new Date(pickupDate);
    const endDateObj = new Date(returnDate);
    
    // Check selected dates
    const startIsBooked = isDateBooked(startDateObj);
    const endIsBooked = isDateBooked(endDateObj);

    // If either date is booked, reset and find again
    if (startIsBooked || endIsBooked) {
      console.error('Conflict detected with booked dates!', {
        startDate: startDateObj.toLocaleDateString(), 
        isBooked: startIsBooked,
        endDate: endDateObj.toLocaleDateString(),
        isBooked: endIsBooked
      });
      
      // Reset selection
      setPickupDate('');
      setReturnDate('');
      
      // Mark as not having found available dates to search again
      setHasFoundAvailableDates(false);
      setAutoFindingDates(false);
      
      // Show notification
      alert("Conflict detected with booked dates. Please select different dates.");
    }
  }, [pickupDate, returnDate, bookedDates]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl animate-pulse">Loading car details...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
          {error || 'Car not found'}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container px-6 mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cars" className="text-blue-600 hover:text-blue-800">Cars</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{car.name || `${car.brand?.name || car.brand} ${car.model?.name || car.model}`}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Car Images and Details */}
          <div className="lg:col-span-2">
            {/* Car Images */}
            <div className="p-4 mb-8 bg-white rounded-lg shadow-md">
              <div className="relative mb-4 overflow-hidden bg-gray-200 rounded-lg h-80">
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
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-xl text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>
              {car.images && Array.isArray(car.images) && car.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {car.images.slice(1).map((image, index) => (
                    <div key={index} className="relative h-24 overflow-hidden bg-gray-200 rounded-lg">
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
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <h1 className="mb-2 text-3xl font-bold">{car.name || `${car.brand?.name || car.brand} ${car.model?.name || car.model}`}</h1>
              
              <div className="py-4 my-4 border-t border-b">
                <h2 className="mb-4 text-xl font-semibold">Specifications</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <div className="text-gray-600">Brand</div>
                    <div className="font-semibold">
                      {typeof car.brand === 'object' 
                        ? car.brand.name
                        : typeof car.brand === 'string'
                          ? car.brand
                          : ''}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Model</div>
                    <div className="font-semibold">{typeof car.model === 'object' ? car.model.name : car.model?.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Year</div>
                    <div className="font-semibold">{car.year}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Category</div>
                    <div className="font-semibold">{typeof car.category === 'object' ? car.category.name : car.category}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Seats</div>
                    <div className="font-semibold">{car.seats}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Transmission</div>
                    <div className="font-semibold">{typeof car.transmission === 'object' ? car.transmission.name : car.transmission}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Fuel</div>
                    <div className="font-semibold">{typeof car.fuel === 'object' ? car.fuel.name : car.fuel}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold">Description</h2>
                <p className="text-gray-700">{car.description}</p>
              </div>
              
              {car.features && car.features.length > 0 && (
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Features</h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {Array.isArray(car.features) && car.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="p-1 mr-2 text-blue-600 bg-blue-100 rounded-full"><FaCheck size={12} /></span>
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
            <div className="sticky p-6 mb-6 bg-white rounded-lg shadow-md top-4">
              <h2 className="mb-4 text-xl font-semibold">Book This Car</h2>
              
              <div className="mb-6">
                <h3 className="mb-2 font-semibold">Rental Prices</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-gray-600">Daily Rate:</div>
                  <div className="font-semibold">{car.price ? `$${car.price}` : ''}</div>
                </div>
              </div>
              
              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Booking Dates</label>
                  
                  {/* Display rental price and car availability after selecting dates */}
                  {pickupDate && returnDate && (
                    <div className="p-3 mb-4 text-sm text-green-700 rounded-lg bg-green-50">
                      <div className="flex items-center font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Rental duration: {totalDays} {totalDays === 1 ? 'day' : 'days'}
                      </div>
                      <div className="mt-1">
                        From {new Date(pickupDate).toLocaleDateString('en-US')} to {new Date(returnDate).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 mb-2">
                    <div className="mb-2 text-sm text-gray-600">
                      {!pickupDate && !returnDate ? (
                        <div className="flex items-center p-2 text-blue-700 rounded bg-blue-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Select a pickup date
                        </div>
                      ) : pickupDate && !returnDate ? (
                        <div className="flex items-center p-2 text-blue-700 rounded bg-blue-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Select a return date
                        </div>
                      ) : null}
                    </div>
                    
                    {/* Wrap calendar in div instead of form to avoid submission */}
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="relative calendar-container"
                    >
                      {/* Refresh indicator overlay */}
                      {isRefreshingCalendar && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-blue-200 border-solid rounded-full border-t-blue-600 animate-spin"></div>
                            <p className="mt-2 text-sm text-gray-600">Updating calendar...</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Use React.memo to avoid unnecessary re-rendering */}
                      <BookingCalendar
                        bookedDates={bookedDates}
                        onDateSelect={handleDateSelect}
                        selectedStartDate={pickupDate}
                        selectedEndDate={returnDate}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>* Booked dates are shown in red and cannot be selected</span>
                      <button 
                        type="button" 
                        className="px-3 py-1 text-sm text-blue-500 rounded-md hover:underline hover:bg-blue-50"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent form submission
                          // Clear selected dates
                          setPickupDate('');
                          setReturnDate('');
                          // Reset state to find available dates
                          setHasFoundAvailableDates(false);
                          setAutoFindingDates(false);
                          // Find available dates after a short delay
                          setTimeout(() => {
                            findAvailableDates();
                          }, 100);
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium">Pickup Location</label>
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
                  <h3 className="mb-3 font-semibold text-gray-700">Additional Services</h3>
                  
                  <div className="flex items-center justify-between p-3 mb-2 rounded bg-gray-50">
                    <div>
                      <div className="font-medium">Include Driver</div>
                      <div className="text-sm text-gray-500">Professional driver for your journey</div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-gray-600">${30}/day</span>
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
                  
                  <div className="flex items-center justify-between p-3 rounded bg-gray-50">
                    <div>
                      <div className="font-medium">Doorstep Delivery</div>
                      <div className="text-sm text-gray-500">We'll deliver the car to your location</div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-gray-600">$25</span>
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
                
                <div className="p-4 mb-6 rounded-lg bg-gray-50">
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
                  <div className="flex justify-between pt-2 mt-2 text-lg font-bold border-t border-gray-300">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
                    !pickupDate || !returnDate
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={!pickupDate || !returnDate}
                >
                  {!pickupDate || !returnDate ? (
                    'Please select dates'
                  ) : (
                    'Book Now'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 