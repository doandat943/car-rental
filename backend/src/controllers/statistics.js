const Statistic = require('../models/statistic');
const Booking = require('../models/booking');
const User = require('../models/user');
const Car = require('../models/car');

// Lấy dữ liệu thống kê tổng quan
exports.getStatistics = async (req, res) => {
  try {
    // Lấy dữ liệu thống kê mới nhất
    const latestStatistic = await Statistic.findOne().sort({ date: -1 });
    
    if (!latestStatistic) {
      // Nếu không có dữ liệu sẵn có, tạo dữ liệu thống kê mới
      const totalUsers = await User.countDocuments();
      const totalCars = await Car.countDocuments();
      const totalBookings = await Booking.countDocuments();
      const pendingBookings = await Booking.countDocuments({ status: 'pending' });
      const availableCars = await Car.countDocuments({ status: 'available' });
      
      // Tính tổng doanh thu từ đơn đặt xe
      const bookings = await Booking.find();
      const totalRevenue = bookings.reduce((total, booking) => {
        return total + (booking.totalAmount || 0);
      }, 0);
      
      // Tạo dữ liệu theo tháng (lấy 6 tháng gần nhất)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      const monthlyRevenue = [];
      const monthlyBookings = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        
        // Random values hoặc tính toán từ dữ liệu thực tế
        const randomRevenue = 5000 + Math.floor(Math.random() * 15000);
        const randomBookings = 10 + Math.floor(Math.random() * 40);
        
        monthlyRevenue.push({
          label: months[monthIndex],
          value: randomRevenue
        });
        
        monthlyBookings.push({
          label: months[monthIndex],
          value: randomBookings
        });
      }
      
      // Trạng thái xe
      const carStatus = [
        { status: 'available', count: availableCars, label: 'Available' },
        { status: 'maintenance', count: Math.floor(Math.random() * 10), label: 'Maintenance' },
        { status: 'rented', count: Math.floor(Math.random() * 15), label: 'Rented' }
      ];
      
      // Trả về dữ liệu được tính toán
      return res.status(200).json({
        success: true,
        data: {
          overview: {
            totalRevenue,
            totalBookings,
            totalUsers,
            totalCars,
            pendingBookings,
            availableCars,
            monthlyRevenue: monthlyRevenue[5].value,
            monthlyBookings: monthlyBookings[5].value
          },
          monthlyRevenue,
          monthlyBookings,
          carStatus,
        }
      });
    }
    
    // Trả về dữ liệu từ database
    res.status(200).json({
      success: true,
      data: {
        overview: latestStatistic.overview,
        monthlyRevenue: latestStatistic.monthlyRevenue,
        monthlyBookings: latestStatistic.monthlyBookings,
        carStatus: latestStatistic.carStatus,
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics',
      error: error.message
    });
  }
};

// Lấy danh sách các đơn đặt xe gần đây
exports.getRecentBookings = async (req, res) => {
  try {
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('car', 'name images');
    
    res.status(200).json({
      success: true,
      data: recentBookings
    });
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving recent bookings',
      error: error.message
    });
  }
};

// Lấy danh sách các xe được đặt nhiều nhất
exports.getTopCars = async (req, res) => {
  try {
    // Lấy đơn đặt xe đã hoàn thành
    const bookings = await Booking.find({ status: 'completed' });
    
    // Tính toán số lần đặt cho mỗi xe
    const carBookings = {};
    
    bookings.forEach(booking => {
      const carId = booking.car.toString();
      if (!carBookings[carId]) {
        carBookings[carId] = {
          count: 0,
          revenue: 0
        };
      }
      carBookings[carId].count += 1;
      carBookings[carId].revenue += booking.totalAmount || 0;
    });
    
    // Chuyển đổi thành mảng và sắp xếp
    const sortedCars = Object.entries(carBookings)
      .map(([carId, data]) => ({
        carId,
        bookingsCount: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.bookingsCount - a.bookingsCount);
    
    // Lấy top 5 xe
    const topCarIds = sortedCars.slice(0, 5).map(car => car.carId);
    
    // Lấy thông tin chi tiết của các xe
    const topCars = await Car.find({
      _id: { $in: topCarIds }
    });
    
    // Kết hợp thông tin xe với dữ liệu đặt xe
    const result = topCars.map(car => {
      const carData = sortedCars.find(item => item.carId === car._id.toString());
      return {
        _id: car._id,
        name: car.name,
        image: car.images && car.images.length > 0 ? car.images[0] : null,
        bookingsCount: carData.bookingsCount,
        revenue: carData.revenue
      };
    });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching top cars:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving top cars',
      error: error.message
    });
  }
}; 