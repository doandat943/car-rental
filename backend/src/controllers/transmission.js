const Transmission = require('../models');
const { errorHandler } = require('../utils/errorHandler');

// Get all transmissions
exports.getAllTransmissions = async (req, res) => {
  try {
    const transmissions = await Transmission.find().sort('name');
    res.status(200).json({
      success: true,
      count: transmissions.length,
      data: transmissions
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Get transmission by ID
exports.getTransmissionById = async (req, res) => {
  try {
    const transmission = await Transmission.findById(req.params.id);
    
    if (!transmission) {
      return res.status(404).json({
        success: false,
        message: 'Transmission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transmission
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Create new transmission
exports.createTransmission = async (req, res) => {
  try {
    const transmission = await Transmission.create(req.body);
    
    res.status(201).json({
      success: true,
      data: transmission
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Update transmission
exports.updateTransmission = async (req, res) => {
  try {
    const transmission = await Transmission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!transmission) {
      return res.status(404).json({
        success: false,
        message: 'Transmission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transmission
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Delete transmission
exports.deleteTransmission = async (req, res) => {
  try {
    const transmission = await Transmission.findByIdAndDelete(req.params.id);
    
    if (!transmission) {
      return res.status(404).json({
        success: false,
        message: 'Transmission not found'
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