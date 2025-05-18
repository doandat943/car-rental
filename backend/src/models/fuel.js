const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Fuel = mongoose.models.Fuel || mongoose.model('Fuel', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Fuel; 