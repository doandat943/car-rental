"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { bookingsAPI } from '../../lib/api';

export default function BookingsPage() {
  // State quản lý dữ liệu
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Tải dữ liệu đặt xe
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Xây dựng các tham số lọc
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        };
        
        // Thêm từ khóa tìm kiếm nếu có
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        // Gọi API
        const response = await bookingsAPI.getAllBookings(params);
        const { data, meta } = response.data;
        
        // Format dữ liệu
        const formattedBookings = data.map(booking => ({
          id: booking._id,
          customer: booking.user?.name || 'Khách hàng không xác định',
          car: booking.car?.name || 'Xe không xác định',
          startDate: new Date(booking.startDate).toLocaleDateString(),
          endDate: new Date(booking.endDate).toLocaleDateString(),
          totalAmount: `$${booking.totalAmount.toLocaleString()}`,
          status: booking.status,
          createdAt: new Date(booking.createdAt).toLocaleDateString(),
        }));
        
        // Cập nhật state
        setBookings(formattedBookings);
        setPagination({
          ...pagination,
          total: meta?.totalItems || 0,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Không thể tải dữ liệu đặt xe. Vui lòng thử lại sau.");
        
        // Dữ liệu mẫu trong trường hợp lỗi
        setBookings([
          {
            id: 1,
            customer: 'John Smith',
            car: 'Tesla Model 3',
            startDate: '2023-05-01',
            endDate: '2023-05-03',
            totalAmount: '$120',
            status: 'confirmed',
            createdAt: '2023-04-28',
          },
          {
            id: 2,
            customer: 'Jane Cooper',
            car: 'BMW X5',
            startDate: '2023-04-28',
            endDate: '2023-04-30',
            totalAmount: '$350',
            status: 'completed',
            createdAt: '2023-04-26',
          },
          {
            id: 3,
            customer: 'Robert Johnson',
            car: 'Mercedes C-Class',
            startDate: '2023-04-25',
            endDate: '2023-04-26',
            totalAmount: '$200',
            status: 'cancelled',
            createdAt: '2023-04-23',
          },
          {
            id: 4,
            customer: 'Emily Davis',
            car: 'Toyota Camry',
            startDate: '2023-05-03',
            endDate: '2023-05-05',
            totalAmount: '$85',
            status: 'pending',
            createdAt: '2023-05-01',
          },
          {
            id: 5,
            customer: 'Michael Wilson',
            car: 'Audi A4',
            startDate: '2023-05-02',
            endDate: '2023-05-04',
            totalAmount: '$165',
            status: 'confirmed',
            createdAt: '2023-04-30',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filters, pagination.page, pagination.limit, searchTerm]);

  // Xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  // Xử lý khi thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    
    // Reset về trang 1 khi thay đổi bộ lọc
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  // Xử lý khi tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    setSearchTerm(search);
    
    // Reset về trang 1 khi tìm kiếm
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  // Xử lý khi thay đổi trạng thái đặt xe
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Cập nhật trạng thái trong backend
      await bookingsAPI.updateBookingStatus(bookingId, newStatus);
      
      // Cập nhật UI
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Không thể cập nhật trạng thái đặt xe. Vui lòng thử lại sau.");
    }
  };

  // Định nghĩa cột cho bảng
  const columns = [
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
      key: 'startDate',
      header: 'Ngày bắt đầu',
    },
    {
      key: 'endDate',
      header: 'Ngày kết thúc',
    },
    {
      key: 'totalAmount',
      header: 'Tổng tiền',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (row) => (
        <StatusBadge 
          status={row.status} 
          statusMap={{
            'pending': { label: 'Đang chờ', color: 'yellow' },
            'confirmed': { label: 'Đã xác nhận', color: 'blue' },
            'completed': { label: 'Hoàn thành', color: 'green' },
            'cancelled': { label: 'Đã hủy', color: 'red' },
          }}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.location.href = `/bookings/${row.id}`}
          >
            Chi tiết
          </Button>
          {row.status === 'pending' && (
            <Button 
              size="sm" 
              variant="success"
              onClick={() => handleStatusChange(row.id, 'confirmed')}
            >
              Xác nhận
            </Button>
          )}
          {row.status === 'confirmed' && (
            <Button 
              size="sm" 
              variant="success"
              onClick={() => handleStatusChange(row.id, 'completed')}
            >
              Hoàn thành
            </Button>
          )}
          {(row.status === 'pending' || row.status === 'confirmed') && (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => handleStatusChange(row.id, 'cancelled')}
            >
              Hủy
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Hiển thị loading
  if (loading && bookings.length === 0) {
    return (
      <div className="p-4">
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error && bookings.length === 0) {
    return (
      <div className="p-4">
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
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quản lý đặt xe</h1>
        <Button onClick={() => window.location.href = '/bookings/new'}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo đặt xe mới
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <CardTitle>Lọc và tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Tìm kiếm..."
                  className="pl-8"
                  defaultValue={searchTerm}
                />
              </form>
            </div>
            <div>
              <select
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Đang chờ</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div>
              <Input
                type="date"
                name="startDate"
                placeholder="Từ ngày"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <Input
                type="date"
                name="endDate"
                placeholder="Đến ngày"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={bookings}
            columns={columns}
            pagination={true}
            itemsPerPage={pagination.limit}
            currentPage={pagination.page}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            loading={loading}
            emptyMessage="Không có dữ liệu đặt xe"
          />
        </CardContent>
      </Card>
    </div>
  );
} 