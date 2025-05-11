const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Utility functions for API calls
 */
async function fetchWithAuth(endpoint, options = {}) {
  try {
    // Get token from localStorage (if logged in)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('admin_token');
    }

    // Setup headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Handle query parameters if provided
    let url = `${API_BASE_URL}${endpoint}`;
    if (options.params) {
      const queryParams = new URLSearchParams();
      for (const key in options.params) {
        queryParams.append(key, options.params[key]);
      }
      url += (url.includes('?') ? '&' : '?') + queryParams.toString();
    }

    // Create request with configured headers
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Check for errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Check if it's an authentication error (401), "Not authorized" error or "User not found" error (404)
      if (response.status === 401 || response.status === 404 || 
          (errorData.error && (errorData.error.includes('Not authorized') || errorData.error.includes('User not found')))) {
        // Remove current token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          
          // Redirect to unauthorized page
          window.location.href = '/auth/unauthorized';
        }
      }
      
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
}

/**
 * Car management APIs
 */
export const carsAPI = {
  // Get all cars
  getAllCars: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filtering and pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/cars${queryString}`, {
      method: 'GET',
    });
  },

  // Get car by ID
  getCarById: async (id) => {
    return fetchWithAuth(`/cars/${id}`, {
      method: 'GET',
    });
  },

  // Create new car
  createCar: async (carData) => {
    return fetchWithAuth('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },

  // Update car
  updateCar: async (id, carData) => {
    return fetchWithAuth(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  },

  // Delete car
  deleteCar: async (id) => {
    return fetchWithAuth(`/cars/${id}`, {
      method: 'DELETE',
    });
  },

  // Check car availability
  checkAvailability: async (carId, startDate, endDate) => {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
    });
    
    return fetchWithAuth(`/cars/${carId}/availability?${queryParams.toString()}`, {
      method: 'GET',
    });
  },

  // Upload image
  uploadImage: async (carId, formData) => {
    // Use fetch instead of fetchWithAuth for formData
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('admin_token');
    }

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/cars/${carId}/images`, {
      method: 'POST',
      headers,
      body: formData, // FormData doesn't need Content-Type, browser will set it automatically
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return { data, status: response.status };
  },

  // Delete image
  deleteImage: async (carId, imageId) => {
    return fetchWithAuth(`/cars/${carId}/images/${imageId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Category management APIs
 */
export const categoriesAPI = {
  // Get all categories
  getAllCategories: async () => {
    return fetchWithAuth('/categories', {
      method: 'GET',
    });
  },

  // Get category by ID
  getCategoryById: async (id) => {
    return fetchWithAuth(`/categories/${id}`, {
      method: 'GET',
    });
  },

  // Create new category
  createCategory: async (categoryData) => {
    return fetchWithAuth('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    return fetchWithAuth(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Delete category
  deleteCategory: async (id) => {
    return fetchWithAuth(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Booking management APIs
 */
export const bookingsAPI = {
  // Get all bookings
  getAllBookings: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filtering and pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.carId) queryParams.append('carId', params.carId);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/bookings${queryString}`, {
      method: 'GET',
    });
  },

  // Get booking by ID
  getBookingById: async (id) => {
    return fetchWithAuth(`/bookings/${id}`, {
      method: 'GET',
    });
  },

  // Create new booking
  createBooking: async (bookingData) => {
    return fetchWithAuth('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    return fetchWithAuth(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    return fetchWithAuth(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },
};

/**
 * User management APIs
 */
export const usersAPI = {
  // Get all users
  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filtering and pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.role) queryParams.append('role', params.role);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/users${queryString}`, {
      method: 'GET',
    });
  },

  // Get user by ID
  getUserById: async (id) => {
    return fetchWithAuth(`/users/${id}`, {
      method: 'GET',
    });
  },

  // Create new user (admin only)
  createUser: async (userData) => {
    return fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user information
  updateUser: async (id, userData) => {
    return fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (id) => {
    return fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Authentication APIs
 */
export const authAPI = {
  // Login
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Process response from API
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Save token to localStorage
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('admin_token', data.token);
        
        // Save token to cookie for middleware access
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `admin_token=${data.token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      }
      
      return { data, status: response.status };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    if (typeof window !== 'undefined') {
      // Remove token from localStorage
      localStorage.removeItem('admin_token');
      
      // Remove token from cookie
      document.cookie = 'admin_token=; Max-Age=0; path=/; SameSite=Lax';
    }
  },

  // Get current user profile
  getProfile: async () => {
    return fetchWithAuth('/auth/admin/profile', {
      method: 'GET',
    });
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return fetchWithAuth('/auth/admin/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

/**
 * Dashboard statistics APIs
 */
export const dashboardAPI = {
  // Get overview statistics
  getStats: async () => {
    return fetchWithAuth('/dashboard/stats', {
      method: 'GET',
    });
  },

  // Get statistics for statistics page
  getStatistics: async (timeFrame = 'month') => {
    // Use the existing stats endpoint since the statistics endpoint doesn't exist
    return fetchWithAuth('/dashboard/statistics', {
      method: 'GET',
      // Pass the timeFrame as a query parameter
      params: { timeFrame }
    });
  },

  // Get recent bookings
  getRecentBookings: async (limit = 5) => {
    // Use the existing getAllBookings function from bookingsAPI
    return fetchWithAuth(`/bookings?limit=${limit}&sort=-createdAt`, {
      method: 'GET',
    });
  },

  // Get revenue chart data
  getRevenueChart: async (period = 'month') => {
    return fetchWithAuth(`/dashboard/revenue?period=${period}`, {
      method: 'GET',
    });
  },

  // Get bookings chart data
  getBookingsChart: async (period = 'month') => {
    return fetchWithAuth(`/dashboard/bookings?period=${period}`, {
      method: 'GET',
    });
  },

  // Get top cars
  getTopCars: async (limit = 5) => {
    return fetchWithAuth(`/dashboard/top-cars?limit=${limit}`, {
      method: 'GET',
    });
  },

  // Get cars by status
  getCarsByStatus: async () => {
    return fetchWithAuth('/dashboard/cars-by-status', {
      method: 'GET',
    });
  },
};

/**
 * Notification management APIs
 */
export const notificationsAPI = {
  // Get all notifications
  getAllNotifications: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.read !== undefined) queryParams.append('read', params.read);
    if (params.type) queryParams.append('type', params.type);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/notifications${queryString}`, {
      method: 'GET',
    });
  },

  // Get unread count
  getUnreadCount: async () => {
    return fetchWithAuth('/notifications/unread-count', {
      method: 'GET',
    });
  },

  // Mark notification as read
  markAsRead: async (id) => {
    return fetchWithAuth(`/notifications/${id}/mark-read`, {
      method: 'PATCH',
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return fetchWithAuth('/notifications/mark-all-read', {
      method: 'PATCH',
    });
  },

  // Delete notification
  deleteNotification: async (id) => {
    return fetchWithAuth(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * System settings APIs
 */
export const settingsAPI = {
  // Get system settings
  getSettings: async () => {
    return fetchWithAuth('/settings', {
      method: 'GET',
    });
  },

  // Update system settings
  updateSettings: async (settingsData) => {
    return fetchWithAuth('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },
};

/**
 * Review management APIs
 */
export const reviewsAPI = {
  // Get reviews by car ID
  getReviewsByCarId: async (carId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/cars/${carId}/reviews${queryString}`, {
      method: 'GET',
    });
  },

  // Get all reviews
  getAllReviews: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.rating) queryParams.append('rating', params.rating);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/reviews${queryString}`, {
      method: 'GET',
    });
  },

  // Delete review
  deleteReview: async (id) => {
    return fetchWithAuth(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Axios API client (kept from src/lib/api.js for future reference)
 * 
 * Example usage:
 * import axios from 'axios';
 * 
 * // API base URL from environment variables
 * const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
 * 
 * // Create axios instance with default configs
 * const api = axios.create({
 *   baseURL: API_URL,
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 * });
 */ 