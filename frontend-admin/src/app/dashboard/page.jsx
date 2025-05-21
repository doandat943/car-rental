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
        const bookingsData = bookingsResponse.data?.bookings || bookingsResponse.data || [];
        const formattedBookings = Array.isArray(bookingsData) 
          ? bookingsData.map(booking => ({
              id: booking._id,
              customer: booking.customer?.name || 
                        (booking.customer?.firstName && booking.customer?.lastName ? 
                         `${booking.customer.firstName} ${booking.customer.lastName}` : 
                         booking.customer?.firstName || booking.customer?.lastName || 'Customer'),
              car: booking.car?.name || 
                   (booking.car?.brand && booking.car?.model ? 
                    `${booking.car.brand} ${booking.car.model}` : 
                    'Unknown car'),
              status: booking.status,
              date: new Date(booking.startDate).toLocaleDateString(),
              amount: `$${booking.totalAmount?.toLocaleString() || '0'}`,
            }))
          : [];
        
        console.log("Formatted bookings:", formattedBookings);
        setRecentBookings(formattedBookings);
        
        // Format top cars data
        const topCarsData = topCarsResponse.data?.data || topCarsResponse.data || [];
        const formattedTopCars = Array.isArray(topCarsData)
          ? topCarsData.map(car => ({
              id: car._id,
              name: car.name || (car.brand && car.model ? `${car.brand} ${car.model}` : 'Unknown car'),
              bookings: car.bookingsCount || car.bookingCount || 0,
              revenue: `$${(car.totalRevenue || car.revenue || 0).toLocaleString()}`,
              rating: car.averageRating || car.rating || 0,
            }))
          : [];
        
        setTopCars(formattedTopCars);
        
        // Add chart data to state
        const chartData = revenueChartResponse.data.data || [];
        setRevenueData(Array.isArray(chartData) ? chartData : []);
        
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
    setPeriodFilter(period);
    try {
      setLoading(true);
      
      const revenueChartResponse = await dashboardAPI.getRevenueChart(period).catch(err => {
        console.error("Error fetching revenue chart:", err);
        return { data: { data: [] }};
      });
      
      // Add chart data to state
      const chartData = revenueChartResponse.data.data || [];
      setRevenueData(Array.isArray(chartData) ? chartData : []);
      
      setLoading(false);
    } catch (err) {
      console.error("Error updating chart data:", err);
      setLoading(false);
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome to your Dashboard. Check the latest metrics and performance.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            percentageChange={stat.percentageChange}
            trend={stat.trend}
            trendData={stat.trendData}
            color={stat.color}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue Overview</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={periodFilter === 'week' ? 'default' : 'outline'}
                  onClick={() => handlePeriodChange('week')}
                >
                  Week
                </Button>
                <Button 
                  size="sm" 
                  variant={periodFilter === 'month' ? 'default' : 'outline'}
                  onClick={() => handlePeriodChange('month')}
                >
                  Month
                </Button>
                <Button 
                  size="sm" 
                  variant={periodFilter === 'year' ? 'default' : 'outline'}
                  onClick={() => handlePeriodChange('year')}
                >
                  Year
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              <RevenueChart data={revenueData} period={periodFilter} />
            </CardContent>
          </Card>
        </div>
        
        {/* Top Cars */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Top Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCars.slice(0, 5).map((car) => (
                  <div key={car.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="font-medium">{car.name}</p>
                      <p className="text-sm text-gray-500">{car.bookings} bookings</p>
                    </div>
                    <p className="font-medium">{car.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { header: "Customer", key: "customer" },
              { header: "Car", key: "car" },
              { 
                header: "Status", 
                key: "status",
                cell: (row) => {
                  const status = row.status || '';
                  return (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  );
                }
              },
              { header: "Date", key: "date" },
              { header: "Amount", key: "amount" },
            ]}
            data={recentBookings}
            emptyMessage="No recent bookings found"
          />
        </CardContent>
      </Card>
    </div>
  );
} 