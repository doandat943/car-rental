"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { bookingsAPI, API_BASE_URL } from '@/lib/api';
import { 
  FaCalendarAlt, 
  FaCar, 
  FaEye, 
  FaSpinner, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaPlay,
  FaStop,
  FaUser
} from 'react-icons/fa';

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, ongoing, completed, cancelled
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserBookings();
  }, [router]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getUserBookings();
      
      if (response?.data?.success) {
        setBookings(response.data.data || []);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } else {
        setError('Failed to load your bookings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: <FaClock className="w-3 h-3" />,
        text: 'Pending'
      },
      confirmed: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: <FaCheckCircle className="w-3 h-3" />,
        text: 'Confirmed'
      },
      ongoing: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <FaPlay className="w-3 h-3" />,
        text: 'Ongoing'
      },
      completed: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: <FaStop className="w-3 h-3" />,
        text: 'Completed'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: <FaTimes className="w-3 h-3" />,
        text: 'Cancelled'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.text}</span>
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getFilterCounts = () => {
    const counts = {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      ongoing: bookings.filter(b => b.status === 'ongoing').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaExclamationTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Bookings</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchUserBookings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filterCounts = getFilterCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaUser className="w-6 h-6 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          </div>
          <p className="text-gray-600">View and manage all your car rental bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Bookings' },
              { key: 'pending', label: 'Pending' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'ongoing', label: 'Ongoing' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {tab.label}
                {filterCounts[tab.key] > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filterCounts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <FaCar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filter === 'all' ? 'No bookings found' : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet. Start by browsing our car collection!"
                : `You don't have any ${filter} bookings at the moment.`
              }
            </p>
            <Link 
              href="/cars"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaCar className="w-4 h-4 mr-2" />
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => {
              const carName = booking.car?.name || `${booking.car?.brand || 'Unknown'} ${booking.car?.model || 'Car'}`;
              const bookingCode = `BK-${booking._id.substr(-6).toUpperCase()}`;
              
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      {/* Car Info & Details */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-4 lg:mb-0">
                        {/* Car Image */}
                        <div className="w-full sm:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {booking.car?.images && booking.car.images.length > 0 ? (
                            <div className="relative w-full h-full">
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
                            <div className="w-full h-full flex items-center justify-center">
                              <FaCar className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{carName}</h3>
                              <p className="text-sm text-gray-600">Booking #{bookingCode}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <FaCalendarAlt className="w-4 h-4 mr-2 text-blue-500" />
                              <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="font-medium text-gray-900">${booking.totalAmount}</span>
                              <span className="ml-1">({booking.totalDays || 1} days)</span>
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Booked:</span> {formatDateTime(booking.createdAt)}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Payment:</span> {booking.paymentStatus || 'Pending'}
                            </div>
                          </div>

                          {/* Additional Services */}
                          {(booking.includeDriver || booking.doorstepDelivery) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {booking.includeDriver && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Driver Included
                                </span>
                              )}
                              {booking.doorstepDelivery && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Doorstep Delivery
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 lg:pt-0 border-t lg:border-t-0">
                        <Link
                          href={`/booking/confirmation/${booking._id}`}
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <FaEye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                        
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => {
                              // TODO: Implement cancel booking functionality
                              alert('Cancel booking functionality will be implemented');
                            }}
                            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            <FaTimes className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 