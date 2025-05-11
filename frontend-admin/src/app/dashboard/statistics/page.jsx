"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { dashboardAPI } from '../../../lib/api';
import Link from 'next/link';
import { formatCurrency } from '../../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    overview: {
      totalRevenue: 0,
      totalBookings: 0,
      totalUsers: 0,
      totalCars: 0,
      pendingBookings: 0,
      availableCars: 0,
      monthlyRevenue: 0,
      monthlyBookings: 0,
    },
    monthlyRevenue: [],
    monthlyBookings: [],
    carStatus: [],
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [timeFrame, setTimeFrame] = useState('all');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch statistics
        const statsResponse = await dashboardAPI.getStatistics();
        setStatistics(statsResponse.data);
        
        // Fetch recent bookings
        const bookingsResponse = await dashboardAPI.getRecentBookings();
        setRecentBookings(bookingsResponse.data);
        
        // Fetch top cars
        const topCarsResponse = await dashboardAPI.getTopCars();
        setTopCars(topCarsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [timeFrame]);

  // Show error if data loading failed
  if (error) {
    return (
      <div className="container p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Thống kê và báo cáo</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant={timeFrame === 'week' ? 'primary' : 'outline'}
            onClick={() => setTimeFrame('week')}
          >
            Tuần
          </Button>
          <Button 
            variant={timeFrame === 'month' ? 'primary' : 'outline'}
            onClick={() => setTimeFrame('month')}
          >
            Tháng
          </Button>
          <Button 
            variant={timeFrame === 'year' ? 'primary' : 'outline'}
            onClick={() => setTimeFrame('year')}
          >
            Năm
          </Button>
          <Button 
            variant={timeFrame === 'all' ? 'primary' : 'outline'}
            onClick={() => setTimeFrame('all')}
          >
            Tất cả
          </Button>
        </div>
      </div>
      
      {/* Main statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Tổng doanh thu" 
          value={formatCurrency(statistics.overview.totalRevenue)} 
          description="Tổng doanh thu từ các đơn đặt xe"
          loading={loading}
        />
        <StatCard 
          title="Đơn đặt xe" 
          value={statistics.overview.totalBookings} 
          description="Tổng số đơn đặt xe" 
          loading={loading}
        />
        <StatCard 
          title="Người dùng" 
          value={statistics.overview.totalUsers} 
          description="Tổng số người dùng đăng ký" 
          loading={loading}
        />
        <StatCard 
          title="Xe" 
          value={statistics.overview.totalCars} 
          description="Tổng số xe trong hệ thống" 
          loading={loading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>Biểu đồ doanh thu qua các tháng</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Doanh thu" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        {/* Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn đặt xe theo tháng</CardTitle>
            <CardDescription>Biểu đồ số lượng đơn đặt xe qua các tháng</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics.monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `${value} đơn`}
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Đơn đặt" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Car Status */}
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái xe</CardTitle>
            <CardDescription>Phân bố trạng thái xe trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={statistics.carStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="label"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statistics.carStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value} xe`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {statistics.carStatus.map((status, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>{status.label}: {status.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Top Cars */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Xe được đặt nhiều nhất</CardTitle>
            <CardDescription>Danh sách các xe được đặt nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Tên xe</th>
                      <th className="py-3 px-4 text-left">Số lượt đặt</th>
                      <th className="py-3 px-4 text-left">Doanh thu</th>
                      <th className="py-3 px-4 text-left">Tỷ lệ đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCars.map((car) => (
                      <tr key={car._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium">
                          <Link href={`/dashboard/cars/${car._id}`} className="text-blue-600 hover:underline">
                            {car.name}
                          </Link>
                        </td>
                        <td className="py-2 px-4">{car.bookingsCount}</td>
                        <td className="py-2 px-4">{formatCurrency(car.revenue)}</td>
                        <td className="py-2 px-4">{((car.bookingsCount / statistics.overview.totalBookings) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn đặt xe gần đây</CardTitle>
          <CardDescription>Các đơn đặt xe mới nhất trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-14 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Mã đơn</th>
                    <th className="py-3 px-4 text-left">Khách hàng</th>
                    <th className="py-3 px-4 text-left">Xe</th>
                    <th className="py-3 px-4 text-left">Ngày đặt</th>
                    <th className="py-3 px-4 text-left">Tổng tiền</th>
                    <th className="py-3 px-4 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <Link href={`/dashboard/bookings/${booking._id}`} className="text-blue-600 hover:underline">
                          {booking._id.substring(0, 8)}...
                        </Link>
                      </td>
                      <td className="py-2 px-4">{booking.user?.name || 'N/A'}</td>
                      <td className="py-2 px-4">{booking.car?.name || 'N/A'}</td>
                      <td className="py-2 px-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{formatCurrency(booking.totalAmount)}</td>
                      <td className="py-2 px-4">
                        <StatusBadge status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, description, loading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-full bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-500">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
    paid: "bg-purple-100 text-purple-800",
  };
  
  const displayNames = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    canceled: "Canceled",
    paid: "Paid",
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
      {displayNames[status] || status}
    </span>
  );
} 