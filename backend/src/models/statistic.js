const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema({
  overview: {
    totalRevenue: Number,
    totalBookings: Number,
    totalUsers: Number,
    totalCars: Number,
    pendingBookings: Number,
    availableCars: Number,
    monthlyRevenue: Number,
    monthlyBookings: Number
  },
  monthlyRevenue: [{
    label: String,
    value: Number
  }],
  monthlyBookings: [{
    label: String,
    value: Number
  }],
  carStatus: [{
    status: String,
    count: Number,
    label: String
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Statistic', statisticSchema); 