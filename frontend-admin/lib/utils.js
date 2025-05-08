import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string, merging Tailwind classes efficiently
 * @param {...string} inputs - The class names to combine
 * @returns {string} - The combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} - The formatted date string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  
  const dateToFormat = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateToFormat);
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 * @param {string} str - The string to truncate 
 * @param {number} length - Maximum length before truncation
 * @returns {string} - The truncated string
 */
export function truncateText(str, length = 50) {
  if (!str || str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

/**
 * Formats a currency value
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - The formatted currency string
 */
export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Generates a random ID for use in temporary elements
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - The generated ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Debounces a function call
 * @param {Function} fn - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Converts kebab-case or snake_case to camelCase
 * @param {string} str - The string to convert
 * @returns {string} - The camelCase string
 */
export function toCamelCase(str) {
  return str.replace(/[-_]([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Filter and sort data for tables
 * @param {Array} data - The data to filter and sort
 * @param {Object} options - Filter and sort options
 * @returns {Array} - The filtered and sorted data
 */
export function filterAndSortData(data, { filters = {}, sortBy, sortDirection = 'asc' }) {
  if (!data || !data.length) return [];
  
  // Apply filters
  let filteredData = [...data];
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filteredData = filteredData.filter(item => {
        const itemValue = item[key];
        if (typeof value === 'string') {
          return String(itemValue).toLowerCase().includes(value.toLowerCase());
        }
        return itemValue === value;
      });
    }
  });
  
  // Apply sorting
  if (sortBy) {
    filteredData.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  return filteredData;
} 