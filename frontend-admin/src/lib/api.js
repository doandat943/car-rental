import axios from 'axios';

// API base URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configs
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/me', userData),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Users API
export const usersAPI = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Cars API
export const carsAPI = {
  getAllCars: (params) => api.get('/cars', { params }),
  getCarById: (id) => api.get(`/cars/${id}`),
  createCar: (carData) => api.post('/cars', carData),
  updateCar: (id, carData) => api.put(`/cars/${id}`, carData),
  deleteCar: (id) => api.delete(`/cars/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAllBookings: (params) => api.get('/bookings', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getBookingsStats: () => api.get('/dashboard/bookings'),
  getRevenueStats: () => api.get('/dashboard/revenue'),
};

// Website info API
export const websiteAPI = {
  getInfo: () => api.get('/website-info'),
  updateInfo: (data) => api.put('/website-info', data),
};

/**
 * File upload API endpoints
 */
export const uploadAPI = {
  /**
   * Upload an image file
   * @param {File} file - The file to upload
   * @param {string} type - The type of upload (cars, users, etc.)
   * @returns {Promise<Object>} - The server response
   */
  uploadImage: async (file, type = 'misc') => {
    const formData = new FormData();
    formData.append('image', file);
    
    return api.post(`/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  /**
   * Delete an uploaded image
   * @param {string} filename - The filename to delete
   * @param {string} type - The type of upload (cars, users, etc.)
   * @returns {Promise<Object>} - The server response
   */
  deleteImage: async (filename, type = 'misc') => {
    return api.delete(`/upload/${type}/${filename}`);
  }
};

export default api; 