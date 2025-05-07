const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middlewares/auth');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get upload type from URL parameter (cars, users, etc.)
    const uploadType = req.params.type || 'misc';
    const uploadPath = path.join(process.env.UPLOAD_PATH || './src/public/uploads', uploadType);
    
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

/**
 * @route   POST /api/upload/:type
 * @desc    Upload an image
 * @access  Private
 */
router.post('/:type', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Get upload type from URL parameter (cars, users, etc.)
    const uploadType = req.params.type || 'misc';
    
    // Construct URL path to the uploaded file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const filePath = `/uploads/${uploadType}/${req.file.filename}`;
    const fileUrl = `${baseUrl}${filePath}`;
    
    res.status(200).json({
      success: true,
      imageUrl: filePath, // Relative path for storing in database
      fullUrl: fileUrl, // Full URL for client use
      fileName: req.file.filename,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/upload/:type/:filename
 * @desc    Delete an uploaded image
 * @access  Private (Admin)
 */
router.delete('/:type/:filename', protect, authorize('admin'), (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(
      process.env.UPLOAD_PATH || './src/public/uploads',
      type,
      filename
    );
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'File deletion failed',
      error: error.message
    });
  }
});

module.exports = router; 