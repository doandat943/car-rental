const { Statistic, Booking, User, Car } = require('../models');

// Get overview statistics data
exports.getStatistics = async (req, res) => {
  try {
    // Get the latest statistics
    const latestStatistic = await Statistic.findOne().sort({ date: -1 });
    
    if (!latestStatistic) {
      // If no data is available, create new statistics
      const totalUsers = await User.countDocuments();
      const totalCars = await Car.countDocuments();
      const totalBookings = await Booking.countDocuments();
      const pendingBookings = await Booking.countDocuments({ status: 'pending' });
      const availableCars = await Car.countDocuments({ status: 'active' });
      
      // Calculate total revenue from bookings
      const bookings = await Booking.find();
      const totalRevenue = bookings.reduce((total, booking) => {
        return total + (booking.totalAmount || 0);
      }, 0);
      
      // Create monthly data (get the last 6 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      const monthlyRevenue = [];
      const monthlyBookings = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        
        // Random values or calculate from actual data
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
      
      // Car status
      const carStatus = [
        { status: 'active', count: availableCars, label: 'Active' },
        { status: 'maintenance', count: Math.floor(Math.random() * 10), label: 'Maintenance' },
        { status: 'rented', count: Math.floor(Math.random() * 15), label: 'Rented' }
      ];
      
      // Return calculated data
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
    
    // Return data from database
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

// Get list of recent bookings
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

// Get list of most booked cars
exports.getTopCars = async (req, res) => {
  try {
    // Get completed bookings
    const bookings = await Booking.find({ status: 'completed' });
    
    // Calculate booking count for each car
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
    
    // Convert to array and sort
    const sortedCars = Object.entries(carBookings)
      .map(([carId, data]) => ({
        carId,
        bookingsCount: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.bookingsCount - a.bookingsCount);
    
    // Get top 5 cars
    const topCarIds = sortedCars.slice(0, 5).map(car => car.carId);
    
    // Get detailed information of the cars
    const topCars = await Car.find({
      _id: { $in: topCarIds }
    });
    
    // Combine car info with booking data
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
    
    // Return calculated data
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while calculating statistics'
    });
  }
};

// Get user statistics from database
exports.getDatabaseStatistics = async (req, res) => {
  try {
    // Return data from database
    // Implementation needed
  } catch (error) {
    console.error('Error fetching database statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving database statistics',
      error: error.message
    });
  }
}; 