"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { bookingsAPI } from '@/lib/api';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaCar, 
  FaClock, 
  FaCheckCircle,
  FaSpinner,
  FaChartLine,
  FaCog,
  FaEye,
  FaArrowRight
} from 'react-icons/fa';

export default function AccountDashboard() {
  const [user, setUser] = useState(null);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getUserBookings();
      
      if (response?.data?.success) {
        const bookings = response.data.data || [];
        
        // Calculate stats
        const stats = {
          total: bookings.length,
          pending: bookings.filter(b => b.status === 'pending').length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          ongoing: bookings.filter(b => b.status === 'ongoing').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length
        };
        
        setBookingStats(stats);
        
        // Get recent bookings (last 3)
        const recent = bookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentBookings(recent);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Confirmed' },
      ongoing: { color: 'bg-green-100 text-green-800', text: 'Ongoing' },
      completed: { color: 'bg-gray-100 text-gray-800', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mr-4">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-gray-600">Manage your account and bookings</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaCalendarAlt className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaCar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                  <Link 
                    href="/account/bookings"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    View All
                    <FaArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <FaCar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">Start exploring our car collection!</p>
                    <Link 
                      href="/cars"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaCar className="w-4 h-4 mr-2" />
                      Browse Cars
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => {
                      const carName = booking.car?.name || `${booking.car?.brand || 'Unknown'} ${booking.car?.model || 'Car'}`;
                      const bookingCode = `BK-${booking._id.substr(-6).toUpperCase()}`;
                      
                      return (
                        <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-gray-900">{carName}</h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-sm text-gray-600">#{bookingCode}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="font-semibold text-gray-900">${booking.totalAmount}</p>
                            <Link
                              href={`/booking/confirmation/${booking._id}`}
                              className="text-sm text-blue-600 hover:text-blue-700 flex items-center mt-1"
                            >
                              <FaEye className="w-3 h-3 mr-1" />
                              View
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <Link
                  href="/cars"
                  className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <div className="p-2 bg-blue-600 text-white rounded-lg group-hover:bg-blue-700 transition-colors">
                    <FaCar className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Browse Cars</p>
                    <p className="text-sm text-gray-600">Find your perfect rental</p>
                  </div>
                </Link>

                <Link
                  href="/account/bookings"
                  className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                >
                  <div className="p-2 bg-green-600 text-white rounded-lg group-hover:bg-green-700 transition-colors">
                    <FaCalendarAlt className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">My Bookings</p>
                    <p className="text-sm text-gray-600">View all your rentals</p>
                  </div>
                </Link>

                <Link
                  href="/account/profile"
                  className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                >
                  <div className="p-2 bg-purple-600 text-white rounded-lg group-hover:bg-purple-700 transition-colors">
                    <FaCog className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Profile Settings</p>
                    <p className="text-sm text-gray-600">Update your information</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Account Status</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Account Active</p>
                    <p className="text-sm text-gray-600">Good standing</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Member since: {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}</p>
                  <p>Email: {user?.email || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 