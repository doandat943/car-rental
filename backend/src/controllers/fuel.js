const { Fuel } = require('../models');
const { errorHandler } = require('../utils/errorHandler');

// Get all fuels
exports.getAllFuels = async (req, res) => {
  try {
    const fuels = await Fuel.find().sort('name');
    res.status(200).json({
      success: true,
      count: fuels.length,
      data: fuels
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Get fuel by ID
exports.getFuelById = async (req, res) => {
  try {
    const fuel = await Fuel.findById(req.params.id);
    
    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Fuel not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: fuel
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Create new fuel
exports.createFuel = async (req, res) => {
  try {
    const fuel = await Fuel.create(req.body);
    
    res.status(201).json({
      success: true,
      data: fuel
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Update fuel
exports.updateFuel = async (req, res) => {
  try {
    const fuel = await Fuel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Fuel not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: fuel
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Delete fuel
exports.deleteFuel = async (req, res) => {
  try {
    const fuel = await Fuel.findByIdAndDelete(req.params.id);
    
    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Fuel not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    errorHandler(error, res);
  }
}; 