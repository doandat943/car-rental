const { WebsiteInfo, Setting } = require('../models');

/**
 * Get website information
 * @route GET /api/website-info
 * @access Public
 */
exports.getWebsiteInfo = async (req, res) => {
  try {
    // Get website info from database or create default if not exists
    let websiteInfo = await WebsiteInfo.findOne();
    
    if (!websiteInfo) {
      websiteInfo = await WebsiteInfo.create({});
    }
    
    res.status(200).json({
      success: true,
      data: websiteInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching website information',
      error: error.message
    });
  }
};

/**
 * Update website information
 * @route PUT /api/website-info
 * @access Private (Admin)
 */
exports.updateWebsiteInfo = async (req, res) => {
  try {
    // Find existing website info or create new
    let websiteInfo = await WebsiteInfo.findOne();
    
    // If website info exists, update it
    if (websiteInfo) {
      websiteInfo = await WebsiteInfo.findByIdAndUpdate(
        websiteInfo._id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    } else {
      // If no website info exists, create new ones
      websiteInfo = await WebsiteInfo.create(req.body);
    }
    
    res.status(200).json({
      success: true,
      message: 'Website information updated successfully',
      data: websiteInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating website information',
      error: error.message
    });
  }
};

/**
 * Get user settings
 * @route GET /api/settings
 * @access Private
 */
exports.getUserSettings = async (req, res) => {
  try {
    // Get settings for current user
    let settings = await Setting.findOne({ user: req.user.id });
    
    if (!settings) {
      // Create default settings for this user
      settings = await Setting.create({
        user: req.user.id
      });
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user settings',
      error: error.message
    });
  }
};

/**
 * Update user settings
 * @route PUT /api/settings
 * @access Private
 */
exports.updateUserSettings = async (req, res) => {
  try {
    // Find existing settings or create new for this user
    let settings = await Setting.findOne({ user: req.user.id });
    
    // If settings exist, update them
    if (settings) {
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    } else {
      // If no settings exist, create new ones with user ID
      const newSettings = {
        ...req.body,
        user: req.user.id
      };
      settings = await Setting.create(newSettings);
    }
    
    res.status(200).json({
      success: true,
      message: 'User settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user settings',
      error: error.message
    });
  }
}; 