const { Car } = require('../models');

/**
 * Get all cars with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCars = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      brand, 
      category,
      minPrice,
      maxPrice,
      seats,
      status,
      fuel,
      transmission,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (seats) filter.seats = seats;
    if (fuel) filter.fuel = fuel;
    if (transmission) filter.transmission = transmission;
    
    // Use status field directly
    if (status) {
      filter.status = status;
    }
    
    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const cars = await Car.find(filter)
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('transmission', 'name')
      .populate('fuel', 'name')
      .populate('features', 'name')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    // Get total count
    const totalCars = await Car.countDocuments(filter);
    
    // Return data in the format expected by the frontend
    const responseObj = {
      success: true,
      data: cars,
      meta: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCars / Number(limit)),
        totalItems: totalCars
      }
    };
    
    res.status(200).json(responseObj);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cars',
      error: error.message
    });
  }
};

/**
 * Get car by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('transmission', 'name')
      .populate('fuel', 'name')
      .populate('features', 'name');
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching car',
      error: error.message
    });
  }
};

/**
 * Create a new car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createCar = async (req, res) => {
  try {
    // Set images array if files were uploaded
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    // Create new car
    const car = new Car({
      ...req.body,
      images,
      seats: req.body.seats,
      transmission: req.body.transmission,
      fuel: req.body.fuel,
      price: req.body.price || req.body.dailyPrice || 0
    });
    
    await car.save();
    
    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating car',
      error: error.message
    });
  }
};

/**
 * Update a car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    // Handle images array
    let images = [];
    
    // If client sends images array, use it (maintain order)
    if (req.body.images && Array.isArray(req.body.images)) {
      images = req.body.images;
    } else {
      // Otherwise, use existing images
      images = [...car.images];
    }
    
    // Add new images if files were uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/cars/${file.filename}`);
      images = [...images, ...newImages];
    }
    
    // Update car
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images, // Use images order we determined
        seats: req.body.seats || car.seats,
        transmission: req.body.transmission || car.transmission,
        fuel: req.body.fuel || car.fuel,
        price: req.body.price || car.price
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: updatedCar
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating car',
      error: error.message
    });
  }
};

/**
 * Delete a car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    await Car.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting car',
      error: error.message
    });
  }
};

/**
 * Upload an image to a car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.uploadImage = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    // Check if there's a file uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    // Generate image path
    const imagePath = `/uploads/cars/${req.file.filename}`;
    
    // Add the new image to the car's images array
    car.images.push(imagePath);
    await car.save();
    
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: imagePath
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
};

/**
 * Delete an image from a car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    
    const car = await Car.findById(id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    // Find the image in the car's images array
    if (!car.images.includes(imageId)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    // Remove the image from the car's images array
    car.images = car.images.filter(image => image !== imageId);
    await car.save();
    
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
};

/**
 * Check car availability for specific dates
 * @route POST /api/cars/:id/check-status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkCarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;
    
    // Validate required fields
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    // Find the car
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    // Check if car is in a state that prevents booking (maintenance, overdue return)
    if (car.status === 'maintenance' || car.status === 'overdue_return') {
      const statusMessage = car.status === 'maintenance' 
        ? 'Car is currently under maintenance'
        : 'Car has overdue return and cannot be booked';
      
      return res.status(200).json({
        success: true,
        available: false,
        message: statusMessage,
        status: car.status
      });
    }
    
    // Check for overlapping bookings
    const { Booking } = require('../models');
    const overlappingBookings = await Booking.find({
      car: id,
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
    
    // Get all bookings for calendar display
    const allBookings = await Booking.find({
      car: id,
      status: { $nin: ['cancelled'] },
      startDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }, // Last 30 days
      endDate: { $lte: new Date(new Date().setDate(new Date().getDate() + 90)) }    // Next 90 days
    }).select('startDate endDate status');
    
    // Format bookings for calendar
    const bookedDates = allBookings.map(booking => ({
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status
    }));
    
    if (overlappingBookings.length > 0) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Car is already booked for the selected dates',
        bookedDates
      });
    }
    
    return res.status(200).json({
      success: true,
      available: true,
      message: 'Car is available for the selected dates',
      bookedDates
    });
  } catch (error) {
    console.error('Error checking car status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking car availability',
      error: error.message
    });
  }
}; 