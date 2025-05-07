const { Booking, User, Car } = require('../models');

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
    // Get all completed and active bookings
    const bookings = await Booking.find({
      status: { $in: ['completed', 'active', 'confirmed'] }
    }).select('totalAmount createdAt').lean();
    
    // Calculate monthly revenue for current year
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
    
    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    
    // Calculate average booking value
    const avgBookingValue = bookings.length > 0 ? 
      Math.round((totalRevenue / bookings.length) * 100) / 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        monthlyRevenue,
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