"use client";

import { useState, useEffect } from 'react';
import { Users, Car, Calendar, DollarSign, TrendingUp, Package, BarChart3, PieChart } from 'lucide-react';
import dynamic from 'next/dynamic';
import StatCard from '../../components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { dashboardAPI, bookingsAPI, carsAPI } from '../../lib/api';

// Dynamic import của RevenueChart để tránh lỗi SSR
const RevenueChart = dynamic(() => import('../../components/dashboard/RevenueChart'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
      <div className="flex flex-col items-center text-center">
        <BarChart3 className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Đang tải biểu đồ...
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
    // Hàm tải dữ liệu dashboard
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Gọi API lấy thống kê
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
        
        // Gọi API lấy các booking gần đây
        const bookingsResponse = await bookingsAPI.getAllBookings({ 
          limit: 5, 
          page: 1,
          sort: '-createdAt' 
        }).catch(err => {
          console.error("Error fetching bookings:", err);
          return { data: { data: [] }};
        });
        
        // Gọi API lấy top xe được đặt nhiều nhất
        const topCarsResponse = await dashboardAPI.getTopCars(5).catch(err => {
          console.error("Error fetching top cars:", err);
          return { data: { data: [] }};
        });
        
        // Gọi API lấy dữ liệu biểu đồ doanh thu
        const revenueChartResponse = await dashboardAPI.getRevenueChart('month').catch(err => {
          console.error("Error fetching revenue chart:", err);
          return { data: { data: [] }};
        });
        
        // Cập nhật state với dữ liệu từ API
        const statsData = statsResponse.data.data || statsResponse.data;
        
        // Tạo mảng hiển thị thống kê
        const statsCards = [
          {
            title: 'Tổng Khách hàng',
            value: statsData.totalUsers.toLocaleString(),
            icon: <Users className="h-5 w-5 text-blue-500" />,
            percentageChange: statsData.userGrowth || 0,
            trend: 'vs tháng trước',
            trendData: statsData.userTrend || Array(9).fill(0),
            color: 'blue',
          },
          {
            title: 'Xe Hiện Có',
            value: statsData.totalCars.toLocaleString(),
            icon: <Car className="h-5 w-5 text-green-500" />,
            percentageChange: statsData.carGrowth || 0,
            trend: 'vs tháng trước',
            trendData: statsData.carTrend || Array(9).fill(0),
            color: 'green',
          },
          {
            title: 'Lượt Đặt Xe',
            value: statsData.totalBookings.toLocaleString(),
            icon: <Calendar className="h-5 w-5 text-yellow-500" />,
            percentageChange: statsData.bookingGrowth || 0,
            trend: 'vs tháng trước',
            trendData: statsData.bookingTrend || Array(9).fill(0),
            color: 'yellow',
          },
          {
            title: 'Doanh Thu',
            value: `$${statsData.totalRevenue.toLocaleString()}`,
            icon: <DollarSign className="h-5 w-5 text-red-500" />,
            percentageChange: statsData.revenueGrowth || 0,
            trend: 'vs tháng trước',
            trendData: statsData.revenueTrend || Array(9).fill(0),
            color: 'red',
          },
        ];
        
        setStats(statsCards);
        
        // Format dữ liệu booking
        const formattedBookings = (bookingsResponse.data.data || []).map(booking => ({
          id: booking._id,
          customer: booking.user?.name || 'Khách hàng',
          car: booking.car?.name || 'Xe không xác định',
          status: booking.status,
          date: new Date(booking.startDate).toLocaleDateString(),
          amount: `$${booking.totalAmount.toLocaleString()}`,
        }));
        
        setRecentBookings(formattedBookings);
        
        // Format dữ liệu top cars
        const formattedTopCars = (topCarsResponse.data.data || []).map(car => ({
          id: car._id,
          name: car.name,
          bookings: car.bookingsCount,
          revenue: `$${car.totalRevenue.toLocaleString()}`,
          rating: car.averageRating || 0,
        }));
        
        setTopCars(formattedTopCars);
        
        // Thêm dữ liệu biểu đồ vào state
        setRevenueData(revenueChartResponse.data.data || []);
        
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
        setLoading(false);
        
        // Thiết lập dữ liệu mẫu trong trường hợp lỗi
        setStats([
          {
            title: 'Tổng Khách hàng',
            value: '2,856',
            icon: <Users className="h-5 w-5 text-blue-500" />,
            percentageChange: 12.5,
            trend: 'vs tháng trước',
            trendData: [12, 15, 18, 14, 22, 25, 28, 26, 30],
            color: 'blue',
          },
          {
            title: 'Xe Hiện Có',
            value: '48',
            icon: <Car className="h-5 w-5 text-green-500" />,
            percentageChange: -3.2,
            trend: 'vs tháng trước',
            trendData: [24, 25, 20, 18, 15, 16, 15, 14, 13],
            color: 'green',
          },
          {
            title: 'Lượt Đặt Xe',
            value: '142',
            icon: <Calendar className="h-5 w-5 text-yellow-500" />,
            percentageChange: 8.7,
            trend: 'vs tháng trước',
            trendData: [45, 50, 55, 60, 58, 65, 70, 68, 78],
            color: 'yellow',
          },
          {
            title: 'Doanh Thu',
            value: '$35,800',
            icon: <DollarSign className="h-5 w-5 text-red-500" />,
            percentageChange: 14.2,
            trend: 'vs tháng trước',
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
            date: '2023-05-01',
            amount: '$120',
          },
          {
            id: 2,
            customer: 'Jane Cooper',
            car: 'BMW X5',
            status: 'completed',
            date: '2023-04-28',
            amount: '$350',
          },
          {
            id: 3,
            customer: 'Robert Johnson',
            car: 'Mercedes C-Class',
            status: 'cancelled',
            date: '2023-04-25',
            amount: '$200',
          },
          {
            id: 4,
            customer: 'Emily Davis',
            car: 'Toyota Camry',
            status: 'pending',
            date: '2023-05-03',
            amount: '$85',
          },
          {
            id: 5,
            customer: 'Michael Wilson',
            car: 'Audi A4',
            status: 'confirmed',
            date: '2023-05-02',
            amount: '$165',
          },
        ]);
        
        setTopCars([
          {
            id: 1,
            name: 'Tesla Model 3',
            bookings: 28,
            revenue: '$3,360',
            rating: 4.8,
          },
          {
            id: 2,
            name: 'BMW X5',
            bookings: 22,
            revenue: '$7,700',
            rating: 4.6,
          },
          {
            id: 3,
            name: 'Toyota Camry',
            bookings: 19,
            revenue: '$1,615',
            rating: 4.3,
          },
          {
            id: 4,
            name: 'Mercedes C-Class',
            bookings: 17,
            revenue: '$3,400',
            rating: 4.7,
          },
          {
            id: 5,
            name: 'Honda Civic',
            bookings: 15,
            revenue: '$1,275',
            rating: 4.5,
          },
        ]);
      }
    };

    fetchDashboardData();
  }, []);

  // Columns for recent bookings table
  const bookingsColumns = [
    {
      key: 'customer',
      header: 'Khách hàng',
      cell: (row) => <span className="font-medium">{row.customer}</span>,
    },
    {
      key: 'car',
      header: 'Xe',
    },
    {
      key: 'date',
      header: 'Ngày đặt',
    },
    {
      key: 'amount',
      header: 'Số tiền',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (row) => (
        <span 
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            row.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
            row.status === 'completed' ? 'bg-green-100 text-green-800' :
            row.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.status === 'confirmed' ? 'Đã xác nhận' : 
           row.status === 'completed' ? 'Hoàn thành' :
           row.status === 'cancelled' ? 'Đã hủy' : 'Đang chờ'}
        </span>
      ),
    },
  ];

  // Columns for top cars table
  const carsColumns = [
    {
      key: 'name',
      header: 'Mẫu xe',
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'bookings',
      header: 'Số lượt đặt',
    },
    {
      key: 'revenue',
      header: 'Doanh thu',
    },
    {
      key: 'rating',
      header: 'Đánh giá',
      cell: (row) => (
        <div className="flex items-center">
          <span className="mr-2">{row.rating.toFixed(1)}</span>
          <div className="relative w-16 h-2 bg-gray-200 rounded">
            <div 
              className="absolute top-0 left-0 h-2 bg-yellow-400 rounded"
              style={{ width: `${(row.rating / 5) * 100}%` }} 
            />
          </div>
        </div>
      ),
    },
  ];

  // Hàm đổi giai đoạn của biểu đồ doanh thu
  const handlePeriodChange = async (period) => {
    try {
      setPeriodFilter(period);
      
      // Gọi API với giai đoạn mới
      const revenueChartResponse = await dashboardAPI.getRevenueChart(period).catch(err => {
        console.error("Error fetching revenue chart:", err);
        return { data: { data: [] }};
      });
      
      // Cập nhật dữ liệu biểu đồ
      setRevenueData(revenueChartResponse.data.data || []);
    } catch (err) {
      console.error("Error changing period:", err);
    }
  };

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="px-2">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Recent Bookings */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Đặt xe gần đây</h2>
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={recentBookings}
              columns={bookingsColumns}
              searchable={true}
              pagination={true}
              itemsPerPage={5}
              emptyMessage="Không có dữ liệu đặt xe"
              actions={
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/dashboard/bookings'}
                >
                  Xem tất cả
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Top Cars - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Charts Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-row items-center justify-between">
              <CardTitle>Tổng quan doanh thu</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={periodFilter === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handlePeriodChange('week')}
                >
                  Tuần
                </Button>
                <Button 
                  variant={periodFilter === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handlePeriodChange('month')}
                >
                  Tháng
                </Button>
                <Button 
                  variant={periodFilter === 'year' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handlePeriodChange('year')}
                >
                  Năm
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <RevenueChart data={revenueData} period={periodFilter} />
            ) : (
              <div className="flex h-80 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
                <div className="flex flex-col items-center text-center">
                  <BarChart3 className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Không có dữ liệu biểu đồ
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Top Cars */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Xe đặt nhiều nhất</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/dashboard/cars'}
            >
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              data={topCars}
              columns={carsColumns}
              pagination={false}
              emptyMessage="Không có dữ liệu xe"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 