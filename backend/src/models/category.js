const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Category; 