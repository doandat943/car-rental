const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

    // Tạo request với headers đã cấu hình
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Kiểm tra lỗi
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Xử lý lỗi xác thực (401, 403)
      if (response.status === 401 || response.status === 403 || errorData.error === "Not authorized to access this route") {
        console.warn('Lỗi xác thực, cần đăng nhập lại');
        
        // Xóa token hiện tại nếu không hợp lệ
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          document.cookie = 'admin_token=; Max-Age=0; path=/; SameSite=Lax';
          
          // Chuyển hướng đến trang thông báo lỗi phiên hết hạn
          if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/unauthorized') {
            console.log('Chuyển hướng đến trang lỗi xác thực...');
            window.location.href = '/auth/unauthorized';
            return new Promise(() => {}); // Pending promise để ngừng thực thi
          }
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

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
      localStorage.removeItem('admin_user');
      
      // Xóa token khỏi cookie
      document.cookie = 'admin_token=; Max-Age=0; path=/; SameSite=Lax';
    }
  },

  // Lấy thông tin người dùng hiện tại
  getProfile: async () => {
    return fetchWithAuth('/auth/profile', {
      method: 'GET',
    });
  },

  // Lấy thông tin người dùng hiện tại (từ API hoặc localStorage)
  getCurrentUser: async () => {
    try {
      // Thử lấy từ API trước
      const { data } = await fetchWithAuth('/auth/profile', {
        method: 'GET',
      });
      
      // Lưu vào localStorage để sử dụng sau này
      if (data && data.user) {
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        return { user: data.user };
      }
      
      return { user: null };
    } catch (error) {
      console.warn('Không thể lấy thông tin người dùng từ API, đang sử dụng localStorage');
      
      // Nếu không lấy được từ API, thử lấy từ localStorage
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            return { user };
          } catch (e) {
            console.error('Lỗi parse JSON user từ localStorage:', e);
          }
        }
      }
      
      return { user: null };
    }
  },

  // Đổi mật khẩu
  changePassword: async (currentPassword, newPassword) => {
    return fetchWithAuth('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

/**
 * APIs quản lý dashboard và thống kê
 */
export const dashboardAPI = {
  // Lấy dữ liệu thống kê tổng quan
  getStatistics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Thêm các tham số
    if (params.timeFrame) queryParams.append('timeFrame', params.timeFrame);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/dashboard/statistics${queryString}`, {
      method: 'GET',
    });
  },

  // Lấy dữ liệu doanh thu theo thời gian
  getRevenueData: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.timeFrame) queryParams.append('timeFrame', params.timeFrame);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/dashboard/revenue${queryString}`, {
      method: 'GET',
    });
  },

  // Lấy dữ liệu đặt xe theo thời gian
  getBookingsData: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.timeFrame) queryParams.append('timeFrame', params.timeFrame);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/dashboard/bookings${queryString}`, {
      method: 'GET',
    });
  },
  
  // Lấy dữ liệu xe hàng đầu
  getTopCars: async (limit = 5) => {
    return fetchWithAuth(`/dashboard/top-cars?limit=${limit}`, {
      method: 'GET',
    });
  },
  
  // Lấy dữ liệu người dùng hàng đầu
  getTopUsers: async (limit = 5) => {
    return fetchWithAuth(`/dashboard/top-users?limit=${limit}`, {
      method: 'GET',
    });
  }
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

/**
 * APIs quản lý thông báo
 */
export const notificationsAPI = {
  // Lấy tất cả thông báo
  getAllNotifications: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.read !== undefined) queryParams.append('read', params.read);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchWithAuth(`/notifications${queryString}`, {
      method: 'GET',
    });
  },

  // Đánh dấu thông báo đã đọc
  markAsRead: async (id) => {
    return fetchWithAuth(`/notifications/${id}/mark-read`, {
      method: 'PUT',
    });
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async () => {
    return fetchWithAuth('/notifications/mark-all-read', {
      method: 'PUT',
    });
  },

  // Xóa thông báo
  deleteNotification: async (id) => {
    return fetchWithAuth(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }
};

/**
 * Axios API client (giữ lại từ src/lib/api.js để tham khảo trong tương lai)
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