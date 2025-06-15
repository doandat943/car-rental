const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const websiteInfoController = require('../controllers/websiteInfo');

// Website Info routes
router.get('/', websiteInfoController.getWebsiteInfo); // Public route
router.put('/', protect, authorize('admin'), websiteInfoController.updateWebsiteInfo);

// Content Pages routes
router.get('/pages', websiteInfoController.getAllContentPages); // Public route
router.get('/pages/:pageType', websiteInfoController.getContentPage); // Public route
router.put('/pages/:pageType', protect, authorize('admin'), websiteInfoController.updateContentPage);

module.exports = router; 