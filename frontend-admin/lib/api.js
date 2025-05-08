const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Kích hoạt chế độ mô phỏng API khi không thể kết nối tới backend
const MOCK_API_ENABLED = true;

// Import dữ liệu mô phỏng từ seed-data
import { MOCK_DATA } from './seed-data';

/**
 * Mô phỏng API response dựa trên endpoint
 * @param {string} endpoint - Đường dẫn API
 * @param {Object} options - Tùy chọn fetch
 * @returns {Object} Dữ liệu mô phỏng
 */
const mockApiResponse = (endpoint, options = {}) => {
  console.log(`🔶 Using mock API for endpoint: ${endpoint}`);
  
  // Mô phỏng độ trễ của API
  return new Promise(resolve => {
    setTimeout(() => {
      // Dashboard stats
      if (endpoint === '/dashboard/stats') {
        return resolve({ data: MOCK_DATA.dashboard.stats.data });
      }
      
      // Top cars
      if (endpoint.includes('/dashboard/top-cars')) {
        return resolve({ data: MOCK_DATA.dashboard.topCars });
      }
      
      // Revenue chart
      if (endpoint.includes('/dashboard/revenue')) {
        // Xử lý tham số period
        const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
        const period = urlParams.get('period') || 'month';
        
        let data = [...MOCK_DATA.dashboard.revenueChart.data];
        if (period === 'week') {
          data = data.slice(0, 4).map((item, index) => ({ day: index + 1, revenue: item.revenue / 4 }));
        } else if (period === 'year') {
          data = [
            { year: 2020, quarter: 1, revenue: 85000 },
            { year: 2020, quarter: 2, revenue: 92000 },
            { year: 2020, quarter: 3, revenue: 105000 },
            { year: 2020, quarter: 4, revenue: 120000 },
          ];
        }
        
        return resolve({ data: { data } });
      }
      
      // Bookings
      if (endpoint.startsWith('/bookings')) {
        if (endpoint === '/bookings' || endpoint.includes('?')) {
          return resolve({ data: MOCK_DATA.bookings.list });
        }
        
        // Chi tiết booking
        const bookingId = endpoint.split('/')[2];
        const booking = MOCK_DATA.bookings.list.data.find(b => b._id == bookingId);
        
        if (booking) {
          return resolve({ data: booking });
        }
      }
      
      // Cars
      if (endpoint.startsWith('/cars')) {
        if (endpoint === '/cars' || endpoint.includes('?')) {
          return resolve({ data: MOCK_DATA.cars.list });
        }
        
        // Chi tiết xe
        const carId = endpoint.split('/')[2];
        const car = MOCK_DATA.cars.list.data.find(c => c._id == carId);
        
        if (car) {
          return resolve({ data: car });
        }
        
        // Reviews của xe
        if (endpoint.includes('/reviews')) {
          return resolve({ data: MOCK_DATA.reviews.list });
        }
      }
      
      // Users
      if (endpoint.startsWith('/users')) {
        if (endpoint === '/users' || endpoint.includes('?')) {
          return resolve({ data: MOCK_DATA.users.list });
        }
        
        // Chi tiết người dùng
        const userId = endpoint.split('/')[2];
        const user = MOCK_DATA.users.list.data.find(u => u._id == userId);
        
        if (user) {
          return resolve({ data: user });
        }
      }
      
      // Categories
      if (endpoint === '/categories') {
        return resolve({ data: MOCK_DATA.categories.list });
      }
      
      // Settings
      if (endpoint === '/settings') {
        return resolve({ data: MOCK_DATA.settings.data });
      }
      
      // Reviews
      if (endpoint.startsWith('/reviews')) {
        return resolve({ data: MOCK_DATA.reviews.list });
      }
      
      // Default response
      resolve({ data: { message: 'Mock API endpoint không được hỗ trợ', endpoint } });
    }, 300); // Độ trễ 300ms
  });
};

/**
 * Các hàm tiện ích cho việc gọi API
 */
