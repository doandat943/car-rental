"use client";

import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../../../lib/api';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Car, 
  DollarSign, 
  CheckCircle,
  XCircle,
  ClipboardList,
  CreditCard,
  Phone,
  Mail,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookingDetailsPage({ params }) {
  const bookingId = params.id;
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // API call
      const response = await bookingsAPI.getBookingById(bookingId);
      setBooking(response.data.booking);
      
    } catch (err) {
      console.error('Failed to fetch booking details:', err);
      setError('Không thể tải thông tin đơn đặt xe. Vui lòng thử lại sau.');
      
      // Generate mock data if API fails
      generateMockBooking();
    } finally {
      setLoading(false);
    }
  };

  const generateMockBooking = () => {
    const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    const mockBooking = {
      _id: bookingId,
      bookingCode: `B${100000 + parseInt(bookingId.slice(-4), 16)}`,
      user: {
        _id: 'user-123',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0987654321'
      },
      car: {
        _id: 'car-456',
        name: 'Toyota Fortuner',
        licensePlate: '51F-123.45',
        price: {
          daily: 1200000,
          weekly: 7000000,
          monthly: 25000000
        },
        category: {
          name: 'SUV'
        },
        images: [
          { url: 'https://via.placeholder.com/500x300' }
        ]
      },
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      totalDays: 3,
      pickupLocation: 'Sân bay Tân Sơn Nhất, TP.HCM',
      dropoffLocation: 'Sân bay Tân Sơn Nhất, TP.HCM',
      totalAmount: 3600000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: 'Tiền mặt khi nhận xe',
      notes: 'Cần có ghế trẻ em và GPS',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    setBooking(mockBooking);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const formatDateOnly = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      
      await bookingsAPI.updateBookingStatus(bookingId, 'confirmed');
      
      // Update booking
      setBooking(prevBooking => ({
        ...prevBooking,
        status: 'confirmed',
        updatedAt: new Date().toISOString()
      }));
      
      setSuccess('Đơn đặt xe đã được xác nhận thành công');
      
    } catch (err) {
      console.error('Failed to confirm booking:', err);
      setError('Không thể xác nhận đơn đặt xe. Vui lòng thử lại sau.');
      
      // Update UI for demo
      setBooking(prevBooking => ({
        ...prevBooking,
        status: 'confirmed',
        updatedAt: new Date().toISOString()
      }));
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteBooking = async () => {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      
      await bookingsAPI.updateBookingStatus(bookingId, 'completed');
      
      // Update booking
      setBooking(prevBooking => ({
        ...prevBooking,
        status: 'completed',
        updatedAt: new Date().toISOString()
      }));
      
      setSuccess('Đơn đặt xe đã được đánh dấu hoàn thành');
      
    } catch (err) {
      console.error('Failed to complete booking:', err);
      setError('Không thể hoàn thành đơn đặt xe. Vui lòng thử lại sau.');
      
      // Update UI for demo
      setBooking(prevBooking => ({
        ...prevBooking,
        status: 'completed',
        updatedAt: new Date().toISOString()
      }));
    } finally {
      setProcessing(false);
    }
  };

  const openCancelModal = () => {
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason('');
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      setError('Vui lòng nhập lý do hủy đơn');
      return;
    }
    
    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      
      await bookingsAPI.cancelBooking(bookingId, cancelReason);
      
      // Update booking
      setBooking(prevBooking => ({
        ...prevBooking,
        status: 'cancelled',
        cancellationReason: cancelReason,
        updatedAt: new Date().toISOString()
      }));
      
      setSuccess('Đơn đặt xe đã được hủy thành công');
      closeCancelModal();
      
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      setError('Không thể hủy đơn đặt xe. Vui lòng thử lại sau.');
      
      // Update UI for demo
      setBooking(prevBooking => ({
        ...prevBooking,
        status: 'cancelled',
        cancellationReason: cancelReason,
        updatedAt: new Date().toISOString()
      }));
      closeCancelModal();
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn đặt xe...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Không tìm thấy thông tin đơn đặt xe
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Đơn đặt xe không tồn tại hoặc đã bị xóa.</p>
              </div>
              <div className="mt-4">
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại danh sách đơn đặt xe
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <Link href="/dashboard/bookings" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại danh sách
        </Link>
        
        <div className="ml-auto flex space-x-2 mt-2 sm:mt-0">
          {booking.status === 'pending' && (
            <>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Xác nhận đơn
              </button>
              
              <button
                type="button"
                onClick={openCancelModal}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối đơn
              </button>
            </>
          )}
          
          {booking.status === 'confirmed' && (
            <>
              <button
                type="button"
                onClick={handleCompleteBooking}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Hoàn thành
              </button>
              
              <button
                type="button"
                onClick={openCancelModal}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Hủy đơn
              </button>
            </>
          )}
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
      
      {/* Thông tin đơn đặt xe */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Thông tin chính */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <h1 className="text-xl font-bold">Chi tiết đơn đặt xe #{booking.bookingCode}</h1>
                <p className="text-gray-600 mt-1">Ngày tạo: {formatDate(booking.createdAt)}</p>
              </div>
              <div className={`px-4 py-2 rounded-md border flex items-center space-x-2 ${getStatusClass(booking.status)}`}>
                {getStatusIcon(booking.status)}
                <span className="font-medium">{getStatusText(booking.status)}</span>
              </div>
            </div>
            
            {/* Thông tin thời gian */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Thời gian thuê xe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex">
                  <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày nhận xe</p>
                    <p className="font-medium">{formatDateOnly(booking.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày trả xe</p>
                    <p className="font-medium">{formatDateOnly(booking.endDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between">
                  <p className="text-gray-600">Tổng thời gian thuê:</p>
                  <p className="font-medium">{booking.totalDays || 3} ngày</p>
                </div>
              </div>
            </div>
            
            {/* Thông tin địa điểm */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Địa điểm</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Địa điểm nhận xe</p>
                  <p className="font-medium">{booking.pickupLocation || 'Sân bay Tân Sơn Nhất, TP.HCM'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Địa điểm trả xe</p>
                  <p className="font-medium">{booking.dropoffLocation || 'Sân bay Tân Sơn Nhất, TP.HCM'}</p>
                </div>
              </div>
            </div>
            
            {/* Thông tin thanh toán */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Thông tin thanh toán</h2>
              <div className="flex mb-2">
                <div className="mr-3 bg-green-100 text-green-600 p-2 rounded-md">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                  <p className="font-medium">{booking.paymentMethod || 'Tiền mặt khi nhận xe'}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mt-3">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Giá thuê xe / ngày:</p>
                  <p>{formatCurrency(booking.car?.price?.daily || 1200000)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Số ngày thuê:</p>
                  <p>{booking.totalDays || 3} ngày</p>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <p className="font-semibold">Tổng cộng:</p>
                  <p className="font-bold text-lg">{formatCurrency(booking.totalAmount)}</p>
                </div>
              </div>
            </div>
            
            {/* Ghi chú */}
            {booking.notes && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Ghi chú</h2>
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p className="text-gray-700">{booking.notes}</p>
                </div>
              </div>
            )}
            
            {/* Lý do hủy */}
            {booking.status === 'cancelled' && booking.cancellationReason && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Lý do hủy</h2>
                <div className="p-4 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-gray-700">{booking.cancellationReason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {/* Thông tin khách hàng */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Khách hàng</p>
                <p className="font-medium">{booking.user.name}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-medium">{booking.user.phone}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{booking.user.email}</p>
              </div>
            </div>
          </div>
          
          {/* Thông tin xe */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin xe</h2>
            
            {booking.car.images && booking.car.images.length > 0 && (
              <div className="mb-4">
                <img 
                  src={booking.car.images[0].url} 
                  alt={booking.car.name} 
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tên xe</p>
                <p className="font-medium">{booking.car.name}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Biển số xe</p>
                <p className="font-medium">{booking.car.licensePlate}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Giá thuê / ngày</p>
                <p className="font-medium">{formatCurrency(booking.car?.price?.daily || 1200000)}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <Link
                href={`/dashboard/cars/${booking.car._id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Xem chi tiết xe
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal xác nhận hủy đơn */}
      {showCancelModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeCancelModal}></div>
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Xác nhận hủy đơn đặt xe</h3>
              <p className="mt-2 text-sm text-gray-500">
                Vui lòng nhập lý do hủy đơn đặt xe này.
              </p>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do hủy đơn <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy đơn đặt xe"
              ></textarea>
            </div>
            
            <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={closeCancelModal}
              >
                Đóng
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleCancelBooking}
                disabled={processing || !cancelReason.trim()}
              >
                {processing ? 'Đang xử lý...' : 'Hủy đơn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 