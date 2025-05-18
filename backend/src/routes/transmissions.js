const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/auth');
const {
  getAllTransmissions,
  getTransmissionById,
  createTransmission,
  updateTransmission,
  deleteTransmission
} = require('../controllers/transmission');

// Public routes
router.get('/', getAllTransmissions);
router.get('/:id', getTransmissionById);

// Protected routes - only for admins
router.post('/', protect, isAdmin, createTransmission);
router.put('/:id', protect, isAdmin, updateTransmission);
router.delete('/:id', protect, isAdmin, deleteTransmission);

module.exports = router; 