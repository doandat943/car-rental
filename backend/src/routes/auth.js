const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', protect, authController.getProfile);

module.exports = router; 