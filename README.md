# Car Rental Application

A full-stack car rental application with admin dashboard and client interface built with Next.js, Express, and MongoDB.

## Project Structure

```
car-rental/
├── backend/                     # Express.js API backend
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # API controllers
│   │   ├── middlewares/         # Express middleware
│   │   ├── models/              # Mongoose models
│   │   ├── public/              # Static assets
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic services
│   │   ├── utils/               # Utility functions
│   │   ├── seed-data.js         # Sample data for database seeding
│   │   ├── seed-data-runner.js  # Script to run database seeding
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Server entry point
│   ├── .env                     # Environment variables
│   └── package.json             # Backend dependencies
│
├── frontend-admin/              # Next.js admin dashboard
│   ├── src/
│   │   ├── app/                 # Next.js app router pages
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utility functions and API
│   │   └── public/              # Static assets
│   └── package.json             # Frontend dependencies
│
└── frontend-client/             # Next.js client website
    ├── src/
    │   ├── app/                 # Next.js app router pages 
    │   ├── components/          # React components
    │   └── lib/                 # Utility functions and API
    ├── public/                  # Static assets
    └── package.json             # Frontend dependencies
```

## Getting Started

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables (copy from .env.example and modify as needed)
cp .env.example .env

# Seed the database with initial data
npm run seed

# Run in development mode
npm run dev

# Run in production mode
npm start
```

### Admin Dashboard Setup

```bash
# Navigate to admin dashboard directory
cd frontend-admin

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### Client Website Setup

```bash
# Navigate to client website directory
cd frontend-client

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Features

### Admin Dashboard
- User management (customers, staff, admins)
- Car inventory management
- Booking management and status updates
- Analytics and reporting
- Notifications system

### Client Website
- Car browsing and filtering
- Booking system
- User registration and profile management
- Reviews and ratings
- Responsive design for all devices

## API Routes

- `/api/auth` - Authentication (login, register, reset password)
- `/api/users` - User management (CRUD operations)
- `/api/cars` - Car management (CRUD operations)
- `/api/bookings` - Booking management
- `/api/categories` - Car categories management
- `/api/website` - Website content management
- `/api/dashboard` - Admin dashboard statistics
- `/api/upload` - File upload functionality
- `/api/notifications` - User notifications
- `/api/statistics` - Detailed statistics for analytics

## Database Seeding

The project includes a comprehensive data seeding system to populate the database with sample data for testing and development:

```bash
# Run the seeding script
npm run seed
```

The seed data includes:
- User accounts (admin, staff, regular users)
- Car categories
- Car listings with details and images
- Sample bookings
- Reviews and ratings
- Website settings
- Statistics for the dashboard
- Notifications

## Default Admin User

After running the seed script, you can log in with the following credentials:

- Email: admin@carental.com
- Password: Admin123!

## License

This project is licensed under the MIT License. 