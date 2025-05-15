const { WebsiteInfo } = require('../models');

/**
 * Get system settings
 * @route GET /api/settings
 * @access Private (Admin)
 */
exports.getSettings = async (req, res) => {
  try {
    // Get settings from database or create default if not exists
    let settings = await WebsiteInfo.findOne();
    
    if (!settings) {
      settings = await WebsiteInfo.create({
        siteName: 'Car Rental System',
        description: 'Online car rental platform',
        email: 'contact@example.com',
        phone: '+1234567890',
        address: '123 Main Street, City',
        logo: '/uploads/logo.png',
        socialMedia: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          instagram: 'https://instagram.com'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

/**
 * Update system settings
 * @route PUT /api/settings
 * @access Private (Admin)
 */
exports.updateSettings = async (req, res) => {
  try {
    // Find existing settings or create new
    let settings = await WebsiteInfo.findOne();
    
    // If settings exist, update them
    if (settings) {
      settings = await WebsiteInfo.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    } else {
      // If no settings exist, create new ones
      settings = await WebsiteInfo.create(req.body);
    }
    
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
}; 