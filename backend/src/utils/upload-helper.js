/**
 * Utility functions for file uploads and storage management
 */
const fs = require('fs');
const path = require('path');

/**
 * Creates upload directories if they don't exist
 * @param {string} type Type of upload (cars, categories, users, etc.)
 * @returns {string} Path to the upload directory
 */
const ensureUploadDir = (type = 'misc') => {
  const basePath = process.env.UPLOAD_PATH || path.join(__dirname, '../public/uploads');
  const uploadPath = path.join(basePath, type);
  
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  
  return uploadPath;
};

/**
 * Gets the relative URL path for a file
 * @param {string} type Type of upload (cars, categories, users, etc.)
 * @param {string} filename Filename
 * @returns {string} URL path
 */
const getUploadPath = (type, filename) => {
  return `/uploads/${type}/${filename}`;
};

/**
 * Deletes a file from the uploads directory
 * @param {string} filePath Full path to the file
 * @returns {boolean} Success status
 */
const deleteUploadedFile = (filePath) => {
  try {
    if (filePath.startsWith('/uploads/')) {
      // Convert URL path to filesystem path
      const basePath = process.env.UPLOAD_PATH || path.join(__dirname, '../public');
      filePath = path.join(basePath, filePath);
    }
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Creates a placeholder file for development/testing
 * @param {string} type Type of upload (cars, categories, users, etc.)
 * @param {string} filename Filename
 * @param {string} content File content (for placeholders)
 * @returns {string} Path to the created file
 */
const createPlaceholderFile = (type, filename, content = 'Placeholder file') => {
  const uploadPath = ensureUploadDir(type);
  const filePath = path.join(uploadPath, filename);
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  }
  
  return getUploadPath(type, filename);
};

module.exports = {
  ensureUploadDir,
  getUploadPath,
  deleteUploadedFile,
  createPlaceholderFile
}; 