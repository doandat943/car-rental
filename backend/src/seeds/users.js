const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * Seeds the database with initial user accounts
 * This includes admin, staff, and regular users with properly hashed passwords
 */
const seedUsers = async () => {
  try {
    // Check if users already exist in the database
    const count = await User.countDocuments();
    if (count > 0) {
      console.log('Users already seeded');
      return;
    }

    // Sample user data with varied roles and attributes
    const usersData = [
      {
        name: 'Admin User',
        email: 'admin@carental.com',
        phone: '+1 (555) 123-4567',
        password: 'Admin123!',
        role: 'admin',
        status: 'active',
        address: '1234 Admin Street, San Francisco, CA 94107'
      },
      {
        name: 'Staff Member',
        email: 'staff@carental.com',
        phone: '+1 (555) 234-5678',
        password: 'Staff123!',
        role: 'staff',
        status: 'active',
        address: '5678 Helper Avenue, San Francisco, CA 94107'
      },
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 765-4321',
        password: 'User123!',
        role: 'user',
        status: 'active',
        address: '9876 Customer Road, San Francisco, CA 94107'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 987-6543',
        password: 'User123!',
        role: 'user',
        status: 'active',
        address: '5432 Traveler Lane, Oakland, CA 94612'
      },
      {
        name: 'Robert Johnson',
        email: 'robert.johnson@example.com',
        phone: '+1 (555) 345-6789',
        password: 'User123!',
        role: 'user',
        status: 'active',
        address: '3456 Driver Street, Palo Alto, CA 94301'
      },
      {
        name: 'Emily Williams',
        email: 'emily.williams@example.com',
        phone: '+1 (555) 567-8901',
        password: 'User123!',
        role: 'user',
        status: 'active',
        address: '7890 Renter Avenue, San Jose, CA 95113'
      },
      {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '+1 (555) 678-9012',
        password: 'User123!',
        role: 'user',
        status: 'inactive',
        address: '8901 Inactive Lane, Fremont, CA 94538'
      }
    ];

    // Hash the passwords before inserting
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000), // Random date within past 6 months
        };
      })
    );

    // Insert the users into the database
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    
    console.log(`${createdUsers.length} users seeded successfully`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

module.exports = seedUsers; 