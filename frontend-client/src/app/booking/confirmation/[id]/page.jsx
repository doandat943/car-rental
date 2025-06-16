"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { bookingsAPI, API_BASE_URL } from '@/lib/api';
import { FaCheckCircle, FaCar, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';

// Format date for display
const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function BookingConfirmationPage({ params }) {
  const { id } = use(params);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await bookingsAPI.getBookingById(id);
        
        if (response?.data?.data) {
          setBooking(response.data.data);
          console.log('Booking data:', response.data.data);
          console.log('Car data:', response.data.data.car);
        } else {
          setError('Booking details not found');
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading booking details...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  // Build car name from available data
  let carName = 'Unknown Car';
  if (booking.car?.name) {
    carName = booking.car.name;
  } else if (booking.car) {
    const brand = booking.car.brand?.name || booking.car.brand || '';
    const model = booking.car.model?.name || booking.car.model || '';
    if (brand && model) {
      carName = `${brand} ${model}`;
    } else if (brand) {
      carName = brand;
    } else if (model) {
      carName = model;
    }
  }
  const bookingCode = `BK-${booking._id.substr(-6).toUpperCase()}`;
  
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-6 text-center">
            <FaCheckCircle className="mx-auto text-4xl mb-3" />
            <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
            <p className="text-green-100">Your booking has been successfully placed</p>
            <div className="mt-4 bg-white/20 rounded-lg py-2 px-4 inline-block">
              <span className="font-medium">Booking Reference:</span> {bookingCode}
            </div>
          </div>
          
          {/* Car Details */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Car Details</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3 bg-gray-100 rounded-lg overflow-hidden">
                {booking.car?.images && booking.car.images.length > 0 ? (
                  <div className="relative h-40">
                    <Image 
                      src={booking.car.images[0].startsWith('http') 
                        ? booking.car.images[0] 
                        : `${API_BASE_URL}${booking.car.images[0]}`
                      }
                      alt={carName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center">
                    <FaCar className="text-gray-400 text-5xl" />
                  </div>
                )}
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-lg font-semibold">{carName}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span> {booking.car?.category?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="text-gray-500">Year:</span> {booking.car?.year || 'N/A'}
                  </div>
                  <div>
                    <span className="text-gray-500">Transmission:</span> {booking.car?.transmission?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="text-gray-500">Fuel:</span> {booking.car?.fuel?.name || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Details */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FaCalendarAlt className="text-blue-500 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">Pickup Date</h4>
                  <p>{formatDisplayDate(booking.startDate)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaCalendarAlt className="text-blue-500 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">Return Date</h4>
                  <p>{formatDisplayDate(booking.endDate)}</p>
                </div>
              </div>

            </div>
            
            {/* Additional Services */}
            {(booking.includeDriver || booking.doorstepDelivery) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-2">Additional Services</h4>
                <ul className="text-sm">
                  {booking.includeDriver && (
                    <li className="flex items-center mb-1">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span>Professional Driver (${booking.driverFee})</span>
                    </li>
                  )}
                  {booking.doorstepDelivery && (
                    <li className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span>Doorstep Delivery (${booking.deliveryFee})</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          
          {/* Payment Summary */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
            
            {/* Payment Method and Type */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaCreditCard className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">
                    {booking.paymentMethod === 'credit_card' && 'Credit Card'}
                    {booking.paymentMethod === 'paypal' && 'PayPal'}
                    {booking.paymentMethod === 'cash' && 'Cash on Pickup'}
                    {booking.paymentMethod === 'demo' && 'Demo Payment'}
                    {!['credit_card', 'paypal', 'cash', 'demo'].includes(booking.paymentMethod) && 'Other'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Payment Type</p>
                  <p className="font-medium">
                    {booking.paymentType === 'deposit' ? 'Deposit Payment' : 'Full Payment'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Base Rental Fee:</span>
                <span>${booking.totalAmount - (booking.driverFee || 0) - (booking.deliveryFee || 0)}</span>
              </div>
              {booking.includeDriver && (
                <div className="flex justify-between mb-2">
                  <span>Driver Service:</span>
                  <span>${booking.driverFee}</span>
                </div>
              )}
              {booking.doorstepDelivery && (
                <div className="flex justify-between mb-2">
                  <span>Doorstep Delivery:</span>
                  <span>${booking.deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
                <span>Total Amount:</span>
                <span>${booking.totalAmount}</span>
              </div>
              
              {/* Payment breakdown for deposit payments */}
              {booking.paymentType === 'deposit' && booking.depositAmount > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600">✓ Paid (Deposit):</span>
                    <span className="font-medium text-green-600">${booking.depositAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">Remaining (Pay on pickup):</span>
                    <span className="font-medium text-orange-600">${booking.remainingAmount || 0}</span>
                  </div>
                </div>
              )}
              
              <div className="mt-3 text-center text-sm text-gray-500">
                <p>Payment Status: {booking.paymentStatus || 'Pending'}</p>
                {booking.termsAccepted && (
                  <p className="text-green-600 mt-1">✓ Terms & Conditions Accepted</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-6 flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Return to Home
            </Link>
            <Link 
              href="/user/bookings"
              className="bg-gray-100 text-gray-700 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition"
            >
              View All Bookings
            </Link>
          </div>
        </div>
        
        {/* Extra information */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>A confirmation email has been sent to your registered email address.</p>
          <p className="mt-2">If you have any questions about your booking, please contact our customer support.</p>
        </div>
      </div>
    </main>
  );
} 