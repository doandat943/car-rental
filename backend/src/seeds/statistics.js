const mongoose = require('mongoose');
const { Statistic, Booking, User, Car } = require('../models');

/**
 * Seeds the database with initial statistics data
 * This module generates realistic statistics for the dashboard
 */
const seedStatistics = async () => {
  try {
    
    // Get counts from other collections for realistic statistics
    const userCount = await User.countDocuments();
    const carCount = await Car.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    // Prepare statistics data
    const statisticsData = [
      {
        key: 'total_users',
        value: userCount,
        type: 'number',
        category: 'users',
        description: 'Total number of registered users'
      },
      {
        key: 'active_users',
        value: Math.floor(userCount * 0.85), // Assume 85% of users are active
        type: 'number',
        category: 'users',
        description: 'Total number of active users'
      },
      {
        key: 'new_users_last_month',
        value: Math.floor(userCount * 0.15), // Assume 15% are new in the last month
        type: 'number',
        category: 'users',
        description: 'New users registered in the last month'
      },
      {
        key: 'total_bookings',
        value: bookingCount,
        type: 'number',
        category: 'bookings',
        description: 'Total number of bookings'
      },
      {
        key: 'active_bookings',
        value: Math.floor(bookingCount * 0.2), // Assume 20% are currently active
        type: 'number',
        category: 'bookings',
        description: 'Currently active bookings'
      },
      {
        key: 'bookings_last_month',
        value: Math.floor(bookingCount * 0.3), // Assume 30% were created in the last month
        type: 'number',
        category: 'bookings',
        description: 'Bookings created in the last month'
      },
      {
        key: 'completed_bookings',
        value: Math.floor(bookingCount * 0.5), // Assume 50% are completed
        type: 'number',
        category: 'bookings',
        description: 'Total number of completed bookings'
      },
      {
        key: 'canceled_bookings',
        value: Math.floor(bookingCount * 0.1), // Assume 10% are canceled
        type: 'number',
        category: 'bookings',
        description: 'Total number of canceled bookings'
      },
      {
        key: 'total_cars',
        value: carCount,
        type: 'number',
        category: 'cars',
        description: 'Total number of cars in the system'
      },
      {
        key: 'available_cars',
        value: Math.floor(carCount * 0.75), // Assume 75% are currently available
        type: 'number',
        category: 'cars',
        description: 'Cars available for booking'
      },
      {
        key: 'maintenance_cars',
        value: Math.floor(carCount * 0.05), // Assume 5% are in maintenance
        type: 'number',
        category: 'cars',
        description: 'Cars currently in maintenance'
      },
      {
        key: 'most_booked_category',
        value: 'SUV', // Example value
        type: 'string',
        category: 'cars',
        description: 'Most frequently booked car category'
      },
      {
        key: 'total_revenue',
        value: (bookingCount * 150).toString(), // Assume average $150 per booking
        type: 'number',
        category: 'revenue',
        description: 'Total revenue from all bookings'
      },
      {
        key: 'revenue_last_month',
        value: (Math.floor(bookingCount * 0.3) * 150).toString(), // Based on bookings from last month
        type: 'number',
        category: 'revenue',
        description: 'Revenue from the last month'
      },
      {
        key: 'average_booking_value',
        value: '150', // Example value
        type: 'number',
        category: 'revenue',
        description: 'Average value of bookings'
      },
      {
        key: 'revenue_growth',
        value: '12.5', // Example value (percentage)
        type: 'number',
        category: 'revenue',
        description: 'Revenue growth compared to previous month (%)'
      }
    ];

    // Add monthly booking statistics for the past 12 months
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    for (let i = 0; i < 12; i++) {
      // Calculate month and year for this data point (going backward)
      const month = (currentMonth - i + 12) % 12;
      const year = currentYear - Math.floor((i - currentMonth) / 12);
      
      // Month names
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      // Generate a somewhat realistic booking count
      // Use a sine wave to simulate seasonal variation with some randomness
      const baseCount = Math.floor(bookingCount / 12); // Average monthly bookings
      const seasonalFactor = Math.sin((month / 12) * Math.PI * 2) * 0.3; // Seasonal variation ±30%
      const randomFactor = (Math.random() * 0.2) - 0.1; // Random variation ±10%
      
      const monthlyBookings = Math.max(
        1,
        Math.floor(baseCount * (1 + seasonalFactor + randomFactor))
      );
      
      // Add monthly stats
      statisticsData.push({
        key: `bookings_${year}_${month + 1}`,
        value: monthlyBookings.toString(),
        type: 'number',
        category: 'monthly_bookings',
        description: `Bookings for ${monthNames[month]} ${year}`
      });
      
      // Add monthly revenue based on bookings
      statisticsData.push({
        key: `revenue_${year}_${month + 1}`,
        value: (monthlyBookings * 150).toString(), // Assume average $150 per booking
        type: 'number',
        category: 'monthly_revenue',
        description: `Revenue for ${monthNames[month]} ${year}`
      });
    }

    // Insert statistics into the database
    const createdStatistics = await Statistic.insertMany(statisticsData);
    
    console.log(`${createdStatistics.length} statistics seeded successfully`);
    return createdStatistics;
  } catch (error) {
    console.error('Error seeding statistics:', error);
    throw error;
  }
};

module.exports = seedStatistics; 