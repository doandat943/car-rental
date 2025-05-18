const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Brand = mongoose.models.Brand || mongoose.model('Brand', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  logo: String,
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Brand; 