/**
 * Standard error handler for controller functions
 * @param {Error} error - The error that occurred
 * @param {Response} res - Express response object
 */
exports.errorHandler = (error, res) => {
  console.error('API Error:', error);
  
  // Check if it's a Mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(val => val.message)
    });
  }
  
  // Check if it's a Mongoose cast error (invalid ID)
  if (error.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: `Resource not found with id ${error.value}`
    });
  }
  
  // Check for duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}. This ${field} already exists.`
    });
  }
  
  // Default error handling
  return res.status(500).json({
    success: false,
    message: error.message || 'Server error'
  });
}; 