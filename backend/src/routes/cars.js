const express = require('express');
const router = express.Router();
const carController = require('../controllers/car');
const { authenticate, isAdmin } = require('../middlewares/auth');
const { uploadMultiple } = require('../middlewares/upload');

// Public routes
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);

// Protected routes - Admin only
router.post('/', authenticate, isAdmin, uploadMultiple('images', 5), carController.createCar);
router.put('/:id', authenticate, isAdmin, uploadMultiple('images', 5), carController.updateCar);
router.delete('/:id', authenticate, isAdmin, carController.deleteCar);

module.exports = router; 