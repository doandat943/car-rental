const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/auth');
const {
  getAllFuels,
  getFuelById,
  createFuel,
  updateFuel,
  deleteFuel
} = require('../controllers/fuel');

// Public routes
router.get('/', getAllFuels);
router.get('/:id', getFuelById);

// Protected routes - only for admins
router.post('/', protect, isAdmin, createFuel);
router.put('/:id', protect, isAdmin, updateFuel);
router.delete('/:id', protect, isAdmin, deleteFuel);

module.exports = router; 