const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Car = mongoose.models.Car || mongoose.model('Car', new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { 
    hourly: Number,
    daily: Number, 
    weekly: Number, 
    monthly: Number 
  },
  description: String,
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  seats: { type: Number, default: 5 },
  transmission: { type: mongoose.Schema.Types.ObjectId, ref: 'Transmission' },
  fuel: { type: mongoose.Schema.Types.ObjectId, ref: 'Fuel' },
  status: { 
    type: String, 
    enum: ['available', 'maintenance', 'rented', 'reserved'],
    default: 'available'
  },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Car; 