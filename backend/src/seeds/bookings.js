const mongoose = require('mongoose');
const { Booking, User, Car } = require('../models');

/**
 * Seeds the database with initial booking data
 * Creates a variety of bookings with different statuses, dates, and durations
 */
const seedBookings = async () => {
  try {
    // Get users and cars to create bookings
    const users = await User.find({ role: 'user' });
    const cars = await Car.find();

    if (users.length === 0 || cars.length === 0) {
      console.log('No users or cars found. Cannot seed bookings');
      return;
    }

    // Possible booking statuses (from the Booking model)
    const statuses = ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'];
    
    // Create sample bookings
    const bookingsData = [];

    // Create 30-40 bookings with different statuses and dates
    const bookingCount = Math.floor(Math.random() * 11) + 30;

    for (let i = 0; i < bookingCount; i++) {
      // Select random user and car
      const user = users[Math.floor(Math.random() * users.length)];
      const car = cars[Math.floor(Math.random() * cars.length)];
      
      // Generate random dates for the booking
      const now = new Date();
      const startOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days from now
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() + startOffset);
      
      // Random duration between 1 and 14 days
      const duration = Math.floor(Math.random() * 14) + 1;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration);
      
      // Set booking status based on dates
      let status;
      if (startDate > now) {
        // Future booking
        status = Math.random() > 0.3 ? 'confirmed' : 'pending';
      } else if (endDate < now) {
        // Past booking
        status = Math.random() > 0.2 ? 'completed' : 'cancelled'; // Note: cancelled with double 'l'
      } else {
        // Current booking
        status = 'ongoing'; // Changed from 'active' to 'ongoing'
      }
      
      // Calculate total amount based on duration and car daily price
      const totalAmount = car.price * duration;
      
      // Random payment status
      const paymentStatus = status === 'completed' ? 'paid' : (Math.random() > 0.5 ? 'paid' : 'pending');
      
      // Random premium services (30% chance for each)
      const includeDriver = Math.random() > 0.7;
      const doorstepDelivery = Math.random() > 0.7;
      
      // Calculate fees for premium services
      const driverFee = includeDriver ? 30 * duration : 0;
      const deliveryFee = doorstepDelivery ? 25 : 0;
      
      // Calculate final total amount with premium services
      const finalTotalAmount = totalAmount + driverFee + deliveryFee;
      
      // Create booking object
      const booking = {
        customer: user._id, // Changed from user to customer
        car: car._id,
        startDate,
        endDate,
        status,
        totalAmount: finalTotalAmount, // Updated to include premium service fees
        paymentStatus, // Changed from isPaid to paymentStatus
        pickupLocation: 'Main Office, San Francisco',
        dropoffLocation: 'Main Office, San Francisco',
        totalDays: duration, // Add required totalDays field
        includeDriver,
        doorstepDelivery,
        driverFee,
        deliveryFee,
        // Ensure createdAt is always in the past (not in the future)
        createdAt: new Date(Math.min(
          Date.now(), // Current date/time
          startDate.getTime() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000) // 1-15 days before start date
        ))
      };
      
      bookingsData.push(booking);

      // Update car status if booking is ongoing
      if (status === 'ongoing') {
        await Car.findByIdAndUpdate(car._id, { status: 'rented' });
      } else if (status === 'confirmed') {
        await Car.findByIdAndUpdate(car._id, { status: 'reserved' });
      }
    }

    // Insert bookings into the database
    const createdBookings = await Booking.insertMany(bookingsData);
    
    // Find the earliest and latest createdAt dates for reporting
    let earliestDate = new Date();
    let latestDate = new Date(0); // Jan 1, 1970
    
    createdBookings.forEach(booking => {
      if (booking.createdAt < earliestDate) earliestDate = booking.createdAt;
      if (booking.createdAt > latestDate) latestDate = booking.createdAt;
    });
    
    // Format dates for better readability
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    console.log(`${createdBookings.length} bookings seeded successfully`);
    return createdBookings;
  } catch (error) {
    console.error('Error seeding bookings:', error);
    throw error;
  }
};

/**
 * Generate random payment method
 */
function getRandomPaymentMethod() {
  const methods = ['credit_card', 'paypal', 'cash', 'bank_transfer'];
  return methods[Math.floor(Math.random() * methods.length)];
}

/**
 * Generate random booking note based on status
 */
function getRandomNote(status) {
  const notes = {
    pending: [
      'Awaiting confirmation',
      'Customer requested special arrangements',
      'First-time customer',
      'Waiting for payment verification',
      ''
    ],
    confirmed: [
      'All documents verified',
      'Customer will pick up at branch office',
      'Repeat customer',
      'Staff will deliver the car',
      ''
    ],
    active: [
      'Car delivered in perfect condition',
      'Customer requested extension possibility',
      'All documents signed and verified',
      'Insurance coverage confirmed',
      ''
    ],
    completed: [
      'Car returned in good condition',
      'Minor scratch on right door',
      'Fuel tank not completely full',
      'Customer very satisfied',
      'Will need maintenance check',
      ''
    ],
    canceled: [
      'Customer requested cancellation',
      'Payment failed',
      'Customer did not show up',
      'Car unavailable due to maintenance',
      'Canceled due to weather conditions',
      ''
    ]
  };

  const statusNotes = notes[status] || [''];
  return statusNotes[Math.floor(Math.random() * statusNotes.length)];
}

module.exports = seedBookings; 