const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const settingsController = require('../controllers/settings');

// Website Info routes
router.get('/', settingsController.getWebsiteInfo); // Public route
router.put('/', protect, authorize('admin'), settingsController.updateWebsiteInfo);

module.exports = router; 