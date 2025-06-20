const mongoose = require('mongoose');

// Check if model already exists to avoid redefining
const Car = mongoose.models.Car || mongoose.model('Car', new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true }, // Daily rate only
  description: String,
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  seats: { type: Number, default: 5 },
  transmission: { type: mongoose.Schema.Types.ObjectId, ref: 'Transmission' },
  fuel: { type: mongoose.Schema.Types.ObjectId, ref: 'Fuel' },
  status: { 
    type: String, 
    enum: ['active', 'maintenance', 'overdue_return'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now }
}));

module.exports = Car; 