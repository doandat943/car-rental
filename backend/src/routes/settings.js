const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const settingsController = require('../controllers/settings');

// Settings routes - admin only
router.get('/', protect, authorize('admin'), settingsController.getSettings);
router.put('/', protect, authorize('admin'), settingsController.updateSettings);

module.exports = router; 