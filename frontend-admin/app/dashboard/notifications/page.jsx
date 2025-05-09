"use client";

import { useState, useEffect } from 'react';
import { notificationsAPI } from '../../../lib/api';
import { 
  Bell, 
  Check, 
  Trash2, 
  Clock, 
  Filter, 
  CheckSquare,
  Star,
  MessageSquare,
  Calendar,
  X,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// Trang quản lý tất cả thông báo
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({
    read: 'all', // 'all', 'read', 'unread'
    type: 'all'  // 'all', 'booking_new', 'booking_canceled', etc.
  });

  const LIMIT = 10; // Số thông báo mỗi trang

  // Lấy thông báo dựa theo bộ lọc và phân trang
  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: LIMIT
      };

      // Thêm bộ lọc vào params nếu có
      if (filter.read !== 'all') {
        params.read = filter.read === 'read';
      }
      
      if (filter.type !== 'all') {
        params.type = filter.type;
      }

      const response = await notificationsAPI.getAllNotifications(params);
      setNotifications(response?.data?.data || []);
      
      // Tính tổng số trang
      const total = response?.data?.total || 0;
      setTotalPages(Math.ceil(total / LIMIT) || 1);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Không thể tải thông báo. Vui lòng thử lại sau.');
      
      // Sử dụng dữ liệu mẫu khi API lỗi
      setNotifications(generateMockNotifications());
      setTotalPages(3);
    } finally {
      setLoading(false);
    }
  };

  // Tạo dữ liệu mẫu trong trường hợp API lỗi
  const generateMockNotifications = () => {
    const mockData = [];
    const types = ['booking_new', 'booking_canceled', 'booking_completed', 'review_new', 'message_new', 'payment_received'];
    const now = Date.now();
    
    for (let i = 0; i < LIMIT; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const read = Math.random() > 0.5;
      const createdAt = new Date(now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString();
      
      let title, message;
      switch (type) {
        case 'booking_new':
          title = 'Yêu cầu đặt xe mới';
          message = `Khách hàng ${getRandomName()} vừa yêu cầu đặt xe ${getRandomCar()}`;
          break;
        case 'booking_canceled':
          title = 'Đơn đặt xe đã bị hủy';
          message = `Khách hàng ${getRandomName()} đã hủy đơn đặt xe ${getRandomCar()}`;
          break;
        case 'booking_completed':
          title = 'Đơn đặt xe hoàn thành';
          message = `Đơn đặt xe ${getRandomCar()} của khách hàng ${getRandomName()} đã hoàn thành`;
          break;
        case 'review_new':
          title = 'Đánh giá mới';
          message = `Có một đánh giá ${Math.floor(Math.random() * 3) + 3} sao mới đã được gửi cho xe ${getRandomCar()}`;
          break;
        case 'message_new':
          title = 'Tin nhắn mới';
          message = `Bạn có tin nhắn mới từ khách hàng ${getRandomName()}`;
          break;
        case 'payment_received':
          title = 'Thanh toán thành công';
          message = `Đã nhận thanh toán ${Math.floor(Math.random() * 300) + 100}$ từ khách hàng ${getRandomName()}`;
          break;
      }
      
      mockData.push({
        _id: `mock-${i + 1}`,
        title,
        message,
        type,
        read,
        createdAt
      });
    }
    
    return mockData;
  };
  
  const getRandomName = () => {
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Davis', 'David Brown', 'Sarah Wilson'];
    return names[Math.floor(Math.random() * names.length)];
  };
  
  const getRandomCar = () => {
    const cars = ['Toyota Camry', 'Honda Civic', 'Tesla Model 3', 'BMW X5', 'Mercedes C-Class', 'Audi A4'];
    return cars[Math.floor(Math.random() * cars.length)];
  };

  // Đánh dấu một thông báo đã đọc
  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Cập nhật UI ngay cả khi API lỗi để UX tốt hơn
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    }
  };

  // Đánh dấu tất cả thông báo đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Cập nhật UI ngay cả khi API lỗi
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    }
  };

  // Xóa một thông báo
  const handleDeleteNotification = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Cập nhật UI ngay cả khi API lỗi
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== id)
      );
    }
  };

  // Xóa tất cả thông báo đã đọc
  const handleDeleteAllRead = async () => {
    try {
      // Lọc ra ID của tất cả thông báo đã đọc
      const readNotificationIds = notifications
        .filter(notification => notification.read)
        .map(notification => notification._id);
      
      // Xóa từng thông báo đã đọc
      for (const id of readNotificationIds) {
        await notificationsAPI.deleteNotification(id);
      }
      
      // Cập nhật state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => !notification.read)
      );
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      // Cập nhật UI ngay cả khi API lỗi
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => !notification.read)
      );
    }
  };

  // Chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Chuyển đổi kiểu thông báo sang icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_new':
        return <Calendar className="w-5 h-5" />;
      case 'booking_canceled':
        return <X className="w-5 h-5" />;
      case 'booking_completed':
        return <Check className="w-5 h-5" />;
      case 'review_new':
        return <Star className="w-5 h-5" />;
      case 'message_new':
        return <MessageSquare className="w-5 h-5" />;
      case 'payment_received':
        return <ShoppingCart className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  // Xác định màu nền cho icon thông báo
  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking_new':
        return 'bg-blue-600';
      case 'booking_canceled':
        return 'bg-red-600';
      case 'booking_completed':
        return 'bg-green-600';
      case 'review_new':
        return 'bg-yellow-600';
      case 'message_new':
        return 'bg-purple-600';
      case 'payment_received':
        return 'bg-green-600';
      default:
        return 'bg-blue-600';
    }
  };

  // Định dạng thời gian dạng thân thiện
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) {
      return 'Vừa xong';
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} phút trước`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} giờ trước`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} ngày trước`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} tháng trước`;
    }
    
    const years = Math.floor(months / 12);
    return `${years} năm trước`;
  };

  // Định dạng thời gian dạng đầy đủ
  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Lấy tên cho hiển thị của loại thông báo
  const getTypeName = (type) => {
    switch (type) {
      case 'booking_new':
        return 'Đặt xe mới';
      case 'booking_canceled':
        return 'Hủy đặt xe';
      case 'booking_completed':
        return 'Hoàn thành đặt xe';
      case 'review_new':
        return 'Đánh giá mới';
      case 'message_new':
        return 'Tin nhắn mới';
      case 'payment_received':
        return 'Thanh toán';
      default:
        return 'Thông báo';
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Thông báo</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quản lý và xem các thông báo trong hệ thống
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button 
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.read) || loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Đánh dấu tất cả đã đọc</span>
          </Button>
          
          <Button 
            onClick={handleDeleteAllRead}
            disabled={!notifications.some(n => n.read) || loading}
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa tất cả đã đọc</span>
          </Button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium">Lọc:</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm mr-2 text-gray-500 dark:text-gray-400">Trạng thái:</label>
              <select 
                value={filter.read}
                onChange={(e) => setFilter({...filter, read: e.target.value})}
                className="text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Tất cả</option>
                <option value="unread">Chưa đọc</option>
                <option value="read">Đã đọc</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm mr-2 text-gray-500 dark:text-gray-400">Loại:</label>
              <select 
                value={filter.type}
                onChange={(e) => setFilter({...filter, type: e.target.value})}
                className="text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Tất cả</option>
                <option value="booking_new">Đặt xe mới</option>
                <option value="booking_canceled">Hủy đặt xe</option>
                <option value="booking_completed">Hoàn thành đặt xe</option>
                <option value="review_new">Đánh giá mới</option>
                <option value="message_new">Tin nhắn mới</option>
                <option value="payment_received">Thanh toán</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách thông báo */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        {loading ? (
          <div className="p-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Đang tải thông báo...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">Không có thông báo nào</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thông báo mới sẽ xuất hiện ở đây khi khách hàng thực hiện các hành động trong hệ thống.
            </p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map(notification => (
                <li 
                  key={notification._id} 
                  className={`p-4 ${notification.read ? '' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex items-start flex-1">
                      <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-white ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-center mb-1">
                          <span className={`${notification.read ? 'text-gray-900' : 'text-blue-700 dark:text-blue-400 font-medium'} text-base dark:text-white`}>
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                              Mới
                            </span>
                          )}
                          <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {getTypeName(notification.type)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300">
                          {notification.message}
                        </p>
                        
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                          <span className="mx-1">•</span>
                          <span title={formatFullDate(notification.createdAt)}>
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3 md:mt-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                          <Check className="w-4 h-4" />
                          <span>Đánh dấu đã đọc</span>
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Xóa</span>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Tiếp
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 