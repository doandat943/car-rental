const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Đảm bảo người dùng chỉ đánh giá mỗi xe một lần
reviewSchema.index({ user: 1, car: 1 }, { unique: true });

// Cập nhật rating trung bình cho xe
reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const Car = mongoose.model('Car');
  
  const stats = await Review.aggregate([
    { $match: { car: this.car } },
    { $group: { _id: '$car', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
  ]);
  
  if (stats.length > 0) {
    await Car.findByIdAndUpdate(this.car, {
      rating: stats[0].avgRating,
      reviewCount: stats[0].numReviews
    });
  } else {
    await Car.findByIdAndUpdate(this.car, {
      rating: 0,
      reviewCount: 0
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 