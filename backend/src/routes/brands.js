const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/auth');
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brand');

// Public routes
router.get('/', getAllBrands);
router.get('/:id', getBrandById);

// Protected routes - only for admins
router.post('/', protect, isAdmin, createBrand);
router.put('/:id', protect, isAdmin, updateBrand);
router.delete('/:id', protect, isAdmin, deleteBrand);

module.exports = router; 