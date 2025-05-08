const mongoose = require('mongoose');

// Schema cho thống kê hàng ngày
const DailyStatSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  users: {
    type: Number,
    default: 0
  },
  cars: {
    type: Number,
    default: 0
  },
  bookings: {
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
  }
});

// Schema cho doanh thu hàng tháng
const MonthlyRevenueSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  revenue: {
    type: Number,
    default: 0
  }
});

// Schema cho xe đặt hàng đầu
const TopCarSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  bookingsCount: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  }
});

// Schema cho dữ liệu tổng quan
const OverviewSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    default: 0
  },
  totalCars: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  userGrowth: {
    type: Number,
    default: 0
  },
  carGrowth: {
    type: Number,
    default: 0
  },
  bookingGrowth: {
    type: Number,
    default: 0
  },
  revenueGrowth: {
    type: Number,
    default: 0
  },
  userTrend: [Number],
  carTrend: [Number],
  bookingTrend: [Number],
  revenueTrend: [Number]
});

// Chính Schema Thống kê
const StatisticSchema = new mongoose.Schema({
  dailyStats: [DailyStatSchema],
  monthlyRevenue: [MonthlyRevenueSchema],
  topCars: [TopCarSchema],
  overview: OverviewSchema,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Middleware tự động cập nhật thời gian khi thay đổi
StatisticSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Export model
module.exports = mongoose.model('Statistic', StatisticSchema); 