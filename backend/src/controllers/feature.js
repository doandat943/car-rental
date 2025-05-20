const { Feature } = require('../models');
const { errorHandler } = require('../utils/errorHandler');

// Get all features
exports.getAllFeatures = async (req, res) => {
  try {
    // Support filtering by category
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const features = await Feature.find(filter).sort('name');
    res.status(200).json({
      success: true,
      count: features.length,
      data: features
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Get feature by ID
exports.getFeatureById = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);
    
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: feature
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Create new feature
exports.createFeature = async (req, res) => {
  try {
    const feature = await Feature.create(req.body);
    
    res.status(201).json({
      success: true,
      data: feature
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Update feature
exports.updateFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: feature
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Delete feature
exports.deleteFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
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