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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [processingBookingId, setProcessingBookingId] = useState(null);
  
  const ITEMS_PER_PAGE = 10;
  
  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Đang chờ xử lý' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'completed', label: 'Hoàn thành' }
  ];

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter, dateFilter]);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchBookings();
    }, 500);
    
    setDebounceTimeout(timeout);
    
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchQuery]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
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
      
      // Handle different response formats
      let bookingsData = [];
      let paginationData = { totalPages: 1, totalItems: 0 };
      
      if (response.data) {
        // If response has nested data structure
        if (response.data.bookings) {
          bookingsData = response.data.bookings;
          paginationData = response.data.pagination || paginationData;
        } else if (Array.isArray(response.data)) {
          // If response.data is directly the array of bookings
          bookingsData = response.data;
        }
      } else if (Array.isArray(response)) {
        // If response itself is the array of bookings
        bookingsData = response;
      }
      
      setBookings(bookingsData);
      setTotalPages(paginationData.totalPages || 1);
      setTotalItems(paginationData.totalItems || bookingsData.length);
      
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Không thể tải danh sách đặt xe. Vui lòng thử lại sau.');
      setBookings([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
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
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
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
        return 'Đang chờ xử lý';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      setProcessingBookingId(bookingId);
      setError('');
      setSuccess('');
      
      await bookingsAPI.updateBookingStatus(bookingId, 'confirmed');
      
      // Update the booking in the list
      setBookings(prevBookings => prevBookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ));
      
      setSuccess('Đơn đặt xe đã được xác nhận thành công');
      
    } catch (err) {
      console.error('Failed to confirm booking:', err);
      setError('Không thể xác nhận đơn đặt xe. Vui lòng thử lại sau.');
      
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
      
      await bookingsAPI.cancelBooking(bookingId, 'Cancelled by admin');
      
      // Update the booking in the list
      setBookings(prevBookings => prevBookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
      
      setSuccess('Đơn đặt xe đã được hủy thành công');
      
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      setError('Không thể hủy đơn đặt xe. Vui lòng thử lại sau.');
      
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
      
      await bookingsAPI.updateBookingStatus(bookingId, 'completed');
      
      // Update the booking in the list
      setBookings(prevBookings => prevBookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'completed' } : booking
      ));
      
      setSuccess('Đơn đặt xe đã được đánh dấu hoàn thành');
      
    } catch (err) {
      console.error('Failed to complete booking:', err);
      setError('Không thể hoàn thành đơn đặt xe. Vui lòng thử lại sau.');
      
      // Update UI for demo
      setBookings(prevBookings => prevBookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'completed' } : booking
      ));
    } finally { 
      setProcessingBookingId(null);
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quản lý đơn đặt xe</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Danh sách các đơn đặt xe trong hệ thống
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link
            href="/dashboard/bookings/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm đơn đặt mới
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
      
      {/* Thanh công cụ filter và tìm kiếm */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Tìm theo mã đặt xe, tên khách hàng..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={fetchBookings}
          >
            <span className="px-3 py-1 text-xs text-white bg-blue-600 rounded-md">Tìm</span>
          </button>
        </div>
      
        <div className="flex flex-col md:flex-row gap-4">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
              setDateFilter({ startDate: '', endDate: '' });
              setCurrentPage(1);
              fetchBookings();
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
      
      {/* Bảng đơn đặt xe */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">MÃ ĐƠN</th>
                <th scope="col" className="px-6 py-3">KHÁCH HÀNG</th>
                <th scope="col" className="px-6 py-3">XE</th>
                <th scope="col" className="px-6 py-3">NGÀY THUÊ</th>
                <th scope="col" className="px-6 py-3">TỔNG TIỀN</th>
                <th scope="col" className="px-6 py-3">TRẠNG THÁI</th>
                <th scope="col" className="px-6 py-3 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy đơn đặt xe nào
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {booking.bookingCode || `B${booking._id.substr(-6)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>{booking.user?.name}</div>
                      <div className="text-xs text-gray-400">{booking.user?.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>{booking.car?.name}</div>
                      <div className="text-xs text-gray-400">{booking.car?.licensePlate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>Từ: {formatDate(booking.startDate)}</div>
                      <div>Đến: {formatDate(booking.endDate)}</div>
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
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmBooking(booking._id)}
                              disabled={processingBookingId === booking._id}
                              className="text-green-600 hover:text-green-900 flex items-center"
                              title="Xác nhận đặt xe"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={processingBookingId === booking._id}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Từ chối đặt xe"
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
                              title="Đánh dấu hoàn thành"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={processingBookingId === booking._id}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Hủy đặt xe"
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
        
        {/* Phân trang */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Hiển thị <span className="font-medium">{bookings.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> đến <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> trong tổng số <span className="font-medium">{totalItems}</span> đơn đặt xe
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