"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { carsAPI } from '../../../lib/api';

export default function CarsManagement() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    status: ''
  });
  const [processingCarId, setProcessingCarId] = useState(null);
  
  const ITEMS_PER_PAGE = 10;
  
  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'available', label: 'Sẵn sàng' },
    { value: 'maintenance', label: 'Bảo trì' },
    { value: 'rented', label: 'Đang thuê' }
  ];

  // Fetch data
  useEffect(() => {
    fetchCars();
  }, [currentPage, filter.status]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (filter.status) {
        params.status = filter.status;
      }
      
      const response = await carsAPI.getAllCars(params);
      
      if (response.success) {
        setCars(response.data || []);
        setTotalItems(response.meta?.totalItems || 0);
        setTotalPages(response.meta?.totalPages || 1);
      } else {
        setError('Không thể tải dữ liệu xe, vui lòng thử lại sau.');
        setCars([]);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Không thể tải dữ liệu xe, vui lòng thử lại sau.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Status filter handler
  const handleStatusFilterChange = (e) => {
    setFilter({...filter, status: e.target.value});
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilter({ status: '' });
    setCurrentPage(1);
    fetchCars();
  };

  // Page change handler
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Delete car handler
  const handleDeleteCar = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      return;
    }
    
    try {
      setProcessingCarId(id);
      setError(null);
      setSuccess('');
      
      const response = await carsAPI.deleteCar(id);
      
      if (response.success) {
        setCars(cars.filter(car => car._id !== id));
        setTotalItems(prev => prev - 1);
        setSuccess('Xóa xe thành công');
      } else {
        setError('Không thể xóa xe: ' + (response.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      setError('Không thể xóa xe, vui lòng thử lại sau.');
    } finally {
      setProcessingCarId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Sẵn sàng';
      case 'maintenance':
        return 'Bảo trì';
      case 'rented':
        return 'Đang thuê';
      default:
        return 'Không xác định';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quản lý xe</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Danh sách các xe trong hệ thống
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link
            href="/dashboard/cars/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm xe mới
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
          {success}
        </div>
      )}
      
      {/* Thanh công cụ filter và tìm kiếm */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Tìm kiếm xe theo tên, thương hiệu, mẫu..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={fetchCars}
          >
            <span className="px-3 py-1 text-xs text-white bg-blue-600 rounded-md">Tìm</span>
          </button>
        </div>
      
        <div className="flex flex-col md:flex-row gap-4">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filter.status}
            onChange={handleStatusFilterChange}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
      
      {/* Bảng xe */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">XE</th>
                <th scope="col" className="px-6 py-3">GIÁ/NGÀY</th>
                <th scope="col" className="px-6 py-3">TRẠNG THÁI</th>
                <th scope="col" className="px-6 py-3 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy xe nào
                  </td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative rounded-md overflow-hidden mr-4">
                          {car.images && car.images.length > 0 ? (
                            <img
                              src={car.images[0].startsWith('http') ? car.images[0] : `https://via.placeholder.com/100x100?text=${car.brand || 'Car'}`}
                              alt={car.name}
                              className="h-10 w-10 object-cover rounded-md"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                              <Car className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {car.brand} {car.model}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {car.year} - {car.category?.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {car.price?.daily ? formatAmount(car.price.daily) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(car.status)}`}>
                        {getStatusText(car.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/cars/${car._id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        
                        <Link
                          href={`/dashboard/cars/${car._id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900 flex items-center"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteCar(car._id)}
                          disabled={processingCarId === car._id}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Xóa xe"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Phân trang */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Hiển thị <span className="font-medium">{cars.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> đến <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> trong tổng số <span className="font-medium">{totalItems}</span> xe
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200 dark:border-gray-700">
                  {currentPage}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 