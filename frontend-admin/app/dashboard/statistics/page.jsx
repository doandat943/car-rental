"use client";

import { useState, useEffect } from 'react';
import { dashboardAPI, carsAPI, bookingsAPI } from '../../../lib/api';
import { 
  TrendingUp, 
  Users, 
  Calendar,
  Car,
  DollarSign,
  Truck,
  RefreshCw,
  BarChart2,
  PieChart,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

// Mock imports for charts
const LineChart = ({ data, options }) => (
  <div className="w-full h-64 bg-gray-50 border rounded-md p-4 flex items-center justify-center">
    <div className="text-center">
      <BarChart2 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
      <p className="text-gray-600 text-sm">Biểu đồ dữ liệu (Demo)</p>
      <p className="text-gray-500 text-xs mt-1">Chart.js sẽ hiển thị ở đây</p>
    </div>
  </div>
);

const PieChartComponent = ({ data, options }) => (
  <div className="w-full h-64 bg-gray-50 border rounded-md p-4 flex items-center justify-center">
    <div className="text-center">
      <PieChart className="h-12 w-12 text-blue-500 mx-auto mb-2" />
      <p className="text-gray-600 text-sm">Biểu đồ tròn (Demo)</p>
      <p className="text-gray-500 text-xs mt-1">Chart.js sẽ hiển thị ở đây</p>
    </div>
  </div>
);

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalCars: 0,
    pendingBookings: 0,
    availableCars: 0,
    monthlyRevenue: 0,
    monthlyBookings: 0
  });
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: []
  });
  const [bookingsData, setBookingsData] = useState({
    labels: [],
    datasets: []
  });
  const [carStatusData, setCarStatusData] = useState({
    labels: [],
    datasets: []
  });
  const [topCars, setTopCars] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [timeFrame, setTimeFrame] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [timeFrame]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // In a real implementation, fetch all the data from backend
      // For demo purposes, we'll generate mock data
      await generateMockData();
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
      
      // Generate mock data if API fails
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = async () => {
    // Generate mock stats
    const mockStats = {
      totalRevenue: 1250000000,
      totalBookings: 587,
      totalUsers: 324,
      totalCars: 42,
      pendingBookings: 15,
      availableCars: 32,
      monthlyRevenue: 135000000,
      monthlyBookings: 48
    };
    
    // Generate revenue chart data
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    let labels = [];
    if (timeFrame === 'year') labels = months;
    else if (timeFrame === 'month') labels = weeks;
    else labels = days;
    
    const mockRevenueData = {
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 100000000) + 20000000)
        }
      ]
    };
    
    // Generate bookings chart data
    const mockBookingsData = {
      labels,
      datasets: [
        {
          label: 'Số lượng đặt xe',
          data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 30) + 5)
        }
      ]
    };
    
    // Generate car status data
    const mockCarStatusData = {
      labels: ['Có sẵn', 'Đang thuê', 'Bảo trì', 'Không hoạt động'],
      datasets: [
        {
          data: [32, 8, 2, 0]
        }
      ]
    };
    
    // Generate top cars
    const mockTopCars = [];
    for (let i = 1; i <= 5; i++) {
      mockTopCars.push({
        _id: `car-${i}`,
        name: `${i === 1 ? 'Toyota Fortuner' : i === 2 ? 'Honda CRV' : i === 3 ? 'Kia Seltos' : i === 4 ? 'VinFast Lux A' : 'Mazda CX-5'}`,
        bookingsCount: Math.floor(Math.random() * 30) + 10,
        revenue: (Math.floor(Math.random() * 100) + 50) * 1000000,
        utilization: Math.floor(Math.random() * 40) + 60 // percentage
      });
    }
    
    // Generate recent bookings
    const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const mockRecentBookings = [];
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      mockRecentBookings.push({
        _id: `booking-${i}`,
        bookingCode: `B${100000 + i}`,
        user: {
          name: `Khách hàng ${i}`
        },
        car: {
          name: `${i === 1 ? 'Toyota Fortuner' : i === 2 ? 'Honda CRV' : i === 3 ? 'Kia Seltos' : i === 4 ? 'VinFast Lux A' : 'Mazda CX-5'}`
        },
        totalAmount: (Math.floor(Math.random() * 5) + 1) * 1000000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: date.toISOString()
      });
    }
    
    // Update state
    setStats(mockStats);
    setRevenueData(mockRevenueData);
    setBookingsData(mockBookingsData);
    setCarStatusData(mockCarStatusData);
    setTopCars(mockTopCars);
    setRecentBookings(mockRecentBookings);
    
    return Promise.resolve();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0 
    }).format(value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ xử lý';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="px-4 pt-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Thống kê và báo cáo</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tổng quan về hoạt động kinh doanh và hiệu suất hệ thống
          </p>
        </div>
        
        {/* Refresh button */}
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={fetchDashboardData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới dữ liệu
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      
      {/* Thẻ tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4 dark:bg-blue-900">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-500 font-medium dark:text-green-400">+{formatCurrency(stats.monthlyRevenue)}</span> trong tháng này
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4 dark:bg-green-900">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng đơn đặt xe</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalBookings}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-500 font-medium dark:text-green-400">+{stats.monthlyBookings}</span> trong tháng này
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4 dark:bg-purple-900">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng người dùng</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-blue-500 font-medium dark:text-blue-400">{stats.pendingBookings}</span> đơn chờ xử lý
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4 dark:bg-yellow-900">
              <Car className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng số xe</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalCars}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-500 font-medium dark:text-green-400">{stats.availableCars}</span> xe có sẵn
          </div>
        </div>
      </div>
      
      {/* Biểu đồ doanh thu và đặt xe */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Doanh thu theo thời gian</h2>
            <div className="inline-flex rounded-md shadow-sm mt-2 sm:mt-0">
              <button
                type="button"
                onClick={() => setTimeFrame('week')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${timeFrame === 'week' ? 'bg-blue-50 text-blue-600 border-blue-500 z-10 dark:bg-blue-900 dark:text-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
              >
                Tuần
              </button>
              <button
                type="button"
                onClick={() => setTimeFrame('month')}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${timeFrame === 'month' ? 'bg-blue-50 text-blue-600 border-blue-500 z-10 dark:bg-blue-900 dark:text-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
              >
                Tháng
              </button>
              <button
                type="button"
                onClick={() => setTimeFrame('year')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border ${timeFrame === 'year' ? 'bg-blue-50 text-blue-600 border-blue-500 z-10 dark:bg-blue-900 dark:text-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
              >
                Năm
              </button>
            </div>
          </div>
          <LineChart data={revenueData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Biểu đồ số lượng đặt xe */}
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Số lượng đặt xe</h2>
          <LineChart data={bookingsData} />
        </div>
        
        {/* Biểu đồ trạng thái xe */}
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Trạng thái xe</h2>
          <PieChartComponent data={carStatusData} />
        </div>
      </div>
      
      {/* Top xe được đặt nhiều nhất */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top xe được đặt nhiều nhất</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">TÊN XE</th>
                  <th scope="col" className="px-6 py-3">SỐ LƯỢT ĐẶT</th>
                  <th scope="col" className="px-6 py-3">DOANH THU</th>
                  <th scope="col" className="px-6 py-3">TỈ LỆ SỬ DỤNG</th>
                </tr>
              </thead>
              <tbody>
                {topCars.map((car, index) => (
                  <tr key={car._id} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${index % 2 === 0 ? '' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <Link href={`/dashboard/cars/${car._id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {car.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {car.bookingsCount} lượt
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(car.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: `${car.utilization}%` }}></div>
                        </div>
                        <span className="ml-2">{car.utilization}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <Link
              href="/dashboard/cars"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Xem tất cả xe
            </Link>
          </div>
        </div>
      </div>
      
      {/* Đơn đặt xe gần đây */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Đơn đặt xe gần đây</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">MÃ ĐƠN</th>
                  <th scope="col" className="px-6 py-3">KHÁCH HÀNG</th>
                  <th scope="col" className="px-6 py-3">XE</th>
                  <th scope="col" className="px-6 py-3">TỔNG TIỀN</th>
                  <th scope="col" className="px-6 py-3">NGÀY TẠO</th>
                  <th scope="col" className="px-6 py-3">TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <Link href={`/dashboard/bookings/${booking._id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {booking.bookingCode}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {booking.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {booking.car.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusClass(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{getStatusText(booking.status)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <Link
              href="/dashboard/bookings"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Xem tất cả đơn đặt xe
            </Link>
          </div>
        </div>
      </div>
      
      {/* Ghi chú dưới chân trang */}
      <div className="mt-8 mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md dark:bg-yellow-900/30 dark:border-yellow-700">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Ghi chú:</strong> Đây là bảng điều khiển dữ liệu demo. Trong môi trường sản xuất thực tế, dữ liệu sẽ được lấy từ cơ sở dữ liệu và hiển thị bằng Chart.js hoặc các thư viện biểu đồ tương tự.
        </p>
      </div>
    </div>
  );
} 