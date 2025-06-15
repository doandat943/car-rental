// Date utility functions

export const formatDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return '';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

export const normalizeDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return null;
  }
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
};

// Check if date is within 30-day booking window
export const isDateInBookingWindow = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return false;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxAllowedDate = new Date(today);
  maxAllowedDate.setDate(today.getDate() + 30);
  
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  return compareDate >= today && compareDate <= maxAllowedDate;
};

export const hasBookedDatesBetween = (startDate, endDate, isDateBookedFn) => {
  if (!startDate || !endDate || !isDateBookedFn) return false;
  
  let start = new Date(startDate);
  let end = new Date(endDate);
  
  // Ensure start is before end
  if (start > end) {
    [start, end] = [end, start];
  }
  
  // Check each day in the range
  let currentDate = new Date(start);
  while (currentDate <= end) {
    if (isDateBookedFn(currentDate)) {
      return true;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return false;
};

export const findMaxValidEndDate = (startDate, isDateBookedFn, isDateInValidRangeFn) => {
  if (!startDate || !isDateBookedFn) return null;
  
  let currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1); // Start from next day
  
  // Find the first booked date after start date
  for (let i = 0; i < 365; i++) { // Limit search to 1 year
    if ((isDateInValidRangeFn && !isDateInValidRangeFn(currentDate)) || isDateBookedFn(currentDate)) {
      // Return the day before the first booked/invalid date
      currentDate.setDate(currentDate.getDate() - 1);
      return currentDate >= startDate ? currentDate : null;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return currentDate;
}; 