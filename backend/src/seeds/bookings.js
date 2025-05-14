const mongoose = require('mongoose');
const { Booking, User, Car } = require('../models');

/**
 * Seeds the database with initial booking data
 * Creates a variety of bookings with different statuses, dates, and durations
 */
const seedBookings = async () => {
  try {
    // Check if bookings already exist in the database
    const count = await Booking.countDocuments();
    if (count > 0) {
      console.log('Bookings already seeded');
      return;
    }

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
      const totalAmount = car.price.daily * duration;
      
      // Random payment status
      const paymentStatus = status === 'completed' ? 'paid' : (Math.random() > 0.5 ? 'paid' : 'pending');
      
      // Create booking object
      const booking = {
        customer: user._id, // Changed from user to customer
        car: car._id,
        startDate,
        endDate,
        status,
        totalAmount, // Changed from totalPrice to totalAmount
        paymentStatus, // Changed from isPaid to paymentStatus
        pickupLocation: 'Main Office, San Francisco',
        dropoffLocation: 'Main Office, San Francisco',
        createdAt: new Date(startDate.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // 1-7 days before start date
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