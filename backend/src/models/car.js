const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Car = mongoose.models.Car || mongoose.model('Car', new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { 
    hourly: Number,
    daily: Number, 
    weekly: Number, 
    monthly: Number 
  },
  description: String,
  features: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  specifications: {
    seats: Number,
    doors: Number,
    transmission: String,
    fuelType: String,
    engineCapacity: String
  },
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