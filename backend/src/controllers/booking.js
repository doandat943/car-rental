const { Booking, Car } = require('../models');

/**
 * Get all bookings with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getBookings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Admin can see all bookings, customer can only see their bookings
    if (req.user.role === 'customer') {
      filter.customer = req.user.id;
    }
    
    if (status) filter.status = status;
    
    // Date filter
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.endDate.$lte = new Date(endDate);
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const bookings = await Booking.find(filter)
      .populate('customer', 'firstName lastName email')
      .populate('car', 'name brand model year images')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    // Get total count
    const totalBookings = await Booking.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        bookings,
        currentPage: Number(page),
        totalPages: Math.ceil(totalBookings / Number(limit)),
        totalBookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

/**
 * Get booking by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'firstName lastName email phoneNumber')
      .populate('car', 'name brand model year images price');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user is authorized to view this booking
    if (req.user.role === 'customer' && booking.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

/**
 * Create a new booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, pickupLocation, dropoffLocation } = req.body;
    
    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    // Check if car is available
    if (!car.availability) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for booking'
      });
    }
    
    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      car: carId,
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        { startDate: { $lte: new Date(endDate), $gte: new Date(startDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { 
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) }
        }
      ]
    });
    
    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Car is already booked for the selected dates'
      });
    }
    
    // Calculate booking duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMs = end - start;
    const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));
    
    // Calculate total amount based on daily price
    const totalAmount = car.price.daily * durationInDays;
    
    // Create new booking
    const booking = new Booking({
      customer: req.user.id,
      car: carId,
      startDate,
      endDate,
      totalAmount,
      pickupLocation,
      dropoffLocation
    });
    
    await booking.save();
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

/**
 * Update booking status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Only admin can update booking status
    if (req.user.role === 'customer') {
      // Customers can only cancel their own bookings
      if (status === 'cancelled' && booking.customer.toString() === req.user.id) {
        booking.status = 'cancelled';
      } else {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this booking'
        });
      }
    } else {
      // Admin updates
      if (status) booking.status = status;
      if (paymentStatus) booking.paymentStatus = paymentStatus;
    }
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

/**
 * Delete a booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Only admin can delete bookings
    if (req.user.role === 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete bookings'
      });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
}; 