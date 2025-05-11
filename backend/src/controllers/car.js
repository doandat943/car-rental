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
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    console.log('Query params:', req.query);
    
    // Build filter object
    const filter = {};
    
    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (seats) filter['specifications.seats'] = seats;
    
    // Price filter
    if (minPrice || maxPrice) {
      filter['price.daily'] = {};
      if (minPrice) filter['price.daily'].$gte = Number(minPrice);
      if (maxPrice) filter['price.daily'].$lte = Number(maxPrice);
    }
    
    console.log('Filter object:', filter);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    console.log('Sort object:', sort);
    
    // Execute query with pagination
    const cars = await Car.find(filter)
      .populate('category', 'name')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    // Get total count
    const totalCars = await Car.countDocuments(filter);
    
    console.log('Found cars count:', cars.length);
    console.log('Total cars in DB matching filter:', totalCars);
    
    // Log sample car for debugging
    if (cars.length > 0) {
      console.log('Sample car data structure:', 
        JSON.stringify(cars[0].toObject ? cars[0].toObject() : cars[0], null, 2)
      );
    }
    
    // Return data in the format expected by the frontend
    const responseObj = {
      success: true,
      data: cars,  // Return the cars array directly instead of embedding in an object
      meta: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCars / Number(limit)),
        totalItems: totalCars
      }
    };
    
    console.log('Response structure:', {
      success: responseObj.success,
      dataType: Array.isArray(responseObj.data) ? 'array' : typeof responseObj.data,
      dataLength: Array.isArray(responseObj.data) ? responseObj.data.length : 'not an array',
      meta: responseObj.meta
    });
    
    res.status(200).json(responseObj);
  } catch (error) {
    console.error('Error fetching cars:', error);
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
    const car = await Car.findById(req.params.id).populate('category', 'name');
    
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
      specifications: {
        seats: req.body.seats,
        doors: req.body.doors,
        transmission: req.body.transmission,
        fuelType: req.body.fuelType,
        engineCapacity: req.body.engineCapacity
      },
      price: {
        hourly: req.body.hourlyPrice,
        daily: req.body.dailyPrice,
        weekly: req.body.weeklyPrice,
        monthly: req.body.monthlyPrice
      }
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
    
    // Add new images if files were uploaded
    let images = [...car.images];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }
    
    // Update car
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images,
        specifications: {
          seats: req.body.seats || car.specifications.seats,
          doors: req.body.doors || car.specifications.doors,
          transmission: req.body.transmission || car.specifications.transmission,
          fuelType: req.body.fuelType || car.specifications.fuelType,
          engineCapacity: req.body.engineCapacity || car.specifications.engineCapacity
        },
        price: {
          hourly: req.body.hourlyPrice || car.price.hourly,
          daily: req.body.dailyPrice || car.price.daily,
          weekly: req.body.weeklyPrice || car.price.weekly,
          monthly: req.body.monthlyPrice || car.price.monthly
        }
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