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
      .populate('customer', 'name firstName lastName email phone phoneNumber')
      .populate({
        path: 'car',
        select: 'name brand model year images price category transmission fuel seats',
        populate: [
          { path: 'brand', select: 'name' },
          { path: 'category', select: 'name' },
          { path: 'transmission', select: 'name' },
          { path: 'fuel', select: 'name' }
        ]
      })
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
      .populate('customer', 'name firstName lastName email phone phoneNumber')
      .populate({
        path: 'car',
        select: 'name brand model year images price category transmission fuel seats',
        populate: [
          { path: 'brand', select: 'name' },
          { path: 'category', select: 'name' },
          { path: 'transmission', select: 'name' },
          { path: 'fuel', select: 'name' }
        ]
      });
    
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
    const { 
      carId, 
      startDate, 
      endDate, 
      totalAmount: requestTotalAmount,
      includeDriver = false, 
      doorstepDelivery = false,
      paymentMethod = 'cash',
      paymentType = 'full',
      depositAmount = 0,
      remainingAmount = 0,
      termsAccepted = false,
      termsAcceptedAt,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!carId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Car ID, start date, and end date are required'
      });
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Terms and conditions must be accepted'
      });
    }

    // Validate payment method
    const validPaymentMethods = ['paypal', 'credit_card', 'bank_transfer', 'cash'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // Validate payment type
    const validPaymentTypes = ['full', 'deposit'];
    if (!validPaymentTypes.includes(paymentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment type'
      });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Check if car is available for the selected dates
    const overlappingBookings = await Booking.find({
      car: carId,
      status: { $in: ['confirmed', 'ongoing'] },
      $or: [
        {
          startDate: { $lte: new Date(startDate) },
          endDate: { $gt: new Date(startDate) }
        },
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gte: new Date(endDate) }
        },
        {
          startDate: { $gte: new Date(startDate) },
          endDate: { $lte: new Date(endDate) }
        }
      ]
    });
    
    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Car is already booked for the selected dates'
      });
    }
    
    try {
      // Calculate booking duration in days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationInMs = end - start;
      const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));
      
      if (durationInDays <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid booking dates. End date must be after start date.'
        });
      }
      
      // Calculate service fees
      const driverFee = includeDriver ? 30 * durationInDays : 0; // $30 per day
      const deliveryFee = doorstepDelivery ? 25 : 0; // Fixed $25 fee
      
      // Use totalAmount from request if provided, otherwise calculate
      let totalAmount;
      if (requestTotalAmount && requestTotalAmount > 0) {
        totalAmount = requestTotalAmount;
      } else {
        // Calculate total amount based on daily price
        const dailyPrice = car.price || 0;
        const rentalAmount = dailyPrice * durationInDays;
        totalAmount = rentalAmount + driverFee + deliveryFee;
      }

      // Validate deposit amounts if payment type is deposit
      if (paymentType === 'deposit') {
        if (depositAmount <= 0 || remainingAmount <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Invalid deposit or remaining amount'
          });
        }
        if (depositAmount + remainingAmount !== totalAmount) {
          return res.status(400).json({
            success: false,
            message: 'Deposit and remaining amount must equal total amount'
          });
        }
      }
      
      // Create new booking
      const booking = new Booking({
        customer: req.user.id,
        car: carId,
        startDate,
        endDate,
        totalAmount,
        includeDriver,
        doorstepDelivery,
        driverFee,
        deliveryFee,
        totalDays: durationInDays,
        paymentMethod,
        paymentType,
        depositAmount: paymentType === 'deposit' ? depositAmount : 0,
        remainingAmount: paymentType === 'deposit' ? remainingAmount : 0,
        termsAccepted,
        termsAcceptedAt: termsAcceptedAt || new Date(),
        specialRequests
      });
      
      await booking.save();
      
      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking
      });
    } catch (err) {
      console.error('Error processing booking data:', err);
      return res.status(400).json({
        success: false,
        message: 'Error processing booking data',
        error: err.message
      });
    }
  } catch (error) {
    console.error('Booking creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message || 'Unknown server error'
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
 * Get current user's bookings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserBookings = async (req, res) => {
  try {
    const { 
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object for current user
    const filter = {
      customer: req.user.id
    };
    
    if (status) filter.status = status;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query
    const bookings = await Booking.find(filter)
      .populate('customer', 'name firstName lastName email phone phoneNumber')
      .populate({
        path: 'car',
        select: 'name brand model year images price category transmission fuel seats',
        populate: [
          { path: 'brand', select: 'name' },
          { path: 'category', select: 'name' },
          { path: 'transmission', select: 'name' },
          { path: 'fuel', select: 'name' }
        ]
      })
      .sort(sort);
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your bookings',
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