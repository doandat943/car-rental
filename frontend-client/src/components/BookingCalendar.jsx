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
  
  // Calculate today and max allowed date (today + 30 days)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  
  const maxAllowedDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 30);
    return d;
  }, [today]);
  
  // Check if date is in valid range (today to today+30 days)
  const isDateInValidRange = useCallback((date) => {
    if (!date) return false;
    
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    return compareDate >= today && compareDate <= maxAllowedDate;
  }, [today, maxAllowedDate]);
  
  // Check if month is allowed for navigation (current month or next month)
  const isMonthAllowed = useCallback((month) => {
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    const nextMonthStart = new Date(currentMonthStart);
    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
    
    const monthToCheck = new Date(month);
    monthToCheck.setDate(1);
    monthToCheck.setHours(0, 0, 0, 0);
    
    return (
      monthToCheck.getMonth() === currentMonthStart.getMonth() && 
      monthToCheck.getFullYear() === currentMonthStart.getFullYear()
    ) || (
      monthToCheck.getMonth() === nextMonthStart.getMonth() && 
      monthToCheck.getFullYear() === nextMonthStart.getFullYear()
    );
  }, []);
  
  // Initialize with current month
  useEffect(() => {
    // Make sure current month is either this month or next month
    const now = new Date();
    now.setDate(1);
    
    if (!isMonthAllowed(currentMonth)) {
      setCurrentMonth(now);
      setDisplayMonth(now);
    }
  }, [isMonthAllowed]);
  
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
    
    // Check if previous month is allowed
    const prevMonthDate = subMonths(currentMonth, 1);
    if (!isMonthAllowed(prevMonthDate)) {
      // Cannot go back before current month
      return;
    }
    
    // Set animation direction and trigger animation
    setAnimationDirection('up');
    setIsAnimating(true);
    
    // Update display month immediately to show previous month
    setDisplayMonth(prevMonthDate);
    
    // Wait for animation to complete before changing current month
    setTimeout(() => {
      setCurrentMonth(prevMonthDate);
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
    
    // Check if next month is allowed
    const nextMonthDate = addMonths(currentMonth, 1);
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    
    // Only allow next month if current is current month
    const nextMonthStart = new Date(currentMonthStart);
    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
    
    // If already in the next month, don't allow further navigation
    if (
      currentMonth.getMonth() === nextMonthStart.getMonth() &&
      currentMonth.getFullYear() === nextMonthStart.getFullYear()
    ) {
      return;
    }
    
    // Set animation direction and trigger animation  
    setAnimationDirection('down');
    setIsAnimating(true);
    
    // Update display month immediately to show next month
    setDisplayMonth(nextMonthDate);
    
    // Wait for animation to complete before changing current month
    setTimeout(() => {
      setCurrentMonth(nextMonthDate);
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
    

    
    // Check if date is in valid range
    if (!isDateInValidRange(date)) {
      return; // Don't allow selecting dates outside valid range
    }
    
    // Strict check for booked dates
    if (isDateBooked(date)) {
      return; // Prevent selection
    }
    
    // Cho phép chọn tất cả các ngày không bị đặt
    if (onDateSelect) {
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
  }, [isDateBooked, onDateSelect, isDateInValidRange]);
  
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
  
  // Render days for a specific month - completely rewritten for clarity
  const renderDays = (daysArray, monthToDisplay) => {
    return daysArray.map((day, i) => {
      // Get all the important states for this day
      const isBooked = isDateBooked(day);
      const isValidDate = isDateInValidRange(day);
      const isCurrentMonth = isSameMonth(day, monthToDisplay);
      const isToday = isSameDay(day, new Date());
      const isStart = isStartDate(day);
      const isEnd = isEndDate(day);
      const isSelected = isInSelectedRange(day);
      const isHovering = isInHoverRange(day);
      
      // Format day of month number
      const dayOfMonth = format(day, 'd');
      
      // Whether this day can be clicked
      const isClickable = isValidDate && !isBooked;
      
      // Build the class list based on the state
      let classNames = [
        'h-10 flex items-center justify-center text-sm relative',
        'transition-all duration-200 group'
      ];
      
      // Basic styling based on month
      if (isCurrentMonth) {
        classNames.push('text-gray-800');
      } else {
        classNames.push('text-gray-500');
      }
      
      // Styling for selectable days
      if (isClickable) {
        classNames.push('cursor-pointer hover:bg-blue-100');
      }
      
      // Styling for invalid dates
      if (!isValidDate) {
        classNames.push('bg-gray-200 text-gray-500 cursor-not-allowed');
      }
      
      // Styling for booked dates
      if (isBooked) {
        classNames.push('bg-red-100 text-red-700 cursor-not-allowed rounded-full');
      }
      
      // Styling for selected range
      if (isSelected && !isStart && !isEnd) {
        classNames.push('bg-blue-100 text-blue-800');
      }
      
      // Styling for start and end dates
      if (isStart) {
        classNames.push('rounded-l-full');
      }
      if (isEnd) {
        classNames.push('rounded-r-full');
      }
      if (isStart || isEnd) {
        classNames.push('bg-blue-500 text-white z-10');
      }
      
      // Styling for hovering effect
      if (isHovering && !isStart && !isBooked && isValidDate) {
        classNames.push('bg-blue-50 text-blue-800');
      }
      
      // Styling for today
      if (isToday && !isSelected && !isBooked) {
        classNames.push('border border-blue-500');
      }
      
      // Styling for the day number element
      let dayNumberClassNames = [
        'flex items-center justify-center w-full h-full'
      ];
      
      if ((isStart || isEnd)) {
        dayNumberClassNames.push('rounded-full bg-blue-500 text-white z-10');
      }
      
      if (!isValidDate) {
        dayNumberClassNames.push('opacity-50');
      }

      
      return (
        <div 
          key={i}
          onClick={(e) => isClickable && handleDateClick(day, e)}
          onMouseEnter={(e) => isClickable && handleMouseEnter(day, e)}
          onMouseLeave={(e) => handleMouseLeave(e)}
          className={classNames.join(' ')}
          data-date={format(day, 'yyyy-MM-dd')}
          data-selectable={isClickable ? 'true' : 'false'}
        >
          <div className={dayNumberClassNames.join(' ')}>
            {dayOfMonth}
          </div>
          
          {/* Tooltip for invalid dates - shows if date is not in the valid booking range */}
          {!isValidDate ? (
            <div className="absolute z-20 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-black rounded opacity-0 pointer-events-none group-hover:opacity-100 bottom-full left-1/2 whitespace-nowrap">
              Outside booking range
            </div>
          ) : isBooked ? (
            // Tooltip for booked dates - shows if date is valid AND booked
            <div className="absolute z-20 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-red-500 rounded opacity-0 pointer-events-none group-hover:opacity-100 bottom-full left-1/2 whitespace-nowrap">
              Already booked
            </div>
          ) : null}
        </div>
      );
    });
  };
  
  return (
    <div 
      className="p-4 bg-white rounded-lg shadow booking-calendar" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        {/* Previous month button */}
        <button 
          type="button"
          onClick={(e) => prevMonth(e)}
          className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
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
          className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
        >
          <IoIosArrowDown size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdayShort.map((day, i) => (
          <div key={i} className="py-1 text-sm font-medium text-center text-gray-600">
            {day}
          </div>
        ))}
      </div>
      
      {/* Optimized animation wrapper */}
      <div className="relative overflow-hidden" style={{ height: '270px' }}>
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
      
      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-red-100 border border-red-400 rounded-full"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-blue-500 rounded-full"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-blue-100 border border-blue-300 rounded-full"></div>
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