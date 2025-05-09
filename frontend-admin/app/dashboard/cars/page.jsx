"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Car, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Eye
} from 'lucide-react';
import { carsAPI, categoriesAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';

export default function CarsManagement() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    category: '',
    status: ''
  });

  const ITEMS_PER_PAGE = 10;

  // Lấy dữ liệu xe và danh mục
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách danh mục
        const categoriesResponse = await categoriesAPI.getAllCategories();
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data || []);
        }

        // Lấy danh sách xe với phân trang và lọc
        const params = {
          page: currentPage,
          limit: ITEMS_PER_PAGE
        };
        
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        if (filter.category) {
          params.category = filter.category;
        }
        
        if (filter.status) {
          params.status = filter.status;
        }
        
        const carsResponse = await carsAPI.getAllCars(params);
        if (carsResponse.data.success) {
          setCars(carsResponse.data.data || []);
          setTotalItems(carsResponse.data.total || 0);
          setTotalPages(carsResponse.data.pages || 1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu, vui lòng thử lại sau.');
        
        // Sử dụng dữ liệu mẫu khi API bị lỗi
        setCars(generateMockCars());
        setCategories(generateMockCategories());
        setTotalPages(3);
        setTotalItems(25);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, filter]);

  // Tạo dữ liệu mẫu khi API bị lỗi
  const generateMockCars = () => {
    const mockCars = [];
    const brands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Tesla', 'Audi', 'Ford', 'Hyundai'];
    const models = ['Camry', 'Civic', 'X5', 'C-Class', 'Model 3', 'A4', 'Mustang', 'Tucson'];
    const statuses = ['available', 'maintenance', 'rented'];
    const categories = ['Sedan', 'SUV', 'Truck', 'Sport', 'Luxury'];
    
    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
      const brandIndex = Math.floor(Math.random() * brands.length);
      const modelIndex = Math.floor(Math.random() * models.length);
      const basePrice = 50 + Math.floor(Math.random() * 200);
      
      mockCars.push({
        _id: `car-${i + 1}`,
        name: `${brands[brandIndex]} ${models[modelIndex]}`,
        brand: brands[brandIndex],
        model: models[modelIndex],
        year: 2018 + Math.floor(Math.random() * 5),
        price: {
          daily: basePrice,
          weekly: basePrice * 6,
          monthly: basePrice * 25
        },
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        images: ['/placeholder-car.jpg']
      });
    }
    
    return mockCars;
  };

  // Tạo danh mục mẫu
  const generateMockCategories = () => {
    return [
      { _id: 'cat-1', name: 'Sedan' },
      { _id: 'cat-2', name: 'SUV' },
      { _id: 'cat-3', name: 'Truck' },
      { _id: 'cat-4', name: 'Sport' },
      { _id: 'cat-5', name: 'Luxury' }
    ];
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // searchQuery đã được cập nhật bởi input
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Xử lý xóa xe
  const handleDeleteCar = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      return;
    }
    
    try {
      const response = await carsAPI.deleteCar(id);
      
      if (response.data.success) {
        // Cập nhật lại danh sách xe sau khi xóa
        setCars(cars.filter(car => car._id !== id));
        setTotalItems(totalItems - 1);
        
        // Nếu trang hiện tại không còn xe, chuyển về trang trước
        if (cars.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Không thể xóa xe, vui lòng thử lại sau.');
    }
  };

  // Hiển thị trạng thái xe
  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Sẵn sàng</span>;
      case 'maintenance':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Bảo trì</span>;
      case 'rented':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Đang thuê</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{status}</span>;
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quản lý xe</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Danh sách các xe trong hệ thống
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/dashboard/cars/add">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Thêm xe mới</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input 
                type="search" 
                className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Tìm kiếm xe theo tên, thương hiệu, mẫu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-1 bottom-1 top-1 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Tìm
              </button>
            </div>
          </form>
        </div>
        <div className="flex gap-2 md:col-span-1">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filter.category}
            onChange={(e) => setFilter({...filter, category: e.target.value})}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="available">Sẵn sàng</option>
            <option value="maintenance">Bảo trì</option>
            <option value="rented">Đang thuê</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center p-8">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có xe nào</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Bắt đầu bằng cách thêm mới xe vào hệ thống.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/cars/add">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Thêm xe mới</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Xe</th>
                <th scope="col" className="px-6 py-3">Danh mục</th>
                <th scope="col" className="px-6 py-3">Năm sản xuất</th>
                <th scope="col" className="px-6 py-3">Giá/ngày</th>
                <th scope="col" className="px-6 py-3">Trạng thái</th>
                <th scope="col" className="px-6 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr 
                  key={car._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden rounded-md">
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700"></div>
                        {car.images && car.images.length > 0 && (
                          <Image
                            src={car.images[0].startsWith('http') ? car.images[0] : `/uploads/${car.images[0]}`}
                            alt={car.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 dark:text-white">{car.name}</div>
                        <div className="text-gray-500 dark:text-gray-400">{car.brand} {car.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{typeof car.category === 'object' ? car.category.name : car.category}</td>
                  <td className="px-6 py-4">{car.year}</td>
                  <td className="px-6 py-4">
                    {typeof car.price === 'object' 
                      ? `$${car.price.daily}/ngày` 
                      : `$${car.price}/ngày`}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(car.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/cars/${car._id}`} passHref>
                        <Button variant="ghost" size="sm" className="p-1" title="Xem chi tiết">
                          <Eye className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/cars/${car._id}/edit`} passHref>
                        <Button variant="ghost" size="sm" className="p-1" title="Sửa">
                          <Edit className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1"
                        title="Xóa"
                        onClick={() => handleDeleteCar(car._id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && !error && cars.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Hiển thị <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> đến <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> trong <span className="font-medium">{totalItems}</span> kết quả
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 