import axios from 'axios';

// API base URL from environment variables
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

// Export API_BASE_URL for use in other files
export { API_BASE_URL };

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
  
  checkStatus: async (carId, dates) => {
    try {
      console.log('Checking car status for ID:', carId, 'with dates:', dates);
      const response = await api.post(`/cars/${carId}/check-status`, dates);
      console.log('Raw status check API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error checking car status:', error);
      return { success: false, message: error.message };
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

// Brands API - Added for car filters
export const brandsAPI = {
  getAllBrands: async () => {
    try {
      console.log('Fetching all brands');
      const response = await api.get('/brands');
      console.log('Raw brands API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },
  getBrandById: async (id) => {
    try {
      console.log('Fetching brand with ID:', id);
      const response = await api.get(`/brands/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching brand details:', error);
      throw error;
    }
  },
};

// Fuels API - Added for car filters
export const fuelsAPI = {
  getAllFuels: async () => {
    try {
      console.log('Fetching all fuel types');
      const response = await api.get('/fuels');
      return response;
    } catch (error) {
      console.error('Error fetching fuel types:', error);
      throw error;
    }
  },
  getFuelById: async (id) => {
    try {
      const response = await api.get(`/fuels/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching fuel type details:', error);
      throw error;
    }
  },
};

// Transmissions API - Added for car filters
export const transmissionsAPI = {
  getAllTransmissions: async () => {
    try {
      console.log('Fetching all transmission types');
      const response = await api.get('/transmissions');
      return response;
    } catch (error) {
      console.error('Error fetching transmission types:', error);
      throw error;
    }
  },
  getTransmissionById: async (id) => {
    try {
      const response = await api.get(`/transmissions/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching transmission type details:', error);
      throw error;
    }
  },
};

// Bookings API
export const bookingsAPI = {
  getUserBookings: () => api.get('/bookings/user'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  createBooking: async (bookingData) => {
    try {
      console.log('Creating booking with data:', bookingData);
      // Check auth token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log('Auth token present:', !!token);
      
      if (!token) {
        console.error('No authentication token found. User must be logged in to book.');
        throw new Error('Authentication required. Please log in to continue.');
      }
      
      const response = await api.post('/bookings', bookingData);
      console.log('Booking created successfully:', response);
      return response;
    } catch (error) {
      // Log complete error details
      console.error('Error creating booking:', error);
      
      // Log specific response data if available 
      if (error.response) {
        console.error('Server response data:', error.response.data);
        console.error('Server response status:', error.response.status);
        console.error('Server response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
      }
      
      // Throw a more informative error
      const errorMessage = error.response?.data?.message || error.message || 'Unknown booking error';
      throw {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
};

// Locations API
export const locationsAPI = {
  getPickupLocations: async () => {
    try {
      console.log('Fetching pickup locations');
      const response = await api.get('/locations/pickup-locations');
      console.log('Raw pickup locations API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching pickup locations:', error);
      throw error;
    }
  },

  getLocationById: async (id) => {
    try {
      console.log('Fetching location with ID:', id);
      const response = await api.get(`/locations/${id}`);
      console.log('Raw location details API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching location details:', error);
      throw error;
    }
  },
};

// Website info API
export const websiteAPI = {
  getInfo: () => api.get('/website-info'),
  getContact: () => api.get('/website-info'),
  sendContactForm: (data) => api.post('/website/contact', data),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message, sessionData = null) => api.post('/chatbot/message', { message, sessionData }),
  sendAIMessage: (message, sessionData = null) => api.post('/chatbot/ai-message', { message, sessionData }),
  getFAQs: () => api.get('/chatbot/faqs'),
  getCarSuggestions: (criteria) => api.post('/chatbot/car-suggestions', criteria),
};

export default api; 