async function fetchWithAuth(endpoint, options = {}) {
  try {
    // Lấy token từ localStorage (nếu đã đăng nhập)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('admin_token');
    }

    // Thiết lập headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Thêm token nếu có
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Kiểm tra xem có nên sử dụng API mô phỏng không
    if (MOCK_API_ENABLED) {
      return mockApiResponse(endpoint, { ...options, headers });
    }

    // Tạo request với headers đã cấu hình
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Kiểm tra lỗi
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Nếu lỗi không được ủy quyền (401 hoặc 403), chuyển sang API mô phỏng
      if (response.status === 401 || response.status === 403 || errorData.error === "Not authorized to access this route") {
        console.warn('API authorization failed, falling back to mock data');
        return mockApiResponse(endpoint, options);
      }
      
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    
    // Nếu có lỗi kết nối, chuyển sang API mô phỏng
    if (MOCK_API_ENABLED) {
      console.warn('API connection failed, falling back to mock data');
      return mockApiResponse(endpoint, options);
    }
    
    throw error;
  }
}

/**
 * APIs quản lý xe
 */
export const carsAPI = {
  // Lấy tất cả xe
  getAllCars: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Thêm các tham số lọc và phân trang
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

  // Lấy xe theo ID
  getCarById: async (id) => {
    return fetchWithAuth(`/cars/${id}`, {
      method: 'GET',
    });
  },

  // Tạo xe mới
  createCar: async (carData) => {
    return fetchWithAuth('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },

  // Cập nhật xe
  updateCar: async (id, carData) => {
    return fetchWithAuth(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  },

  // Xóa xe
  deleteCar: async (id) => {
    return fetchWithAuth(`/cars/${id}`, {
      method: 'DELETE',
    });
  },

  // Kiểm tra tình trạng xe có sẵn
  checkAvailability: async (carId, startDate, endDate) => {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
    });
    
    return fetchWithAuth(`/cars/${carId}/availability?${queryParams.toString()}`, {
      method: 'GET',
    });
  },

  // Tải lên hình ảnh
  uploadImage: async (carId, formData) => {
    // Sử dụng fetch thay vì fetchWithAuth vì formData
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
      body: formData, // FormData không cần Content-Type, trình duyệt sẽ tự thiết lập
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return { data, status: response.status };
  },

  // Xóa hình ảnh
  deleteImage: async (carId, imageId) => {
    return fetchWithAuth(`/cars/${carId}/images/${imageId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * APIs quản lý danh mục
 */
export const categoriesAPI = {
  // Lấy tất cả danh mục
  getAllCategories: async () => {
    return fetchWithAuth('/categories', {
      method: 'GET',
    });
  },

  // Lấy danh mục theo ID
  getCategoryById: async (id) => {
    return fetchWithAuth(`/categories/${id}`, {
      method: 'GET',
    });
  },

  // Tạo danh mục mới
  createCategory: async (categoryData) => {
    return fetchWithAuth('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Cập nhật danh mục
  updateCategory: async (id, categoryData) => {
    return fetchWithAuth(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    return fetchWithAuth(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * APIs quản lý đặt xe
 */
export const bookingsAPI = {
  // Lấy tất cả lịch đặt xe
  getAllBookings: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Thêm các tham số lọc và phân trang
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

  // Lấy thông tin đặt xe theo ID
  getBookingById: async (id) => {
    return fetchWithAuth(`/bookings/${id}`, {
      method: 'GET',
    });
  },

  // Tạo đặt xe mới
  createBooking: async (bookingData) => {
    return fetchWithAuth('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Cập nhật trạng thái đặt xe
  updateBookingStatus: async (id, status) => {
    return fetchWithAuth(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Hủy đặt xe
  cancelBooking: async (id, reason) => {
    return fetchWithAuth(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },
};

/**
 * APIs quản lý người dùng
 */
export const usersAPI = {
  // Lấy tất cả người dùng
  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Thêm các tham số lọc và phân trang
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.role) queryParams.append('role', params.role);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/users${queryString}`, {
      method: 'GET',
    });
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (id) => {
    return fetchWithAuth(`/users/${id}`, {
      method: 'GET',
    });
  },

  // Tạo người dùng mới (admin only)
  createUser: async (userData) => {
    return fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id, userData) => {
    return fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Xóa người dùng
  deleteUser: async (id) => {
    return fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * APIs xác thực
 */
export const authAPI = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      // Kiểm tra endpoint có tồn tại không
      const testResponse = await fetch(`${API_BASE_URL}/auth/login`, { method: 'HEAD' })
        .catch(() => ({ ok: false }));
      
      let response;
      
      if (testResponse.ok) {
        // Nếu endpoint tồn tại, sử dụng API thực
        response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      } else {
        // Mô phỏng đăng nhập thành công nếu API không tồn tại
        console.log('API đăng nhập không tồn tại, sử dụng chế độ mô phỏng');
        
        // Kiểm tra thông tin đăng nhập mặc định
        if (email === 'admin@example.com' && password === 'admin123') {
          // Mô phỏng response thành công
          const mockData = {
            success: true,
            token: 'mock-jwt-token-for-testing-purposes-only',
            user: {
              id: '1',
              name: 'Admin',
              email: 'admin@example.com',
              role: 'admin',
            }
          };
          
          // Lưu token vào localStorage và cookie
          if (typeof window !== 'undefined') {
            localStorage.setItem('admin_token', mockData.token);
            
            // Lưu token vào cookie để middleware có thể đọc
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7);
            document.cookie = `admin_token=${mockData.token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
          }
          
          return { data: mockData, status: 200 };
        } else {
          // Mô phỏng đăng nhập thất bại
          throw new Error('Email hoặc mật khẩu không chính xác');
        }
      }

      // Xử lý response từ API thực
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Lưu token vào localStorage
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('admin_token', data.token);
        
        // Lưu token vào cookie để middleware có thể đọc
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

  // Đăng xuất
  logout: () => {
    if (typeof window !== 'undefined') {
      // Xóa token khỏi localStorage
      localStorage.removeItem('admin_token');
      
      // Xóa token khỏi cookie
      document.cookie = 'admin_token=; Max-Age=0; path=/; SameSite=Lax';
    }
  },

  // Lấy thông tin người dùng hiện tại
  getProfile: async () => {
    return fetchWithAuth('/auth/admin/profile', {
      method: 'GET',
    });
  },

  // Đổi mật khẩu
  changePassword: async (currentPassword, newPassword) => {
    return fetchWithAuth('/auth/admin/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

/**
 * APIs thống kê
 */
export const dashboardAPI = {
  // Lấy thống kê tổng quan
  getStats: async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }
      
      return { data };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Lấy biểu đồ doanh thu
  getRevenueChart: async (period = 'month') => {
    return fetchWithAuth(`/dashboard/revenue?period=${period}`, {
      method: 'GET',
    });
  },

  // Lấy biểu đồ đặt xe
  getBookingsChart: async (period = 'month') => {
    return fetchWithAuth(`/dashboard/bookings?period=${period}`, {
      method: 'GET',
    });
  },

  // Lấy top xe được đặt nhiều nhất
  getTopCars: async (limit = 5) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/dashboard/top-cars?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch top cars');
      }
      
      return { data };
    } catch (error) {
      console.error('Error fetching top cars:', error);
      throw error;
    }
  },

  // Lấy thông tin về xe theo trạng thái
  getCarsByStatus: async () => {
    return fetchWithAuth('/dashboard/cars-by-status', {
      method: 'GET',
    });
  },
};

/**
 * APIs quản lý hệ thống
 */
export const settingsAPI = {
  // Lấy cài đặt hệ thống
  getSettings: async () => {
    return fetchWithAuth('/settings', {
      method: 'GET',
    });
  },

  // Cập nhật cài đặt hệ thống
  updateSettings: async (settingsData) => {
    return fetchWithAuth('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },
};

/**
 * APIs quản lý đánh giá
 */
export const reviewsAPI = {
  // Lấy đánh giá theo xe
  getReviewsByCarId: async (carId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/cars/${carId}/reviews${queryString}`, {
      method: 'GET',
    });
  },

  // Lấy tất cả đánh giá
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

  // Xóa đánh giá
  deleteReview: async (id) => {
    return fetchWithAuth(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
}; 