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

    // List of notification types (matching enum values in the model)
    const types = [
      'booking',
      'system', 
      'user',
      'payment'
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
        
        let title, content;
        
        switch (type) {
          case 'booking':
            // Randomly choose a booking-related scenario
            const bookingScenario = Math.floor(Math.random() * 3);
            if (bookingScenario === 0) {
              title = 'New booking request';
              content = `Customer ${getRandomName()} has requested to book ${getRandomCar()}.`;
            } else if (bookingScenario === 1) {
              title = 'Booking canceled';
              content = `Customer ${getRandomName()} has canceled the booking for ${getRandomCar()}.`;
            } else {
              title = 'Booking completed';
              content = `The booking for ${getRandomCar()} by customer ${getRandomName()} has been completed.`;
            }
            break;
          case 'user':
            // User related notifications
            title = 'New review';
            content = `A new ${Math.floor(Math.random() * 3) + 3} star review has been submitted for ${getRandomCar()}.`;
            break;
          case 'payment':
            title = 'Payment successful';
            content = `Payment of ${Math.floor(Math.random() * 300) + 100}$ received from customer ${getRandomName()}.`;
            break;
          default: // system
            title = 'System notification';
            content = 'Welcome to the car rental management system.';
        }
        
        notificationsToCreate.push({
          title,
          content,
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
    throw error;
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