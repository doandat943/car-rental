"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, startOfWeek, addDays, isAfter, isBefore, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'; // Import arrow icons

const BookingCalendar = ({ bookedDates, onDateSelect, selectedStartDate, selectedEndDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [hoverDate, setHoverDate] = useState(null);
  const [animationDirection, setAnimationDirection] = useState(null); // 'up' or 'down'
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevMonthDays, setPrevMonthDays] = useState([]);
  const [nextMonthDays, setNextMonthDays] = useState([]);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  
  // Convert dates from string to Date objects if needed
  const parsedStartDate = useMemo(() => selectedStartDate ? new Date(selectedStartDate) : null, [selectedStartDate]);
  const parsedEndDate = useMemo(() => selectedEndDate ? new Date(selectedEndDate) : null, [selectedEndDate]);
  
  // Calculate days for the current month
  const calculateDays = (month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const startDate = startOfWeek(monthStart);
    
    // Get all days in month plus days to complete weeks
    const days = [];
    let day = startDate;
    
    // Generate 6 weeks (42 days) to ensure we have enough days for any month
    for (let i = 0; i < 42; i++) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }
    
    return days;
  };
  
  // Update calendar days for the current, next and previous months
  useEffect(() => {
    const days = calculateDays(currentMonth);
    setCalendarDays(days);
    
    // Also prepare previous and next month days for smooth transition
    const prevMonth = subMonths(currentMonth, 1);
    const nextMonth = addMonths(currentMonth, 1);
    setPrevMonthDays(calculateDays(prevMonth));
    setNextMonthDays(calculateDays(nextMonth));
    
    // Update display month without animation when currentMonth changes
    if (!isAnimating) {
      setDisplayMonth(currentMonth);
    }
  }, [currentMonth]);
  
  // Convert dates from string to Date objects if needed
  const processBookedDates = useMemo(() => {
    if (!bookedDates || !Array.isArray(bookedDates) || bookedDates.length === 0) {
      return [];
    }
    
    return bookedDates.map(booking => {
      if (booking.startDate instanceof Date && booking.endDate instanceof Date) {
        return booking;
      }
      
      return {
        ...booking,
        startDate: booking.startDate instanceof Date ? booking.startDate : new Date(booking.startDate),
        endDate: booking.endDate instanceof Date ? booking.endDate : new Date(booking.endDate)
      };
    });
  }, [bookedDates]);
  
  // Check if a date is booked
  const isDateBooked = useCallback((date) => {
    // Validate date
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('isDateBooked in BookingCalendar received invalid date:', date);
      return false;
    }
    
    // If no booked dates, nothing is booked
    if (!processBookedDates || processBookedDates.length === 0) {
      return false;
    }
    
    // Ensure we compare only dates, not times
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    for (const booking of processBookedDates) {
      try {
        const start = new Date(booking.startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(booking.endDate);
        end.setHours(0, 0, 0, 0);
        
        // Check if the date falls within a booked period
        if (isWithinInterval(compareDate, { start, end })) {
          return true;
        }
      } catch (error) {
        console.error('Error checking booked date:', error);
      }
    }
    
    return false;
  }, [processBookedDates]);
  
  // Check if date is within selected range
  const isInSelectedRange = useCallback((date) => {
    if (!selectedStartDate || !date) return false;
    
    // Ensure we compare only dates, not times
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    const start = new Date(selectedStartDate);
    start.setHours(0, 0, 0, 0);
    
    if (selectedEndDate) {
      const end = new Date(selectedEndDate);
      end.setHours(0, 0, 0, 0);
      
      // Check if date is between start and end
      return isAfter(compareDate, start) && isBefore(compareDate, end);
    }
    
    return false;
  }, [selectedStartDate, selectedEndDate]);
  
  // Check if date is the start date
  const isStartDate = useCallback((date) => {
    if (!parsedStartDate) return false;
    return isSameDay(new Date(date), parsedStartDate);
  }, [parsedStartDate]);
  
  // Check if date is the end date
  const isEndDate = useCallback((date) => {
    if (!parsedEndDate) return false;
    return isSameDay(new Date(date), parsedEndDate);
  }, [parsedEndDate]);
  
  // Check if date is in hover range
  const isInHoverRange = useCallback((date) => {
    if (!parsedStartDate || !hoverDate || parsedEndDate) return false;
    
    const start = parsedStartDate;
    const hover = new Date(hoverDate);
    
    // Ensure we compare only by date, month, year
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    const compareStart = new Date(start);
    compareStart.setHours(0, 0, 0, 0);
    
    const compareHover = new Date(hover);
    compareHover.setHours(0, 0, 0, 0);
    
    // Handle both cases: hover date before or after start date
    if (compareStart <= compareHover) {
      return (compareDate.getTime() >= compareStart.getTime() && compareDate.getTime() <= compareHover.getTime());
    } else {
      return (compareDate.getTime() <= compareStart.getTime() && compareDate.getTime() >= compareHover.getTime());
    }
  }, [parsedStartDate, parsedEndDate, hoverDate]);
  
  // Navigate to previous month with smooth transition
  const prevMonth = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isAnimating) return;
    
    // Set animation direction and trigger animation
    setAnimationDirection('up');
    setIsAnimating(true);
    
    // Update display month immediately to show previous month
    setDisplayMonth(subMonths(currentMonth, 1));
    
    // Wait for animation to complete before changing current month
    setTimeout(() => {
      setCurrentMonth(prev => subMonths(prev, 1));
      setIsAnimating(false);
    }, 300);
  };
  
  // Navigate to next month with smooth transition
  const nextMonth = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isAnimating) return;
    
    // Set animation direction and trigger animation  
    setAnimationDirection('down');
    setIsAnimating(true);
    
    // Update display month immediately to show next month
    setDisplayMonth(addMonths(currentMonth, 1));
    
    // Wait for animation to complete before changing current month
    setTimeout(() => {
      setCurrentMonth(prev => addMonths(prev, 1));
      setIsAnimating(false);
    }, 300);
  };
  
  // Format day of week header
  const formatWeekdayShort = useCallback((day) => {
    return format(day, 'EEEEE', { locale: enUS });
  }, []);
  
  // Handle date click
  const handleDateClick = useCallback((date, e) => {
    // Prevent default behavior to avoid page reload
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Strict check for booked dates
    if (isDateBooked(date)) {
      console.log(`Cannot select date ${format(date, 'MM/dd/yyyy')} as it is already booked`);
      return; // Prevent selection
    }
    
    // Cho phép chọn tất cả các ngày không bị đặt
    if (onDateSelect) {
      console.log(`Selected date: ${format(date, 'MM/dd/yyyy')}`);
      
      // Fix timezone issues: Create an exact copy with appropriate time
      const selectedDate = new Date(date);
      
      // Save info about day, month, year from the selected date
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();
      
      // Recreate date with clear info, set time to noon to avoid timezone issues
      const correctedDate = new Date(year, month, day, 12, 0, 0, 0);
      
      // Pass timezone-processed date
      onDateSelect(correctedDate);
    }
  }, [isDateBooked, onDateSelect]);
  
  // Handle mouse enter on date
  const handleMouseEnter = useCallback((date, e) => {
    if (e) {
      e.stopPropagation();
    }
    if (!parsedStartDate || parsedEndDate || isDateBooked(date)) return;
    setHoverDate(date);
  }, [parsedStartDate, parsedEndDate, isDateBooked]);
  
  // Handle mouse leave
  const handleMouseLeave = useCallback((e) => {
    if (e) {
      e.stopPropagation();
    }
    setHoverDate(null);
  }, []);
  
  // Generate weekday headers
  const weekdayShort = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2021, 0, i + 1); // January 2021 to get weekdays
      return formatWeekdayShort(date);
    });
  }, [formatWeekdayShort]);
  
  // Render days for a specific month
  const renderDays = (daysArray, monthToDisplay) => {
    return daysArray.map((day, i) => {
      const isBooked = isDateBooked(day);
      const isSelected = isInSelectedRange(day);
      const isPast = day < new Date();
      const isToday = isSameDay(day, new Date());
      const isCurrentMonth = isSameMonth(day, monthToDisplay);
      const isStart = isStartDate(day);
      const isEnd = isEndDate(day);
      const isHovering = isInHoverRange(day);
      
      // Get day of month
      const dayOfMonth = format(day, 'd');
      
      // Determine left and right rounded corners for range selection
      let roundedClass = '';
      if (isStart) roundedClass += ' rounded-l-full';
      if (isEnd) roundedClass += ' rounded-r-full';
      
      // Determine if this is a hovering edge
      let hoverEdgeClass = '';
      if (hoverDate && parsedStartDate && !parsedEndDate) {
        const startDate = parsedStartDate;
        const hoverDateObj = new Date(hoverDate);
        
        if (isSameDay(day, startDate)) {
          hoverEdgeClass = startDate <= hoverDateObj ? ' rounded-l-full' : ' rounded-r-full';
        }
        
        if (isSameDay(day, hoverDateObj)) {
          hoverEdgeClass = startDate <= hoverDateObj ? ' rounded-r-full' : ' rounded-l-full';
        }
      }
      
      return (
        <div 
          key={i} 
          onClick={(e) => !isBooked && handleDateClick(day, e)}
          onMouseEnter={(e) => handleMouseEnter(day, e)}
          onMouseLeave={(e) => handleMouseLeave(e)}
          className={`
            h-10 flex items-center justify-center text-sm relative
            ${!isCurrentMonth ? 'text-gray-300' : ''}
            ${isBooked && isCurrentMonth ? 'bg-red-100 text-red-700 cursor-not-allowed rounded-full' : ''}
            ${isSelected && !isStart && !isEnd ? 'bg-blue-100 text-blue-800' : ''}
            ${isStart ? 'bg-blue-500 text-white z-10' : ''}
            ${isEnd ? 'bg-blue-500 text-white z-10' : ''}
            ${isHovering && !isStart && !isBooked ? 'bg-blue-50 text-blue-800' : ''}
            ${isPast && isCurrentMonth ? 'text-gray-400' : ''}
            ${isToday && !isSelected && !isBooked ? 'border border-blue-500' : ''}
            ${!isBooked && isCurrentMonth ? 'hover:bg-blue-100 cursor-pointer' : ''}
            ${!isCurrentMonth ? 'cursor-pointer' : ''}
            ${roundedClass}
            ${hoverEdgeClass}
            transition-all duration-200
            group
          `}
          title={isBooked && isCurrentMonth ? "This date is already booked" : ""}
        >
          <div className={`
            flex items-center justify-center w-full h-full
            ${(isStart || isEnd) ? 'rounded-full bg-blue-500 text-white z-10' : ''}
          `}>
            {dayOfMonth}
          </div>
          
          {/* Tooltip displayed on hover for booked dates */}
          {isBooked && isCurrentMonth && (
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-500 text-white text-xs rounded pointer-events-none whitespace-nowrap z-20 transition-opacity duration-200">
              Already booked
            </div>
          )}
        </div>
      );
    });
  };
  
  return (
    <div 
      className="booking-calendar bg-white rounded-lg shadow p-4" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        {/* Previous month button */}
        <button 
          type="button"
          onClick={(e) => prevMonth(e)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <IoIosArrowUp size={20} />
        </button>
        <h2 className="text-lg font-semibold">
          {format(displayMonth, 'MMMM yyyy', { locale: enUS })}
        </h2>
        {/* Next month button */}
        <button 
          type="button"
          onClick={(e) => nextMonth(e)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <IoIosArrowDown size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdayShort.map((day, i) => (
          <div key={i} className="text-center text-sm font-medium text-gray-600 py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Optimized animation wrapper */}
      <div className="overflow-hidden relative" style={{ height: '270px' }}>
        {/* Main calendar display */}
        <div
          className={`grid grid-cols-7 gap-1 absolute w-full transition-all duration-300 ${
            isAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {renderDays(calendarDays, currentMonth)}
        </div>
        
        {/* Animation overlay that shows during transition */}
        <div
          className={`grid grid-cols-7 gap-1 absolute w-full transition-all duration-300 transform ${
            !isAnimating ? 'opacity-0' : 'opacity-100'
          } ${
            animationDirection === 'up' 
              ? isAnimating ? 'translate-y-0' : '-translate-y-full' 
              : isAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{
            top: animationDirection === 'up' ? '-100%' : '100%',
            animation: isAnimating ? 
              `${animationDirection === 'up' ? 'slideUp' : 'slideDown'} 300ms forwards` : 
              'none'
          }}
        >
          {isAnimating && (
            animationDirection === 'up'
              ? renderDays(prevMonthDays, subMonths(currentMonth, 1))
              : renderDays(nextMonthDays, addMonths(currentMonth, 1))
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}} />
      
      <div className="mt-4 text-xs flex gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 border border-red-400 rounded-full mr-2"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-full mr-2"></div>
          <span>Selected range</span>
        </div>
      </div>
    </div>
  );
};

// Use React.memo to avoid unnecessary re-rendering
export default React.memo(BookingCalendar, (prevProps, nextProps) => {
  // Compare startDate and endDate
  const startDateEqual = prevProps.selectedStartDate === nextProps.selectedStartDate;
  const endDateEqual = prevProps.selectedEndDate === nextProps.selectedEndDate;
  
  // Deep comparison for bookedDates array
  let bookedDatesEqual = false;
  
  // Check if both are null or undefined
  if (!prevProps.bookedDates && !nextProps.bookedDates) {
    bookedDatesEqual = true;
  } 
  // Check if one of them is null or undefined
  else if (!prevProps.bookedDates || !nextProps.bookedDates) {
    bookedDatesEqual = false;
  }
  // Check array length
  else if (prevProps.bookedDates.length !== nextProps.bookedDates.length) {
    bookedDatesEqual = false;
  } 
  // Compare each item
  else {
    bookedDatesEqual = prevProps.bookedDates.every((prevBooking, index) => {
      const nextBooking = nextProps.bookedDates[index];
      if (!prevBooking || !nextBooking) return false;
      
      // Compare startDate and endDate of each booking
      const prevStart = prevBooking.startDate ? new Date(prevBooking.startDate).getTime() : null;
      const nextStart = nextBooking.startDate ? new Date(nextBooking.startDate).getTime() : null;
      const prevEnd = prevBooking.endDate ? new Date(prevBooking.endDate).getTime() : null;
      const nextEnd = nextBooking.endDate ? new Date(nextBooking.endDate).getTime() : null;
      
      return prevStart === nextStart && prevEnd === nextEnd;
    });
  }
  
  // Skip re-render if props haven't changed
  return startDateEqual && endDateEqual && bookedDatesEqual;
});