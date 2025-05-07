# Car Rental Application

A complete car rental service platform with backend API, admin portal, and client-facing website.

## Project Structure

```
car-rental/
├── backend/          # Express + MongoDB API
├── frontend-admin/   # Admin portal (Next.js with Materio template)
└── frontend-client/  # Client website (Next.js)
```

## Technologies Used

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

### Frontend Admin
- Next.js App Router
- Material UI + Tailwind CSS
- Materio Admin Template
- DataGrid for tables

### Frontend Client
- Next.js App Router
- Tailwind CSS
- Responsive design

## Features

- User registration and authentication
- Car listing and filtering
- Car booking system with availability calendar
- Admin dashboard with analytics
- Booking management system
- User and role management

## Getting Started

### Prerequisites
- Node.js (LTS version)
- MongoDB
- npm or pnpm

### Backend Setup
```bash
cd backend
npm install
# Create .env file with your configuration or use the default
npm run dev
```

### Admin Portal Setup
```bash
cd frontend-admin
npm install
# Create .env.local file with your configuration or use the default
npm run dev
# Admin runs on http://localhost:3001
```

### Client Website Setup
```bash
cd frontend-client
npm install
# Create .env.local file with your configuration or use the default
npm run dev
# Client runs on http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create new car (admin)
- `PUT /api/cars/:id` - Update car (admin)
- `DELETE /api/cars/:id` - Delete car (admin)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking (admin)

## Admin Portal Access

The admin portal includes dedicated pages for:
- Dashboard with analytics
- Cars management
- Bookings management
- Users management

## License

This project is licensed under the MIT License. 