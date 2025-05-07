# Car Rental Application

A full-stack car rental application with admin dashboard and client interface built with Next.js, Express, and MongoDB.

## Project Structure

```
car-rental/
├── backend/             # Express.js API backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # API controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Mongoose models
│   │   ├── public/      # Static assets
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Utility functions
│   │   ├── app.js       # Express app setup
│   │   └── server.js    # Server entry point
│   ├── .env             # Environment variables
│   └── package.json     # Backend dependencies
│
├── frontend-admin/      # Next.js admin dashboard
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
│
└── frontend-client/     # Next.js client website
    ├── src/
    │   ├── app/         # Next.js app router pages
    │   ├── components/  # React components
    │   └── lib/         # Utility functions
    ├── public/          # Static assets
    └── package.json     # Frontend dependencies
```

## Environment Setup

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
NODE_ENV=development
PORT=5000
# Development database
# MONGO_URI=mongodb://localhost:27017/car-rental
# Production database
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
UPLOAD_PATH=./src/public/uploads
```

## Getting Started

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

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

## API Routes

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/cars` - Car management
- `/api/bookings` - Booking management
- `/api/categories` - Car categories
- `/api/website` - Website content
- `/api/dashboard` - Admin dashboard statistics
- `/api/upload` - File upload

## Important Notes

1. Make sure MongoDB is running before starting the backend server.
2. Use a proper JWT secret in production.
3. Set up appropriate CORS settings in production.
4. Change default admin credentials after first run.

## Default Admin User

- Email: admin@carental.com
- Password: Admin123!

## License

This project is licensed under the MIT License. 