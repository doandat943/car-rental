const { Location } = require('../models');

/**
 * Get all pickup locations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).sort('name');
    
    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message
    });
  }
};

/**
 * Get location by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching location',
      error: error.message
    });
  }
};

/**
 * Create a new location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createLocation = async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create locations'
      });
    }
    
    const { name, code, address, hours, description, coordinates } = req.body;
    
    // Check if location with same code already exists
    const existingLocation = await Location.findOne({ code });
    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: 'A location with this code already exists'
      });
    }
    
    const location = new Location({
      name,
      code,
      address,
      hours,
      description,
      coordinates
    });
    
    await location.save();
    
    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating location',
      error: error.message
    });
  }
};

/**
 * Update location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateLocation = async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update locations'
      });
    }
    
    const { name, address, hours, description, coordinates, isActive } = req.body;
    
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    // Update fields
    if (name) location.name = name;
    if (address) location.address = address;
    if (hours) location.hours = hours;
    if (description !== undefined) location.description = description;
    if (coordinates) location.coordinates = coordinates;
    if (isActive !== undefined) location.isActive = isActive;
    
    await location.save();
    
    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message
    });
  }
};

/**
 * Delete location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteLocation = async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete locations'
      });
    }
    
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    // Instead of deleting, mark as inactive
    location.isActive = false;
    await location.save();
    
    res.status(200).json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting location',
      error: error.message
    });
  }
};

/**
 * Frontend-specific API to get pickup/dropoff locations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPickupLocations = async (req, res) => {
  try {
    // Retrieve only the necessary fields for the frontend dropdown
    const locations = await Location.find({ isActive: true }, 'name code address hours')
      .sort('name');
    
    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pickup locations',
      error: error.message
    });
  }
}; 