const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const carController = require('../controllers/car');
const reviewController = require('../controllers/review');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for car image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.env.UPLOAD_PATH || './src/public/uploads', 'cars');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'), false);
  }
};

// Initialize upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Public routes
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);

// Add these routes for car reviews
router.get('/:carId/reviews', reviewController.getCarReviews);
router.post('/:carId/reviews', protect, reviewController.createReview);

// Protected routes
router.post('/', protect, authorize('admin'), carController.createCar);
router.put('/:id', protect, authorize('admin'), carController.updateCar);
router.delete('/:id', protect, authorize('admin'), carController.deleteCar);

// Car image routes
router.post('/:id/images', protect, authorize('admin'), upload.single('image'), carController.uploadImage);
router.delete('/:id/images/:imageId', protect, authorize('admin'), carController.deleteImage);

module.exports = router; 