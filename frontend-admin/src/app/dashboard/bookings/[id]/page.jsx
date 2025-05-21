"use client";

import { useState, useEffect, use } from 'react';
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
  const { id: bookingId } = use(params);
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
      
      const response = await bookingsAPI.getBookingById(bookingId);
      
      if (response.data?.data) {
        setBooking(response.data.data);
      } else {
        setError('Booking information not found');
      }
    } catch (err) {
      console.error('Failed to fetch booking details:', err);
      setError('Unable to load booking information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateOnly = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
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
      
      const response = await bookingsAPI.updateBookingStatus(bookingId, 'confirmed');
      
      if (response.success) {
        // Update booking
        setBooking(prevBooking => ({
          ...prevBooking,
          status: 'confirmed',
          updatedAt: new Date().toISOString()
        }));
        
        setSuccess('Booking has been confirmed successfully');
      } else {
        setError(response.message || 'Unable to confirm booking. Please try again later.');
      }
    } catch (err) {
      console.error('Failed to confirm booking:', err);
      setError('Unable to confirm booking. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteBooking = async () => {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      
      const response = await bookingsAPI.updateBookingStatus(bookingId, 'completed');
      
      if (response.success) {
        // Update booking
        setBooking(prevBooking => ({
          ...prevBooking,
          status: 'completed',
          updatedAt: new Date().toISOString()
        }));
        
        setSuccess('Booking has been marked as completed');
      } else {
        setError(response.message || 'Unable to complete booking. Please try again later.');
      }
    } catch (err) {
      console.error('Failed to complete booking:', err);
      setError('Unable to complete booking. Please try again later.');
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
      setError('Please enter a reason for cancellation');
      return;
    }
    
    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      
      const response = await bookingsAPI.cancelBooking(bookingId, cancelReason);
      
      if (response.success) {
        // Update booking
        setBooking(prevBooking => ({
          ...prevBooking,
          status: 'cancelled',
          cancellationReason: cancelReason,
          updatedAt: new Date().toISOString()
        }));
        
        setSuccess('Booking has been cancelled successfully');
        closeCancelModal();
      } else {
        setError(response.message || 'Unable to cancel booking. Please try again later.');
        closeCancelModal();
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      setError('Unable to cancel booking. Please try again later.');
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
          <p className="mt-4 text-gray-600">Loading booking information...</p>
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
                Booking information not found
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>The booking does not exist or has been deleted.</p>
              </div>
              <div className="mt-4">
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to list
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
          Back to list
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
                Confirm Booking
              </button>
              
              <button
                type="button"
                onClick={openCancelModal}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Booking
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
                Complete
              </button>
              
              <button
                type="button"
                onClick={openCancelModal}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Booking
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
      
      {/* Booking Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Main Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <h1 className="text-xl font-bold">Booking Details #{booking.bookingCode}</h1>
                <p className="text-gray-600 mt-1">Created: {formatDate(booking.createdAt)}</p>
              </div>
              <div className={`px-4 py-2 rounded-md border flex items-center space-x-2 ${getStatusClass(booking.status)}`}>
                {getStatusIcon(booking.status)}
                <span className="font-medium">{getStatusText(booking.status)}</span>
              </div>
            </div>
            
            {/* Rental Period */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Rental Period</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex">
                  <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pickup Date</p>
                    <p className="font-medium">{formatDateOnly(booking.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Return Date</p>
                    <p className="font-medium">{formatDateOnly(booking.endDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between">
                  <p className="text-gray-600">Total rental duration:</p>
                  <p className="font-medium">{booking.totalDays || 3} days</p>
                </div>
              </div>
            </div>
            
            {/* Locations */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-medium">{booking.pickupLocation || 'Tan Son Nhat Airport, Ho Chi Minh City'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Return Location</p>
                  <p className="font-medium">{booking.dropoffLocation || 'Tan Son Nhat Airport, Ho Chi Minh City'}</p>
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Payment Information</h2>
              <div className="flex mb-2">
                <div className="mr-3 bg-green-100 text-green-600 p-2 rounded-md">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{booking.paymentMethod || 'Cash on pickup'}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mt-3">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Daily Rate:</p>
                  <p>{formatCurrency(booking.car?.price?.daily || 1200000)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Rental Days:</p>
                  <p>{booking.totalDays || 3} days</p>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <p className="font-semibold">Total:</p>
                  <p className="font-bold text-lg">{formatCurrency(booking.totalAmount)}</p>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            {booking.notes && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Notes</h2>
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p className="text-gray-700">{booking.notes}</p>
                </div>
              </div>
            )}
            
            {/* Cancellation Reason */}
            {booking.status === 'cancelled' && booking.cancellationReason && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Cancellation Reason</h2>
                <div className="p-4 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-gray-700">{booking.cancellationReason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium">{booking.customer?.name || booking.customer?.firstName || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium">{booking.customer?.phone || booking.customer?.phoneNumber || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{booking.customer?.email || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {/* Car Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
            
            {booking.car?.images && booking.car.images.length > 0 && (
              <div className="mb-4">
                <img 
                  src={booking.car.images[0].url} 
                  alt={booking.car.name || booking.car.brand} 
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle Name</p>
                <p className="font-medium">{booking.car?.name || (booking.car?.brand && booking.car?.model ? `${booking.car.brand} ${booking.car.model}` : 'N/A')}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">License Plate</p>
                <p className="font-medium">{booking.car?.licensePlate || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="mr-3 bg-blue-100 text-blue-600 p-2 rounded-md">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Daily Rate</p>
                <p className="font-medium">{formatCurrency(booking.car?.price?.daily || 1200000)}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <Link
                href={`/dashboard/cars/${booking.car?._id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                View car details
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeCancelModal}></div>
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Booking Cancellation</h3>
              <p className="mt-2 text-sm text-gray-500">
                Please enter a reason for cancelling this booking.
              </p>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation"
              ></textarea>
            </div>
            
            <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={closeCancelModal}
              >
                Close
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleCancelBooking}
                disabled={processing || !cancelReason.trim()}
              >
                {processing ? 'Processing...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 