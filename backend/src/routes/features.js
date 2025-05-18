const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/auth');
const {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature
} = require('../controllers/feature');

// Public routes
router.get('/', getAllFeatures);
router.get('/:id', getFeatureById);

// Protected routes - only for admins
router.post('/', protect, isAdmin, createFeature);
router.put('/:id', protect, isAdmin, updateFeature);
router.delete('/:id', protect, isAdmin, deleteFeature);

module.exports = router; 