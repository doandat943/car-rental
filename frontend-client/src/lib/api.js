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
    // Get token from localStorage - only in browser environment
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
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Cars API
export const carsAPI = {
  getAllCars: async (params) => {
    try {
      console.log('Fetching cars with params:', params);
      const response = await api.get('/cars', { params });
      console.log('Raw cars API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  },
  getCarById: async (id) => {
    try {
      console.log('Fetching car with ID:', id);
      const response = await api.get(`/cars/${id}`);
      console.log('Raw car details API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching car details:', error);
      throw error;
    }
  },
  checkAvailability: async (carId, dates) => {
    try {
      console.log('Checking availability for car ID:', carId, 'with dates:', dates);
      const response = await api.post(`/cars/${carId}/check-availability`, dates);
      console.log('Raw availability API response:', response);
      return response;
    } catch (error) {
      console.error('Error checking car availability:', error);
      throw error;
    }
  },
};

// Categories API
export const categoriesAPI = {
  getAllCategories: async () => {
    try {
      console.log('Fetching all categories');
      const response = await api.get('/categories');
      console.log('Raw categories API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  getCategoryById: async (id) => {
    try {
      console.log('Fetching category with ID:', id);
      const response = await api.get(`/categories/${id}`);
      console.log('Raw category details API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching category details:', error);
      throw error;
    }
  },
};

// Bookings API
export const bookingsAPI = {
  getUserBookings: () => api.get('/bookings/user'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
};

// Website info API
export const websiteAPI = {
  getInfo: () => api.get('/website/info'),
  getContact: () => api.get('/website/contact'),
  sendContactForm: (data) => api.post('/website/contact', data),
};

export default api; 