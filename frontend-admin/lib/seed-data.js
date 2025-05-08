/**
 * Dữ liệu mô phỏng (mock data) cho hệ thống Car Rental
 * Sử dụng cho các tình huống khi API chưa sẵn sàng hoặc đang phát triển
 */

// Dữ liệu mô phỏng cho dashboard
export const DASHBOARD_DATA = {
  stats: {
    data: {
      totalUsers: 2856,
      totalCars: 48,
      totalBookings: 142,
      totalRevenue: 35800,
      userGrowth: 12.5,
      carGrowth: -3.2,
      bookingGrowth: 8.7,
      revenueGrowth: 14.2,
      userTrend: [12, 15, 18, 14, 22, 25, 28, 26, 30],
      carTrend: [24, 25, 20, 18, 15, 16, 15, 14, 13],
      bookingTrend: [45, 50, 55, 60, 58, 65, 70, 68, 78],
      revenueTrend: [15000, 16000, 18000, 17000, 19000, 22000, 25000, 28000, 30000],
    }
  },
  topCars: {
    data: [
      { _id: 1, name: 'Tesla Model 3', bookingsCount: 28, totalRevenue: 3360, averageRating: 4.8 },
      { _id: 2, name: 'BMW X5', bookingsCount: 22, totalRevenue: 7700, averageRating: 4.6 },
      { _id: 3, name: 'Toyota Camry', bookingsCount: 19, totalRevenue: 1615, averageRating: 4.3 },
      { _id: 4, name: 'Mercedes C-Class', bookingsCount: 17, totalRevenue: 3400, averageRating: 4.7 },
      { _id: 5, name: 'Honda Civic', bookingsCount: 15, totalRevenue: 1275, averageRating: 4.5 },
    ]
  },
  revenueChart: {
    data: [
      { month: 1, revenue: 18500 },
      { month: 2, revenue: 22400 },
      { month: 3, revenue: 25300 },
      { month: 4, revenue: 23100 },
      { month: 5, revenue: 28900 },
      { month: 6, revenue: 32500 },
      { month: 7, revenue: 35800 },
      { month: 8, revenue: 38200 },
      { month: 9, revenue: 40100 },
      { month: 10, revenue: 42300 },
      { month: 11, revenue: 45000 },
      { month: 12, revenue: 49500 },
    ]
  }
};

// Dữ liệu mô phỏng cho đặt xe
export const BOOKING_DATA = {
  list: {
    data: [
      { _id: 1, user: { name: 'John Smith' }, car: { name: 'Tesla Model 3' }, status: 'confirmed', startDate: '2023-05-01', endDate: '2023-05-03', totalAmount: 120, createdAt: '2023-04-28' },
      { _id: 2, user: { name: 'Jane Cooper' }, car: { name: 'BMW X5' }, status: 'completed', startDate: '2023-04-28', endDate: '2023-04-30', totalAmount: 350, createdAt: '2023-04-26' },
      { _id: 3, user: { name: 'Robert Johnson' }, car: { name: 'Mercedes C-Class' }, status: 'cancelled', startDate: '2023-04-25', endDate: '2023-04-26', totalAmount: 200, createdAt: '2023-04-23' },
      { _id: 4, user: { name: 'Emily Davis' }, car: { name: 'Toyota Camry' }, status: 'pending', startDate: '2023-05-03', endDate: '2023-05-05', totalAmount: 85, createdAt: '2023-05-01' },
      { _id: 5, user: { name: 'Michael Wilson' }, car: { name: 'Audi A4' }, status: 'confirmed', startDate: '2023-05-02', endDate: '2023-05-04', totalAmount: 165, createdAt: '2023-04-30' },
    ],
    meta: {
      totalItems: 5,
      totalPages: 1,
      currentPage: 1
    }
  }
};

