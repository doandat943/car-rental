"use client";

import { useState } from 'react';
import { Users, Car, Calendar, DollarSign, TrendingUp, Package, BarChart3, PieChart } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';

export default function DashboardPage() {
  // Sample data for statistics
  const stats = [
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
  ];

  // Sample data for recent bookings
  const recentBookings = [
    {
      id: 1,
      customer: 'John Smith',
      car: 'Tesla Model 3',
      status: 'Confirmed',
      date: '2023-05-01',
      amount: '$120',
    },
    {
      id: 2,
      customer: 'Jane Cooper',
      car: 'BMW X5',
      status: 'Completed',
      date: '2023-04-28',
      amount: '$350',
    },
    {
      id: 3,
      customer: 'Robert Johnson',
      car: 'Mercedes C-Class',
      status: 'Cancelled',
      date: '2023-04-25',
      amount: '$200',
    },
    {
      id: 4,
      customer: 'Emily Davis',
      car: 'Toyota Camry',
      status: 'Pending',
      date: '2023-05-03',
      amount: '$85',
    },
    {
      id: 5,
      customer: 'Michael Wilson',
      car: 'Audi A4',
      status: 'Confirmed',
      date: '2023-05-02',
      amount: '$165',
    },
  ];

  // Sample data for top cars
  const topCars = [
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
  ];

  // Columns for recent bookings table
  const bookingsColumns = [
    {
      key: 'customer',
      header: 'Customer',
      cell: (row) => <span className="font-medium">{row.customer}</span>,
    },
    {
      key: 'car',
      header: 'Car',
    },
    {
      key: 'date',
      header: 'Date',
    },
    {
      key: 'amount',
      header: 'Amount',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <span 
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            row.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
            row.status === 'Completed' ? 'bg-green-100 text-green-800' :
            row.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  // Columns for top cars table
  const carsColumns = [
    {
      key: 'name',
      header: 'Car Model',
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'bookings',
      header: 'Bookings',
    },
    {
      key: 'revenue',
      header: 'Revenue',
    },
    {
      key: 'rating',
      header: 'Rating',
      cell: (row) => (
        <div className="flex items-center">
          <span className="mr-2">{row.rating}</span>
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Bookings</h2>
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={recentBookings}
              columns={bookingsColumns}
              searchable={true}
              pagination={true}
              itemsPerPage={5}
              actions={
                <Button variant="outline" size="sm">
                  View All
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
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-80 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Chart placeholder
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Cars */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Cars</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              data={topCars}
              columns={carsColumns}
              pagination={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 