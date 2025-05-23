const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema({
  overview: {
    totalRevenue: Number,
    totalBookings: Number,
    totalUsers: Number,
    totalCars: Number,
    pendingBookings: Number,
    availableCars: Number,
    completedBookings: Number,
    cancelledBookings: Number,
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

const Statistic = mongoose.models.Statistic || mongoose.model('Statistic', statisticSchema);

module.exports = Statistic; 