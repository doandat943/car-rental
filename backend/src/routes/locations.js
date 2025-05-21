const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location');
const { protect, isAdmin } = require('../middlewares/auth');

// Public route - Get all active locations
router.get('/', locationController.getLocations);

// Public route - Get simplified location list for pickup/dropoff
router.get('/pickup-locations', locationController.getPickupLocations);

// Public route - Get location by ID
router.get('/:id', locationController.getLocationById);

// Admin only routes
router.post('/', protect, isAdmin, locationController.createLocation);
router.put('/:id', protect, isAdmin, locationController.updateLocation);
router.delete('/:id', protect, isAdmin, locationController.deleteLocation);

module.exports = router; 