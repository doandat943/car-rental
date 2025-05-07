"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DashboardStats from "./dashboard/DashboardStats";
import RecentBookingsTable from "./dashboard/RecentBookingsTable";
import CarAvailabilityTable from "./dashboard/CarAvailabilityTable";
import { dashboardAPI, bookingsAPI, carsAPI } from "@/lib/api";

const CarRentalDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalCars: 0,
    bookingTrend: Array(12).fill(0),
    revenueTrend: Array(12).fill(0),
  });
  
  // State for bookings and cars
  const [recentBookings, setRecentBookings] = useState([]);
  const [carsAvailability, setCarsAvailability] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await dashboardAPI.getStats();
        const stats = statsResponse.data.data;
        
        // Fetch recent bookings
        const bookingsResponse = await bookingsAPI.getAllBookings({ limit: 5 });
        
        // Fetch cars for availability table
        const carsResponse = await carsAPI.getAllCars({ limit: 5 });
        
        // Update state with fetched data
        setDashboardStats({
          totalBookings: stats.totalBookings,
          totalRevenue: stats.totalRevenue,
          totalUsers: stats.totalUsers,
          totalCars: stats.totalCars,
          bookingTrend: stats.bookingTrend,
          revenueTrend: stats.revenueTrend,
        });
        
        setRecentBookings(bookingsResponse.data.data || []);
        setCarsAvailability(carsResponse.data.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
        
        // Use mock data in case of error
        setDashboardStats({
          totalBookings: 235,
          totalRevenue: 28650,
          totalUsers: 85,
          totalCars: 42,
          bookingTrend: [28, 32, 36, 42, 48, 62, 50, 48, 40, 35, 35, 40],
          revenueTrend: [3200, 3800, 4200, 4800, 5400, 7200, 6100, 5800, 4900, 4300, 4300, 4950],
        });
        
        // Mock data for bookings
        setRecentBookings([
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
        ]);
        
        // Mock data for cars availability
        setCarsAvailability([
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
        ]);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-3 text-xl font-semibold text-black dark:text-white">Error</h2>
          <p className="text-danger">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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