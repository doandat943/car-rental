const mongoose = require('mongoose');
const { Review, User, Car, Booking } = require('../models');

/**
 * Seeds the database with initial review data
 * Creates reviews with varied ratings and comments for completed bookings
 */
const seedReviews = async () => {
  try {
    // Check if reviews already exist in the database
    const count = await Review.countDocuments();
    if (count > 0) {
      console.log('Reviews already seeded');
      return;
    }

    // Get completed bookings to create reviews for
    const completedBookings = await Booking.find({ status: 'completed' })
      .populate('customer')
      .populate('car');

    if (completedBookings.length === 0) {
      console.log('No completed bookings found. Cannot seed reviews');
      return;
    }

    const reviewsData = [];
    // Track user-car combinations to prevent duplicates
    const userCarCombinations = new Set();

    // Create reviews for 80% of completed bookings
    for (const booking of completedBookings) {
      // Skip some bookings to simulate not all customers leave reviews
      if (Math.random() > 0.8) continue;

      // Skip if this user-car combination already exists
      const userCarKey = `${booking.customer._id}-${booking.car._id}`;
      if (userCarCombinations.has(userCarKey)) continue;
      
      // Add this combination to our tracking set
      userCarCombinations.add(userCarKey);

      // Generate random rating between 1 and 5, weighted towards positive reviews
      const ratingDistribution = [1, 2, 3, 4, 4, 5, 5, 5, 5, 5];
      const rating = ratingDistribution[Math.floor(Math.random() * ratingDistribution.length)];
      
      // Create review 1-5 days after booking end date
      const reviewDate = new Date(booking.endDate);
      reviewDate.setDate(reviewDate.getDate() + Math.floor(Math.random() * 5) + 1);
      
      // Create review object
      const review = {
        user: booking.customer._id, // Changed from booking.user to booking.customer
        car: booking.car._id,
        rating,
        comment: generateReviewComment(rating, booking.car.name),
        createdAt: reviewDate
      };
      
      reviewsData.push(review);
    }

    // If we don't have enough reviews from completed bookings, create additional ones
    if (reviewsData.length < 15) {
      const users = await User.find({ role: 'user' });
      const cars = await Car.find();
      
      const additionalReviews = 25 - reviewsData.length;
      
      for (let i = 0; i < additionalReviews; i++) {
        // Select random user and car
        const user = users[Math.floor(Math.random() * users.length)];
        const car = cars[Math.floor(Math.random() * cars.length)];
        
        // Skip if this user-car combination already exists
        const userCarKey = `${user._id}-${car._id}`;
        if (userCarCombinations.has(userCarKey)) {
          // Try again with a different combination
          i--;
          continue;
        }
        
        // Add this combination to our tracking set
        userCarCombinations.add(userCarKey);
        
        // Generate random rating (weighted towards positive)
        const ratingDistribution = [1, 2, 3, 4, 4, 5, 5, 5, 5, 5];
        const rating = ratingDistribution[Math.floor(Math.random() * ratingDistribution.length)];
        
        // Random date within the past 3 months
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 90));
        
        // Create review object without booking reference
        const review = {
          user: user._id,
          car: car._id,
          rating,
          comment: generateReviewComment(rating, car.name),
          createdAt: reviewDate
        };
        
        reviewsData.push(review);
      }
    }

    // Insert reviews into the database
    if (reviewsData.length > 0) {
      const createdReviews = await Review.insertMany(reviewsData);
      console.log(`${createdReviews.length} reviews seeded successfully`);
      
      // Update car rating and review count
      await updateCarRatings();
      
      return createdReviews;
    } else {
      console.log('No reviews created');
      return [];
    }
  } catch (error) {
    console.error('Error seeding reviews:', error);
    throw error;
  }
};

/**
 * Update each car's rating and review count based on reviews
 */
async function updateCarRatings() {
  try {
    // Get all cars
    const cars = await Car.find();
    
    let updatedCount = 0;
    for (const car of cars) {
      // Get all reviews for this car
      const reviews = await Review.find({ car: car._id });
      
      if (reviews.length > 0) {
        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        // Update car
        await Car.updateOne(
          { _id: car._id },
          { 
            rating: parseFloat(averageRating.toFixed(1)),
            reviewCount: reviews.length
          }
        );
        updatedCount++;
      }
    }
    
    console.log(`${updatedCount} car ratings updated successfully`);
  } catch (error) {
    console.error('Error updating car ratings:', error);
  }
}

/**
 * Generate review comment based on rating and car name
 */
function generateReviewComment(rating, carName) {
  const comments = {
    1: [
      `Very disappointing experience with the ${carName}.`,
      `Would not recommend the ${carName} to anyone.`,
      `Many issues with the ${carName}, customer service was unhelpful.`,
      `The ${carName} broke down during my trip, ruined my vacation.`,
      `Terrible condition, the ${carName} needs maintenance.`
    ],
    2: [
      `The ${carName} was below my expectations.`,
      `Some problems with the ${carName} during rental period.`,
      `The ${carName} was not as advertised, somewhat disappointed.`,
      `Customer service could be better for the ${carName} rental.`,
      `The ${carName} was clean but had mechanical issues.`
    ],
    3: [
      `The ${carName} was okay for the price.`,
      `Average experience with the ${carName}.`,
      `The ${carName} did the job, nothing special.`,
      `Decent car, but the ${carName} could use some updates.`,
      `The ${carName} was reliable but nothing extraordinary.`
    ],
    4: [
      `Good experience with the ${carName}, would rent again.`,
      `The ${carName} was clean and performed well.`,
      `Very satisfied with the ${carName}, minor issues only.`,
      `The ${carName} was perfect for my trip, fuel efficient too.`,
      `Great service and the ${carName} was in excellent condition.`
    ],
    5: [
      `Excellent experience with the ${carName}! Absolutely perfect!`,
      `The ${carName} exceeded all my expectations. Will definitely rent again!`,
      `Luxury and comfort with the ${carName}, best rental experience ever.`,
      `The ${carName} made my trip unforgettable. Flawless performance!`,
      `Outstanding service and the ${carName} was immaculate. Highly recommend!`
    ]
  };
  
  const ratingComments = comments[rating] || comments[3];
  return ratingComments[Math.floor(Math.random() * ratingComments.length)];
}

module.exports = seedReviews; 