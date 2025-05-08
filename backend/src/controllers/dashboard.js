const { Booking, User, Car, Statistic } = require('../models');

/**
 * Get dashboard statistics
 * @route GET /api/dashboard/stats
 * @access Private (Admin)
 */
exports.getStats = async (req, res) => {
  try {
    // Get counts from databases
    const [totalBookings, totalUsers, totalCars, bookingsData] = await Promise.all([
      Booking.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Car.countDocuments(),
      Booking.find().select('totalAmount createdAt status').lean()
    ]);

    // Calculate total revenue
    const totalRevenue = bookingsData.reduce((sum, booking) => {
      // Only count completed and active bookings
      if (['completed', 'active', 'confirmed'].includes(booking.status)) {
        return sum + (booking.totalAmount || 0);
      }
      return sum;
    }, 0);

    // Current month stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthBookings = bookingsData.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate.getMonth() === currentMonth && 
             bookingDate.getFullYear() === currentYear;
    });

    const currentMonthRevenue = currentMonthBookings.reduce((sum, booking) => {
      if (['completed', 'active', 'confirmed'].includes(booking.status)) {
        return sum + (booking.totalAmount || 0);
      }
      return sum;
    }, 0);

    // Get last 12 months booking trend
    const bookingTrend = Array(12).fill(0);
    const revenueTrend = Array(12).fill(0);
    
    bookingsData.forEach(booking => {
      const bookingDate = new Date(booking.createdAt);
      const monthIndex = bookingDate.getMonth();
      const bookingYear = bookingDate.getFullYear();
      
      // Only count data from current year
      if (bookingYear === currentYear) {
        bookingTrend[monthIndex]++;
        
        if (['completed', 'active', 'confirmed'].includes(booking.status)) {
          revenueTrend[monthIndex] += (booking.totalAmount || 0);
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        totalUsers,
        totalCars,
        totalRevenue,
        currentMonthBookings: currentMonthBookings.length,
        currentMonthRevenue,
        bookingTrend,
        revenueTrend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

/**
 * Get booking statistics
 * @route GET /api/dashboard/bookings
 * @access Private (Admin)
 */
exports.getBookingsStats = async (req, res) => {
  try {
    // Get all bookings
    const bookings = await Booking.find().select('status createdAt startDate endDate').lean();
    
    // Count bookings by status
    const statusCount = {
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0
    };
    
    bookings.forEach(booking => {
      if (statusCount[booking.status] !== undefined) {
        statusCount[booking.status]++;
      }
    });
    
    // Get daily bookings for last 30 days
    const dailyBookings = Array(30).fill(0);
    const today = new Date();
    
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt);
      const diffTime = Math.abs(today - bookingDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
      
      if (diffDays < 30) {
        dailyBookings[29 - diffDays]++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        statusCount,
        dailyBookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking statistics',
      error: error.message
    });
  }
};

/**
 * Get revenue statistics
 * @route GET /api/dashboard/revenue
 * @access Private (Admin)
 */
exports.getRevenueStats = async (req, res) => {
  try {
    // Get period from query (default: month)
    const { period = 'month' } = req.query;
    
    // Get all completed and active bookings
    const bookings = await Booking.find({
      status: { $in: ['completed', 'active', 'confirmed'] }
    }).select('totalAmount createdAt').lean();
    
    let data = [];
    
    // Format data based on requested period
    if (period === 'week') {
      // Calculate daily revenue for last 7 days
      const dailyRevenue = Array(7).fill(0);
      const today = new Date();
      
      bookings.forEach(booking => {
        const bookingDate = new Date(booking.createdAt);
        const diffTime = Math.abs(today - bookingDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
        
        if (diffDays < 7) {
          dailyRevenue[6 - diffDays] += booking.totalAmount || 0;
        }
      });
      
      // Format for response
      data = dailyRevenue.map((revenue, index) => ({
        day: index + 1,
        revenue
      }));
    } else if (period === 'year') {
      // Calculate quarterly revenue
      const now = new Date();
      const currentYear = now.getFullYear();
      const quarterlyRevenue = [0, 0, 0, 0]; // Q1, Q2, Q3, Q4
      
      bookings.forEach(booking => {
        const bookingDate = new Date(booking.createdAt);
        if (bookingDate.getFullYear() === currentYear) {
          const month = bookingDate.getMonth();
          const quarter = Math.floor(month / 3);
          quarterlyRevenue[quarter] += booking.totalAmount || 0;
        }
      });
      
      // Format for response
      data = quarterlyRevenue.map((revenue, index) => ({
        year: currentYear,
        quarter: index + 1,
        revenue
      }));
    } else {
      // Calculate monthly revenue for current year (default)
      const now = new Date();
      const currentYear = now.getFullYear();
      const monthlyRevenue = Array(12).fill(0);
      
      bookings.forEach(booking => {
        const bookingDate = new Date(booking.createdAt);
        if (bookingDate.getFullYear() === currentYear) {
          const monthIndex = bookingDate.getMonth();
          monthlyRevenue[monthIndex] += booking.totalAmount || 0;
        }
      });
      
      // Format for response
      data = monthlyRevenue.map((revenue, index) => ({
        month: index + 1,
        revenue
      }));
    }
    
    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    
    // Calculate average booking value
    const avgBookingValue = bookings.length > 0 ? 
      Math.round((totalRevenue / bookings.length) * 100) / 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        data,
        totalRevenue,
        avgBookingValue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue statistics',
      error: error.message
    });
  }
};

/**
 * Get top cars (most booked)
 * @route GET /api/dashboard/top-cars
 * @access Private (Admin)
 */
exports.getTopCars = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    // Aggregate bookings to find top cars
    const topCars = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['completed', 'active', 'confirmed'] }
        }
      },
      {
        $group: {
          _id: '$car',
          bookingsCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { bookingsCount: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'cars',
          localField: '_id',
          foreignField: '_id',
          as: 'carDetails'
        }
      },
      {
        $unwind: '$carDetails'
      },
      {
        $project: {
          _id: 1,
          name: '$carDetails.name',
          bookingsCount: 1,
          totalRevenue: 1,
          averageRating: '$carDetails.rating'
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: topCars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top cars',
      error: error.message
    });
  }
};

/**
 * Get cars by status
 * @route GET /api/dashboard/cars-by-status
 * @access Private (Admin)
 */
exports.getCarsByStatus = async (req, res) => {
  try {
    // Count cars by status
    const carStatusCounts = await Car.aggregate([
      {
        $group: {
          _id: '$availability',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format for response
    const statusData = [
      { status: 'available', count: 0 },
      { status: 'maintenance', count: 0 },
      { status: 'rented', count: 0 }
    ];
    
    // Map availability boolean to status
    carStatusCounts.forEach(item => {
      if (item._id === true) {
        statusData[0].count = item.count; // Available
      } else if (item._id === false) {
        statusData[1].count = item.count; // Maintenance
      }
    });
    
    // Find currently rented cars from active bookings
    const activeBookingsCount = await Booking.countDocuments({ status: 'active' });
    statusData[2].count = activeBookingsCount;
    
    res.status(200).json({
      success: true,
      data: statusData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cars by status',
      error: error.message
    });
  }
}; 