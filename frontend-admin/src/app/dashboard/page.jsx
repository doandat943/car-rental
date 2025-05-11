"use client";

import { useState, useEffect } from 'react';
import { Users, Car, Calendar, DollarSign, TrendingUp, Package, BarChart3, PieChart } from 'lucide-react';
import dynamic from 'next/dynamic';
import StatCard from '../../components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { dashboardAPI, bookingsAPI, carsAPI } from '../../lib/api';

// Dynamic import of RevenueChart to avoid SSR errors
const RevenueChart = dynamic(() => import('../../components/dashboard/RevenueChart'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
      <div className="flex flex-col items-center text-center">
        <BarChart3 className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading chart...
        </p>
      </div>
    </div>
  )
});

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [periodFilter, setPeriodFilter] = useState('month');

  useEffect(() => {
    // Function to load dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Call API to get statistics
        const statsResponse = await dashboardAPI.getStats().catch(err => {
          console.error("Error fetching stats:", err);
          return { data: { 
            totalUsers: 0, 
            totalCars: 0, 
            totalBookings: 0, 
            totalRevenue: 0,
            bookingTrend: Array(9).fill(0),
            revenueTrend: Array(9).fill(0)
          }};
        });
        
        // Call API to get recent bookings
        const bookingsResponse = await bookingsAPI.getAllBookings({ 
          limit: 5, 
          page: 1,
          sort: '-createdAt' 
        }).catch(err => {
          console.error("Error fetching bookings:", err);
          return { data: { data: [] }};
        });
        
        // Call API to get top booked cars
        const topCarsResponse = await dashboardAPI.getTopCars(5).catch(err => {
          console.error("Error fetching top cars:", err);
          return { data: { data: [] }};
        });
        
        // Call API to get revenue chart data
        const revenueChartResponse = await dashboardAPI.getRevenueChart('month').catch(err => {
          console.error("Error fetching revenue chart:", err);
          return { data: { data: [] }};
        });
        
        // Update state with data from API
        const statsData = statsResponse.data.data || statsResponse.data;
        
        // Create stats display array
        const statsCards = [
          {
            title: 'Total Customers',
            value: statsData.totalUsers.toLocaleString(),
            icon: <Users className="h-5 w-5 text-blue-500" />,
            percentageChange: statsData.userGrowth || 0,
            trend: 'vs last month',
            trendData: statsData.userTrend || Array(9).fill(0),
            color: 'blue',
          },
          {
            title: 'Available Cars',
            value: statsData.totalCars.toLocaleString(),
            icon: <Car className="h-5 w-5 text-green-500" />,
            percentageChange: statsData.carGrowth || 0,
            trend: 'vs last month',
            trendData: statsData.carTrend || Array(9).fill(0),
            color: 'green',
          },
          {
            title: 'Bookings',
            value: statsData.totalBookings.toLocaleString(),
            icon: <Calendar className="h-5 w-5 text-yellow-500" />,
            percentageChange: statsData.bookingGrowth || 0,
            trend: 'vs last month',
            trendData: statsData.bookingTrend || Array(9).fill(0),
            color: 'yellow',
          },
          {
            title: 'Revenue',
            value: `$${statsData.totalRevenue.toLocaleString()}`,
            icon: <DollarSign className="h-5 w-5 text-red-500" />,
            percentageChange: statsData.revenueGrowth || 0,
            trend: 'vs last month',
            trendData: statsData.revenueTrend || Array(9).fill(0),
            color: 'red',
          },
        ];
        
        setStats(statsCards);
        
        // Format booking data
        const formattedBookings = (bookingsResponse.data.data || []).map(booking => ({
          id: booking._id,
          customer: booking.user?.name || 'Customer',
          car: booking.car?.name || 'Unknown car',
          status: booking.status,
          date: new Date(booking.startDate).toLocaleDateString(),
          amount: `$${booking.totalAmount.toLocaleString()}`,
        }));
        
        setRecentBookings(formattedBookings);
        
        // Format top cars data
        const formattedTopCars = (topCarsResponse.data.data || []).map(car => ({
          id: car._id,
          name: car.name,
          bookings: car.bookingsCount,
          revenue: `$${car.totalRevenue.toLocaleString()}`,
          rating: car.averageRating || 0,
        }));
        
        setTopCars(formattedTopCars);
        
        // Add chart data to state
        setRevenueData(revenueChartResponse.data.data || []);
        
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Unable to load dashboard data. Please try again later.");
        setLoading(false);
        
        // Set sample data in case of error
        setStats([
          {
            title: 'Total Customers',
            value: '2,856',
            icon: <Users className="h-5 w-5 text-blue-500" />,
            percentageChange: 12.5,
            trend: 'vs last month',
            trendData: [12, 15, 18, 14, 22, 25, 28, 26, 30],
            color: 'blue',
          },
          {
            title: 'Available Cars',
            value: '48',
            icon: <Car className="h-5 w-5 text-green-500" />,
            percentageChange: -3.2,
            trend: 'vs last month',
            trendData: [24, 25, 20, 18, 15, 16, 15, 14, 13],
            color: 'green',
          },
          {
            title: 'Bookings',
            value: '142',
            icon: <Calendar className="h-5 w-5 text-yellow-500" />,
            percentageChange: 8.7,
            trend: 'vs last month',
            trendData: [45, 50, 55, 60, 58, 65, 70, 68, 78],
            color: 'yellow',
          },
          {
            title: 'Revenue',
            value: '$35,800',
            icon: <DollarSign className="h-5 w-5 text-red-500" />,
            percentageChange: 14.2,
            trend: 'vs last month',
            trendData: [15000, 16000, 18000, 17000, 19000, 22000, 25000, 28000, 30000],
            color: 'red',
          },
        ]);
        
        setRecentBookings([
          {
            id: 1,
            customer: 'John Smith',
            car: 'Tesla Model 3',
            status: 'confirmed',
            date: '2023-07-15',
            amount: '$120',
          },
          // Additional sample data would be here
        ]);
        
        setTopCars([
          {
            id: 1,
            name: 'Tesla Model 3',
            bookings: 24,
            revenue: '$4,800',
            rating: 4.8,
          },
          // Additional sample data would be here
        ]);
        
        setRevenueData([
          { month: 1, value: 12000 },
          { month: 2, value: 15000 },
          { month: 3, value: 18000 },
          { month: 4, value: 16000 },
          { month: 5, value: 21000 },
          { month: 6, value: 25000 },
        ]);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Handle period change for revenue chart
  const handlePeriodChange = async (period) => {
    // Rest of the function implementation
  };

  // Rest of the component implementation
} 