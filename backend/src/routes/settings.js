const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const settingsController = require('../controllers/settings');

// User Settings routes
router.get('/user', protect, settingsController.getUserSettings);
router.put('/user', protect, settingsController.updateUserSettings);

module.exports = router; 