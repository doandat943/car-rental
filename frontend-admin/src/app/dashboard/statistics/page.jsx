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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Theme colors
const colors = {
  blue: {
    primary: 'rgb(53, 162, 235)',
    light: 'rgba(53, 162, 235, 0.5)',
  },
  green: {
    primary: 'rgb(75, 192, 192)',
    light: 'rgba(75, 192, 192, 0.5)',
  },
  yellow: {
    primary: 'rgb(255, 206, 86)',
    light: 'rgba(255, 206, 86, 0.5)',
  },
  red: {
    primary: 'rgb(255, 99, 132)',
    light: 'rgba(255, 99, 132, 0.5)',
  },
  purple: {
    primary: 'rgb(153, 102, 255)',
    light: 'rgba(153, 102, 255, 0.5)',
  },
  orange: {
    primary: 'rgb(255, 159, 64)',
    light: 'rgba(255, 159, 64, 0.5)',
  }
};

// Setup Chart.js theme
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          size: 12
        },
        color: function(context) {
          // Support dark mode
          return document.documentElement.classList.contains('dark') 
            ? 'rgb(229, 231, 235)' 
            : 'rgb(55, 65, 81)';
        }
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: function(context) {
          return document.documentElement.classList.contains('dark') 
            ? 'rgba(229, 231, 235, 0.1)' 
            : 'rgba(55, 65, 81, 0.1)';
        }
      },
      ticks: {
        color: function(context) {
          return document.documentElement.classList.contains('dark') 
            ? 'rgb(229, 231, 235)' 
            : 'rgb(55, 65, 81)';
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: function(context) {
          return document.documentElement.classList.contains('dark') 
            ? 'rgba(229, 231, 235, 0.1)' 
            : 'rgba(55, 65, 81, 0.1)';
        }
      },
      ticks: {
        color: function(context) {
          return document.documentElement.classList.contains('dark') 
            ? 'rgb(229, 231, 235)' 
            : 'rgb(55, 65, 81)';
        }
      }
    },
  },
};

// Replace mock components with real components
const LineChart = ({ data, options = {} }) => {
  const mergedOptions = {
    ...chartOptions,
    ...options,
  };
  
  return (
    <div className="w-full h-64">
      <Line data={data} options={mergedOptions} />
    </div>
  );
};

const BarChart = ({ data, options = {} }) => {
  const mergedOptions = {
    ...chartOptions,
    ...options,
  };
  
  return (
    <div className="w-full h-64">
      <Bar data={data} options={mergedOptions} />
    </div>
  );
};

const PieChartComponent = ({ data, options = {} }) => {
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          },
          color: function(context) {
            return document.documentElement.classList.contains('dark') 
              ? 'rgb(229, 231, 235)' 
              : 'rgb(55, 65, 81)';
          }
        }
      }
    }
  };
  
  const mergedOptions = {
    ...pieOptions,
    ...options,
  };
  
  return (
    <div className="w-full h-64">
      <Pie data={data} options={mergedOptions} />
    </div>
  );
};

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    // Add event listener to automatically update chart when switching dark/light mode
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement &&
          ChartJS.instances
        ) {
          // Update all charts
          Object.values(ChartJS.instances).forEach(chart => {
            chart.update();
          });
        }
      });
    });

    // Start observing
    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // Clean up when component unmounts
    return () => {
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [timeFrame]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call the statistics API
      const response = await dashboardAPI.getStatistics({ timeFrame });
      const statsData = response.data;
      
      // Update data from API
      setStats(statsData.overview);
      setRevenueData(statsData.revenueChart);
      setBookingsData(statsData.bookingsChart);
      setCarStatusData(statsData.carStatusChart);
      setTopCars(statsData.topCars);
      setRecentBookings(statsData.recentBookings);
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Unable to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyCompact = (value) => {
    // Format in compact form, e.g.: 1.2 billion, 5.6 million
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} billion`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} million`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
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

  if (loading) {
    return (
      <div className="px-4 pt-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Statistics and Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overview of business activities and system performance
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
            Refresh data
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      
      {/* Overview section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4 dark:bg-blue-900">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-500 font-medium dark:text-green-400">+{formatCurrency(stats.monthlyRevenue)}</span> this month
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4 dark:bg-green-900">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalBookings}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-500 font-medium dark:text-green-400">+{stats.monthlyBookings}</span> this month
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4 dark:bg-purple-900">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-blue-500 font-medium dark:text-blue-400">{stats.pendingBookings}</span> pending requests
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4 dark:bg-yellow-900">
              <Car className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cars</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalCars}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-green-500 font-medium dark:text-green-400">{stats.availableCars}</span> available cars
          </div>
        </div>
      </div>
      
      {/* Revenue and bookings chart */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue over time</h2>
            <div className="inline-flex rounded-md shadow-sm mt-2 sm:mt-0">
              <button
                type="button"
                onClick={() => setTimeFrame('week')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${timeFrame === 'week' ? 'bg-blue-50 text-blue-600 border-blue-500 z-10 dark:bg-blue-900 dark:text-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setTimeFrame('month')}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${timeFrame === 'month' ? 'bg-blue-50 text-blue-600 border-blue-500 z-10 dark:bg-blue-900 dark:text-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => setTimeFrame('year')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border ${timeFrame === 'year' ? 'bg-blue-50 text-blue-600 border-blue-500 z-10 dark:bg-blue-900 dark:text-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
              >
                Year
              </button>
            </div>
          </div>
          <LineChart data={revenueData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bookings chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Bookings</h2>
          <LineChart data={bookingsData} />
        </div>
        
        {/* Car status chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Car Status</h2>
          <PieChartComponent data={carStatusData} />
        </div>
      </div>
      
      {/* Top cars booked most */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top cars booked most</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">CAR NAME</th>
                  <th scope="col" className="px-6 py-3">BOOKINGS</th>
                  <th scope="col" className="px-6 py-3">REVENUE</th>
                  <th scope="col" className="px-6 py-3">UTILIZATION</th>
                </tr>
              </thead>
              <tbody>
                {topCars.map((car, index) => (
                  <tr key={car._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <Link href={`/dashboard/cars/${car._id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {car.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {car.bookingsCount} bookings
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
              View all cars
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent bookings */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">BOOKING CODE</th>
                  <th scope="col" className="px-6 py-3">CUSTOMER</th>
                  <th scope="col" className="px-6 py-3">CAR</th>
                  <th scope="col" className="px-6 py-3">TOTAL AMOUNT</th>
                  <th scope="col" className="px-6 py-3">CREATED AT</th>
                  <th scope="col" className="px-6 py-3">STATUS</th>
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
              View all bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 