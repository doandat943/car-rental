"use client";

import { useState, useEffect } from 'react';
import { bookingsAPI, usersAPI, carsAPI } from '../../../lib/api';
import { 
  Calendar, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [processingBookingId, setProcessingBookingId] = useState(null);
  
  const ITEMS_PER_PAGE = 10;
  
  const statusOptions = [
    { value: '', label: 'All status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];

  // Combine all search parameters into a single object for tracking changes
  const searchParams = {
    page: currentPage,
    status: statusFilter,
    query: searchQuery,
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate
  };

  // Fetch data whenever search parameters change
  useEffect(() => {
    // If searching, use timeout for debounce
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (!initialLoad || searchParams.query || searchParams.status || searchParams.startDate || searchParams.endDate) {
        fetchBookings();
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchParams.page, searchParams.status, searchParams.query, searchParams.startDate, searchParams.endDate]);

  // Initial fetch when component mounts
  useEffect(() => {
    if (initialLoad) {
      fetchBookings();
      setInitialLoad(false);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      // Only show loading state when not the first load
      if (!initialLoad) {
        setLoading(true);
      }
      setError('');
      
      // Build query parameters
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery
      };
      
      if (statusFilter) {
        params.status = statusFilter;
      }
      
      if (dateFilter.startDate) {
        params.startDate = dateFilter.startDate;
      }
      
      if (dateFilter.endDate) {
        params.endDate = dateFilter.endDate;
      }
      
      // API call
      const response = await bookingsAPI.getAllBookings(params);
      
      if (response.success) {
        // API returns bookings array nested inside data object
        if (response.data && response.data.bookings) {
          const bookingsData = response.data.bookings;
          
          // Log the first booking to debug structure
          if (bookingsData.length > 0) {
            console.log('Sample booking data:', bookingsData[0]);
          }
          
          setBookings(bookingsData);
          setTotalPages(response.data.totalPages || 1);
          setTotalItems(response.data.totalBookings || 0);
        } else {
          // Fallback to previous structure if needed
          const bookingsData = Array.isArray(response.data) ? response.data : [];
          
          setBookings(bookingsData);
          setTotalPages(response.meta?.totalPages || 1);
          setTotalItems(response.meta?.totalItems || 0);
        }
      } else {
        setError('Unable to load booking list. Please try again later.');
        setBookings([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Unable to load booking list. Please try again later.');
      setBookings([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      setProcessingBookingId(bookingId);
      setError('');
      setSuccess('');
      
      const response = await bookingsAPI.updateBookingStatus(bookingId, 'confirmed');
      
      if (response.success) {
        // Update the booking in the list
        setBookings(prevBookings => prevBookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
        ));
        
        setSuccess('Booking has been confirmed successfully');
      } else {
        setError(response.message || 'Unable to confirm booking. Please try again later.');
      }
    } catch (err) {
      console.error('Failed to confirm booking:', err);
      setError('Unable to confirm booking. Please try again later.');
      
      // Update UI for demo
      setBookings(prevBookings => prevBookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ));
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setProcessingBookingId(bookingId);
      setError('');
      setSuccess('');
      
      const response = await bookingsAPI.cancelBooking(bookingId, 'Cancelled by admin');
      
      if (response.data?.success) {
        // Update the booking in the list
        setBookings(prevBookings => prevBookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
        ));
        
        setSuccess('Booking has been cancelled successfully');
      } else {
        setError(response.data?.message || 'Unable to cancel booking. Please try again later.');
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      setError('Unable to cancel booking. Please try again later.');
      
      // Update UI for demo
      setBookings(prevBookings => prevBookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      setProcessingBookingId(bookingId);
      setError('');
      setSuccess('');
      
      const response = await bookingsAPI.updateBookingStatus(bookingId, 'completed');
      
      if (response.data?.success) {
        // Update the booking in the list
        setBookings(prevBookings => prevBookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: 'completed' } : booking
        ));
        
        setSuccess('Booking has been marked as completed');
      } else {
        setError(response.data?.message || 'Unable to complete booking. Please try again later.');
      }
    } catch (err) {
      console.error('Failed to complete booking:', err);
      setError('Unable to complete booking. Please try again later.');
      
      // Update UI for demo
      setBookings(prevBookings => prevBookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'completed' } : booking
      ));
    } finally { 
      setProcessingBookingId(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setDateFilter({ startDate: '', endDate: '' });
    setCurrentPage(1);
    fetchBookings();
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Booking Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            List of bookings in the system
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link
            href="/dashboard/bookings/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Booking
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
          {success}
        </div>
      )}
      
      {/* Search and filter toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search by booking ID, customer name..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={fetchBookings}
          >
            <span className="px-3 py-1 text-xs text-white bg-blue-600 rounded-md">Search</span>
          </button>
        </div>
      
        <div className="flex flex-col md:flex-row gap-4">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[140px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset filters
          </button>
        </div>
      </div>
      
      {/* Booking list table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">BOOKING ID</th>
                <th scope="col" className="px-6 py-3">CUSTOMER</th>
                <th scope="col" className="px-6 py-3">CAR</th>
                <th scope="col" className="px-6 py-3">RENTAL DATE</th>
                <th scope="col" className="px-6 py-3">TOTAL AMOUNT</th>
                <th scope="col" className="px-6 py-3">STATUS</th>
                <th scope="col" className="px-6 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Loading data...</p>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {booking.bookingCode || `B${booking._id.substr(-6)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        {booking.customer ? (
                          booking.customer.name || 
                          (booking.customer.firstName && booking.customer.lastName 
                            ? `${booking.customer.firstName} ${booking.customer.lastName}`
                            : booking.customer.firstName || booking.customer.lastName || 'Unknown')
                        ) : 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.customer?.phone || booking.customer?.phoneNumber || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>{booking.car?.name || booking.car?.brand ? `${booking.car.brand} ${booking.car.model}` : (booking.car && typeof booking.car === 'string' ? booking.car : 'Unknown')}</div>
                      <div className="text-xs text-gray-400">{booking.car?.licensePlate || 'No plate'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>From: {formatDate(booking.startDate)}</div>
                      <div>To: {formatDate(booking.endDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {formatAmount(booking.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/bookings/${booking._id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmBooking(booking._id)}
                              disabled={processingBookingId === booking._id}
                              className="text-green-600 hover:text-green-900 flex items-center"
                              title="Confirm booking"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={processingBookingId === booking._id}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Reject booking"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleCompleteBooking(booking._id)}
                              disabled={processingBookingId === booking._id}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                              title="Mark as completed"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={processingBookingId === booking._id}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Cancel booking"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-medium">{bookings.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-medium">{totalItems}</span> bookings
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${currentPage === i + 1 ? 'bg-blue-50 border-blue-500 text-blue-600 z-10 dark:bg-blue-900 dark:text-blue-200' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'} text-sm font-medium`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 