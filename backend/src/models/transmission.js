const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Transmission = mongoose.models.Transmission || mongoose.model('Transmission', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Transmission; 