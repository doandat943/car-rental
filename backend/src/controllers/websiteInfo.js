const { WebsiteInfo } = require('../models');

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
 * Get specific content page
 * @route GET /api/website-info/pages/:pageType
 * @access Public
 */
exports.getContentPage = async (req, res) => {
  try {
    const { pageType } = req.params;
    
    // Validate page type
    const validPageTypes = ['aboutUs', 'termsAndConditions', 'privacyPolicy', 'cancellationPolicy'];
    if (!validPageTypes.includes(pageType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page type'
      });
    }
    
    let websiteInfo = await WebsiteInfo.findOne();
    
    if (!websiteInfo) {
      websiteInfo = await WebsiteInfo.create({});
    }
    
    const pageContent = websiteInfo.contentPages[pageType] || '';
    
    res.status(200).json({
      success: true,
      data: {
        pageType,
        content: pageContent,
        lastUpdated: websiteInfo.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching content page',
      error: error.message
    });
  }
};

/**
 * Update specific content page
 * @route PUT /api/website-info/pages/:pageType
 * @access Private (Admin)
 */
exports.updateContentPage = async (req, res) => {
  try {
    const { pageType } = req.params;
    const { content } = req.body;
    
    // Validate page type
    const validPageTypes = ['aboutUs', 'termsAndConditions', 'privacyPolicy', 'cancellationPolicy'];
    if (!validPageTypes.includes(pageType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page type'
      });
    }
    
    if (!content && content !== '') {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }
    
    let websiteInfo = await WebsiteInfo.findOne();
    
    if (!websiteInfo) {
      websiteInfo = await WebsiteInfo.create({});
    }
    
    // Update the specific content page
    const updateData = {};
    updateData[`contentPages.${pageType}`] = content;
    
    websiteInfo = await WebsiteInfo.findByIdAndUpdate(
      websiteInfo._id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      message: `${pageType} content updated successfully`,
      data: {
        pageType,
        content: websiteInfo.contentPages[pageType],
        lastUpdated: websiteInfo.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating content page',
      error: error.message
    });
  }
};

/**
 * Get all content pages
 * @route GET /api/website-info/pages
 * @access Public
 */
exports.getAllContentPages = async (req, res) => {
  try {
    let websiteInfo = await WebsiteInfo.findOne();
    
    if (!websiteInfo) {
      websiteInfo = await WebsiteInfo.create({});
    }
    
    res.status(200).json({
      success: true,
      data: {
        contentPages: websiteInfo.contentPages,
        lastUpdated: websiteInfo.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching content pages',
      error: error.message
    });
  }
}; 