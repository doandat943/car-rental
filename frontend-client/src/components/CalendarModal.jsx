'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaCar, FaCalendarAlt, FaCheck } from 'react-icons/fa';
import { carsAPI } from '@/lib/api';
import { formatDate } from '@/utils/dateUtils';
import dynamic from 'next/dynamic';

// Dynamically import BookingCalendar to avoid SSR issues
const BookingCalendar = dynamic(() => import('@/components/BookingCalendar'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64">Loading calendar...</div>
});

export default function CalendarModal({ isOpen, onClose, car }) {
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  // Fetch booking data when modal opens
  useEffect(() => {
    if (isOpen && car) {
      fetchBookingData();
    }
  }, [isOpen, car]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const fetchBookingData = async () => {
    try {
      setLoading(true);
      
      // Get booking data for next 30 days
      const today = new Date();
      const in30Days = new Date();
      in30Days.setDate(today.getDate() + 30);
      
      const response = await carsAPI.checkStatus(car._id || car.id, {
        startDate: formatDate(today),
        endDate: formatDate(in30Days)
      });
      
      if (response?.bookedDates && Array.isArray(response.bookedDates)) {
        const formattedBookedDates = response.bookedDates.map(booking => ({
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
          status: booking.status || 'booked'
        }));
        
        setBookedDates(formattedBookedDates);
      } else {
        setBookedDates([]);
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
      setBookedDates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    const formattedDate = formatDate(date);
    
    if (!selectedStartDate && !selectedEndDate) {
      setSelectedStartDate(formattedDate);
    } else if (selectedStartDate && !selectedEndDate) {
      if (new Date(formattedDate) > new Date(selectedStartDate)) {
        setSelectedEndDate(formattedDate);
      } else {
        setSelectedStartDate(formattedDate);
        setSelectedEndDate('');
      }
    } else {
      setSelectedStartDate(formattedDate);
      setSelectedEndDate('');
    }
  };

  const handleBookNow = () => {
    if (selectedStartDate && selectedEndDate) {
      // Redirect to car details page with selected dates
      const url = `/cars/${car._id || car.id}?startDate=${selectedStartDate}&endDate=${selectedEndDate}`;
      window.open(url, '_blank');
    }
  };

  const clearSelection = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-2 modal-backdrop sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden modal-content flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 text-white bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <FaCalendarAlt className="text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Booking Calendar</h2>
                <p className="text-sm text-blue-100">Select your rental dates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-lg hover:bg-white/20"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 overflow-y-auto sm:p-4">
          {car && (
            <div className="mb-4 sm:mb-6">
              {/* Car Info */}
              <div className="p-3 mb-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaCar className="text-lg text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{car.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{typeof car.brand === 'object' ? car.brand.name : car.brand}</span>
                      <span>•</span>
                      <span>{typeof car.category === 'object' ? car.category.name : car.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">${car.price}</div>
                    <div className="text-sm text-gray-500">per day</div>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                      <div className="w-6 h-6 mx-auto mb-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                      <p className="text-sm text-gray-600">Loading calendar...</p>
                    </div>
                  </div>
                ) : (
                  <BookingCalendar
                    bookedDates={bookedDates}
                    onDateSelect={handleDateSelect}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-600">
              Select your pickup and return dates to proceed with booking
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
              {selectedStartDate && selectedEndDate && (
                <button
                  onClick={handleBookNow}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <FaCalendarAlt />
                  Continue Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 