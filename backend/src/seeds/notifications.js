const mongoose = require('mongoose');
const { User, Notification } = require('../models');

// Create sample data for notifications
const seedNotifications = async () => {
  try {
    // Check if notifications already exist in the database
    const count = await Notification.countDocuments();
    if (count > 0) {
      console.log('Notifications already seeded');
      return;
    }

    // Get all admin users to create notifications for them
    const adminUsers = await User.find({ role: 'admin' });
    
    if (adminUsers.length === 0) {
      console.log('No admin users found. Cannot seed notifications');
      return;
    }

    // List of notification types
    const types = [
      'booking_new',
      'booking_canceled',
      'booking_completed',
      'review_new',
      'message_new',
      'payment_received',
      'system'
    ];

    // Create notifications for each admin
    const notificationsToCreate = [];

    for (const user of adminUsers) {
      // Create about 15-20 notifications for each user
      const notificationCount = Math.floor(Math.random() * 6) + 15;
      
      for (let i = 0; i < notificationCount; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const read = Math.random() > 0.3; // 30% unread, 70% read
        // Create random dates within the last 7 days
        const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
        
        let title, message;
        
        switch (type) {
          case 'booking_new':
            title = 'New booking request';
            message = `Customer ${getRandomName()} has requested to book ${getRandomCar()}.`;
            break;
          case 'booking_canceled':
            title = 'Booking canceled';
            message = `Customer ${getRandomName()} has canceled the booking for ${getRandomCar()}.`;
            break;
          case 'booking_completed':
            title = 'Booking completed';
            message = `The booking for ${getRandomCar()} by customer ${getRandomName()} has been completed.`;
            break;
          case 'review_new':
            title = 'New review';
            message = `A new ${Math.floor(Math.random() * 3) + 3} star review has been submitted for ${getRandomCar()}.`;
            break;
          case 'message_new':
            title = 'New message';
            message = `You have a new message from customer ${getRandomName()}.`;
            break;
          case 'payment_received':
            title = 'Payment successful';
            message = `Payment of ${Math.floor(Math.random() * 300) + 100}$ received from customer ${getRandomName()}.`;
            break;
          default:
            title = 'System notification';
            message = 'Welcome to the car rental management system.';
        }
        
        notificationsToCreate.push({
          title,
          message,
          type,
          read,
          user: user._id,
          createdAt
        });
      }
    }

    // Create notifications in the database
    await Notification.insertMany(notificationsToCreate);
    
    console.log(`${notificationsToCreate.length} notifications seeded successfully`);
  } catch (error) {
    console.error('Error seeding notifications:', error);
  }
};

// Function to generate random customer names
function getRandomName() {
  const names = [
    'John Doe',
    'Jane Smith',
    'Michael Johnson',
    'Emily Williams',
    'David Brown',
    'Sarah Davis',
    'Robert Miller',
    'Jessica Wilson',
    'Thomas Moore',
    'Jennifer Taylor'
  ];
  
  return names[Math.floor(Math.random() * names.length)];
}

// Function to generate random car names
function getRandomCar() {
  const cars = [
    'Toyota Camry',
    'Honda Civic',
    'Tesla Model 3',
    'BMW X5',
    'Mercedes-Benz C-Class',
    'Audi A4',
    'Ford Mustang',
    'Chevrolet Corvette',
    'Nissan Altima',
    'Hyundai Sonata'
  ];
  
  return cars[Math.floor(Math.random() * cars.length)];
}

module.exports = seedNotifications; 