// Dữ liệu mô phỏng cho xe
export const CAR_DATA = {
  list: {
    data: [
      { _id: 1, name: 'Tesla Model 3', category: { name: 'Electric' }, price: 120, status: 'available', images: ['https://images.unsplash.com/photo-1561580125-028ee3bd62eb'], year: 2021, fuelType: 'Electric', transmission: 'Automatic', seats: 5, mileage: 15000, features: ['Autopilot', 'Heated Seats', 'Premium Sound'] },
      { _id: 2, name: 'BMW X5', category: { name: 'SUV' }, price: 175, status: 'available', images: ['https://images.unsplash.com/photo-1556189250-72ba954cfc2b'], year: 2020, fuelType: 'Petrol', transmission: 'Automatic', seats: 7, mileage: 25000, features: ['Leather Seats', 'Panoramic Roof', 'Navigation'] },
      { _id: 3, name: 'Toyota Camry', category: { name: 'Sedan' }, price: 85, status: 'maintenance', images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb'], year: 2019, fuelType: 'Hybrid', transmission: 'Automatic', seats: 5, mileage: 35000, features: ['Bluetooth', 'Backup Camera', 'Cruise Control'] },
      { _id: 4, name: 'Mercedes C-Class', category: { name: 'Luxury' }, price: 150, status: 'available', images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'], year: 2022, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, mileage: 10000, features: ['Leather Seats', 'Heated Seats', 'Premium Sound'] },
      { _id: 5, name: 'Honda Civic', category: { name: 'Compact' }, price: 75, status: 'available', images: ['https://images.unsplash.com/photo-1590347607479-9d7c3a26e5e9'], year: 2020, fuelType: 'Petrol', transmission: 'Manual', seats: 5, mileage: 30000, features: ['Bluetooth', 'Backup Camera', 'Touchscreen'] },
    ],
    meta: {
      totalItems: 5,
      totalPages: 1,
      currentPage: 1
    }
  }
};

// Dữ liệu mô phỏng cho người dùng
export const USER_DATA = {
  list: {
    data: [
      { _id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'user', status: 'active', createdAt: '2023-01-15', lastLogin: '2023-04-28' },
      { _id: 2, name: 'Jane Cooper', email: 'jane.cooper@example.com', role: 'user', status: 'active', createdAt: '2023-02-20', lastLogin: '2023-04-29' },
      { _id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', role: 'user', status: 'inactive', createdAt: '2023-01-10', lastLogin: '2023-03-15' },
      { _id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'user', status: 'active', createdAt: '2023-03-05', lastLogin: '2023-05-01' },
      { _id: 5, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2022-12-01', lastLogin: '2023-05-01' },
    ],
    meta: {
      totalItems: 5,
      totalPages: 1,
      currentPage: 1
    }
  }
};

// Dữ liệu mô phỏng cho danh mục xe
export const CATEGORY_DATA = {
  list: {
    data: [
      { _id: 1, name: 'Sedan', description: 'Comfortable 4-door cars with trunk', count: 12 },
      { _id: 2, name: 'SUV', description: 'Sport Utility Vehicles with extra space', count: 15 },
      { _id: 3, name: 'Luxury', description: 'High-end vehicles with premium features', count: 8 },
      { _id: 4, name: 'Electric', description: 'Eco-friendly electric vehicles', count: 5 },
      { _id: 5, name: 'Compact', description: 'Smaller, fuel-efficient cars', count: 10 },
    ]
  }
};

// Dữ liệu mô phỏng cho đánh giá
export const REVIEW_DATA = {
  list: {
    data: [
      { _id: 1, user: { name: 'John Smith' }, car: { name: 'Tesla Model 3' }, rating: 5, comment: 'Amazing car, very smooth drive!', createdAt: '2023-05-03' },
      { _id: 2, user: { name: 'Jane Cooper' }, car: { name: 'BMW X5' }, rating: 4, comment: 'Great SUV, lots of space but high fuel consumption', createdAt: '2023-04-30' },
      { _id: 3, user: { name: 'Robert Johnson' }, car: { name: 'Mercedes C-Class' }, rating: 5, comment: 'Luxury at its finest, worth every penny', createdAt: '2023-04-26' },
      { _id: 4, user: { name: 'Emily Davis' }, car: { name: 'Toyota Camry' }, rating: 4, comment: 'Reliable and comfortable, great for family trips', createdAt: '2023-05-05' },
      { _id: 5, user: { name: 'Michael Wilson' }, car: { name: 'Honda Civic' }, rating: 4, comment: 'Fuel efficient and easy to drive', createdAt: '2023-05-04' },
    ],
    meta: {
      totalItems: 5,
      totalPages: 1,
      currentPage: 1
    }
  }
};

// Dữ liệu mô phỏng cho cài đặt hệ thống
export const SETTINGS_DATA = {
  data: {
    siteName: 'Car Rental Service',
    contactEmail: 'support@carrental.example.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Rental Street, City, Country',
    currencySymbol: '$',
    taxRate: 10,
    bookingFee: 5,
    maintenanceFee: 25,
    depositPercentage: 15,
    minimumBookingHours: 4,
    maximumBookingDays: 30,
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
    termsAndConditions: 'Standard terms and conditions for vehicle rental',
    privacyPolicy: 'Privacy policy for user data and booking information',
  }
};

// Tập hợp tất cả dữ liệu
export const MOCK_DATA = {
  dashboard: DASHBOARD_DATA,
  bookings: BOOKING_DATA,
  cars: CAR_DATA,
  users: USER_DATA,
  categories: CATEGORY_DATA,
  reviews: REVIEW_DATA,
  settings: SETTINGS_DATA
}; 