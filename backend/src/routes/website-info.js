const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const websiteInfoController = require('../controllers/websiteInfo');

// Website Info routes
router.get('/', websiteInfoController.getWebsiteInfo); // Public route
router.put('/', protect, authorize('admin'), websiteInfoController.updateWebsiteInfo);

module.exports = router; 