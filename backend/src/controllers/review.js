const { Review, Car, Booking, User } = require('../models');

/**
 * Get all reviews
 * @route GET /api/reviews
 * @access Private (Admin)
 */
exports.getReviews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      rating, 
      car, 
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter
    const filter = {};
    if (rating) filter.rating = rating;
    if (car) filter.car = car;
    if (status) filter.status = status;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .populate('car', 'title brand model year')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    // Get total count
    const totalReviews = await Review.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: reviews,
      meta: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalReviews / Number(limit)),
        totalItems: totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

/**
 * Get reviews for a specific car
 * @route GET /api/cars/:carId/reviews
 * @access Public
 */
exports.getCarReviews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const carId = req.params.carId;
    
    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    // Filter for published reviews only (for public access)
    const filter = { 
      car: carId,
      status: 'published'
    };
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const reviews = await Review.find(filter)
      .populate('user', 'name avatar')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    // Get total count
    const totalReviews = await Review.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: reviews,
      meta: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalReviews / Number(limit)),
        totalItems: totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching car reviews',
      error: error.message
    });
  }
};

/**
 * Create a review
 * @route POST /api/cars/:carId/reviews
 * @access Private
 */
exports.createReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const { carId } = req.params;
    
    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    // Check if user has rented this car (has completed booking)
    const hasBooking = await Booking.findOne({
      user: req.user.id,
      car: carId,
      status: 'completed'
    });
    
    if (!hasBooking && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only review cars you have rented'
      });
    }
    
    // Check if user already reviewed this car
    const existingReview = await Review.findOne({
      user: req.user.id,
      car: carId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this car'
      });
    }
    
    // Create review with appropriate status based on user role
    const review = await Review.create({
      rating,
      title,
      comment,
      car: carId,
      user: req.user.id,
      booking: hasBooking ? hasBooking._id : null,
      status: req.user.role === 'admin' ? 'published' : 'pending'
    });
    
    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' 
        ? 'Review created successfully' 
        : 'Review submitted and waiting for approval',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

/**
 * Update review status
 * @route PATCH /api/reviews/:id/status
 * @access Private (Admin)
 */
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status || !['published', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be published, pending, or rejected'
      });
    }
    
    // Find review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Update status
    review.status = status;
    await review.save();
    
    res.status(200).json({
      success: true,
      message: `Review status updated to ${status}`,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review status',
      error: error.message
    });
  }
};

/**
 * Delete a review
 * @route DELETE /api/reviews/:id
 * @access Private (Admin or Review Owner)
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    await review.remove();
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
}; 