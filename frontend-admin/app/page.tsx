"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DashboardStats from "./dashboard/DashboardStats";
import RecentBookingsTable from "./dashboard/RecentBookingsTable";
import CarAvailabilityTable from "./dashboard/CarAvailabilityTable";

const CarRentalDashboard = () => {
  // Mock data for dashboard stats
  const dashboardStats = {
    totalBookings: 235,
    totalRevenue: 28650,
    totalUsers: 85,
    totalCars: 42,
    bookingTrend: [28, 32, 36, 42, 48, 62, 50, 48, 40, 35, 35, 40],
    revenueTrend: [3200, 3800, 4200, 4800, 5400, 7200, 6100, 5800, 4900, 4300, 4300, 4950],
  };

  // Mock data for recent bookings
  const recentBookings = [
    {
      id: 1,
      bookingNumber: "BK-2023-0001",
      customer: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        avatar: "/images/user/user-01.png",
      },
      car: {
        id: 1,
        name: "Toyota Camry",
        brand: "Toyota",
        model: "Camry",
      },
      startDate: "2023-06-15",
      endDate: "2023-06-20",
      totalAmount: 275,
      status: "completed",
      createdAt: "2023-06-10",
    },
    {
      id: 2,
      bookingNumber: "BK-2023-0002",
      customer: {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 987 654 321",
        avatar: "/images/user/user-02.png",
      },
      car: {
        id: 2,
        name: "Honda Civic",
        brand: "Honda",
        model: "Civic",
      },
      startDate: "2023-07-01",
      endDate: "2023-07-05",
      totalAmount: 180,
      status: "active",
      createdAt: "2023-06-25",
    },
    {
      id: 3,
      bookingNumber: "BK-2023-0003",
      customer: {
        id: 3,
        name: "Michael Johnson",
        email: "michael.j@example.com",
        phone: "+1 555 123 456",
        avatar: "/images/user/user-03.png",
      },
      car: {
        id: 3,
        name: "Ford Mustang",
        brand: "Ford",
        model: "Mustang",
      },
      startDate: "2023-07-10",
      endDate: "2023-07-15",
      totalAmount: 375,
      status: "pending",
      createdAt: "2023-07-05",
    },
    {
      id: 4,
      bookingNumber: "BK-2023-0004",
      customer: {
        id: 4,
        name: "Emily Wilson",
        email: "emily.w@example.com",
        phone: "+1 333 444 5555",
        avatar: "/images/user/user-04.png",
      },
      car: {
        id: 4,
        name: "BMW X5",
        brand: "BMW",
        model: "X5",
      },
      startDate: "2023-08-01",
      endDate: "2023-08-07",
      totalAmount: 570,
      status: "cancelled",
      createdAt: "2023-07-20",
    },
    {
      id: 5,
      bookingNumber: "BK-2023-0005",
      customer: {
        id: 5,
        name: "Alex Taylor",
        email: "alex.t@example.com",
        phone: "+1 777 888 9999",
        avatar: "/images/user/user-05.png",
      },
      car: {
        id: 5,
        name: "Tesla Model 3",
        brand: "Tesla",
        model: "Model 3",
      },
      startDate: "2023-08-10",
      endDate: "2023-08-15",
      totalAmount: 425,
      status: "pending",
      createdAt: "2023-08-05",
    },
  ];

  // Mock data for car availability
  const carsAvailability = [
    {
      id: 1,
      name: "Toyota Camry",
      brand: "Toyota",
      model: "Camry",
      year: 2022,
      category: "Sedan",
      dailyPrice: 55,
      status: "available",
      image: "/images/cars/toyota-camry.png",
    },
    {
      id: 2,
      name: "Honda Civic",
      brand: "Honda",
      model: "Civic",
      year: 2023,
      category: "Sedan",
      dailyPrice: 45,
      status: "available",
      image: "/images/cars/honda-civic.png",
    },
    {
      id: 3,
      name: "Ford Mustang",
      brand: "Ford",
      model: "Mustang",
      year: 2022,
      category: "Sports",
      dailyPrice: 75,
      status: "maintenance",
      image: "/images/cars/ford-mustang.png",
    },
    {
      id: 4,
      name: "BMW X5",
      brand: "BMW",
      model: "X5",
      year: 2023,
      category: "SUV",
      dailyPrice: 95,
      status: "available",
      image: "/images/cars/bmw-x5.png",
    },
    {
      id: 5,
      name: "Tesla Model 3",
      brand: "Tesla",
      model: "Model 3",
      year: 2023,
      category: "Electric",
      dailyPrice: 85,
      status: "booked",
      image: "/images/cars/tesla-model3.png",
    },
  ];

  return (
    <>
      <Breadcrumb pageName="Dashboard" />

      <DashboardStats
        totalBookings={dashboardStats.totalBookings}
        totalRevenue={dashboardStats.totalRevenue}
        totalUsers={dashboardStats.totalUsers}
        totalCars={dashboardStats.totalCars}
        bookingTrend={dashboardStats.bookingTrend}
        revenueTrend={dashboardStats.revenueTrend}
      />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <RecentBookingsTable bookings={recentBookings} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <CarAvailabilityTable cars={carsAvailability} />
        </div>
      </div>
    </>
  );
};

export default CarRentalDashboard; 