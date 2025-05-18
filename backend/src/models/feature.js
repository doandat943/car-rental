const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Feature = mongoose.models.Feature || mongoose.model('Feature', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  category: { type: String, enum: ['comfort', 'safety', 'performance', 'technology', 'other'], default: 'other' },
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Feature; 