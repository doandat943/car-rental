"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Sun, 
  Moon, 
  User,
  Settings,
  LogOut,
  Check,
  Clock,
  Trash2,
  AlertCircle,
  ShoppingCart,
  MessageSquare,
  Star
} from 'lucide-react';
import { authAPI, notificationsAPI } from '../../lib/api';
import { Button } from '../../components/ui/Button';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: 'Admin User',
    email: 'admin@example.com'
  });

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Thử lấy thông tin người dùng từ localStorage
    const getUserInfo = () => {
      if (typeof window !== 'undefined') {
        try {
          const storedUser = localStorage.getItem('admin_user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserInfo({
              name: parsedUser.name || 'Admin User',
              email: parsedUser.email || 'admin@example.com'
            });
          }
        } catch (error) {
          console.error('Error getting user info:', error);
        }
      }
    };
    
    getUserInfo();
  }, []);

  // Lấy thông báo khi component mount hoặc khi dropdown mở
  useEffect(() => {
    if (notificationsOpen) {
      fetchNotifications();
    }
  }, [notificationsOpen]);

  // Hàm lấy thông báo từ API
  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationsError(null);
    
    try {
      const response = await notificationsAPI.getAllNotifications({ limit: 5 });
      setNotifications(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotificationsError('Không thể tải thông báo');
      // Sử dụng dữ liệu mẫu khi API lỗi
      setNotifications([
        {
          _id: '1',
          title: 'Yêu cầu đặt xe mới',
          message: 'Khách hàng John Doe vừa yêu cầu đặt xe Tesla Model 3',
          type: 'booking_new',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 phút trước
        },
        {
          _id: '2',
          title: 'Đơn đặt xe đã bị hủy',
          message: 'Khách hàng Jane Smith đã hủy đơn đặt xe BMW X5',
          type: 'booking_canceled',
          read: false,
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 giờ trước
        },
        {
          _id: '3',
          title: 'Đánh giá mới',
          message: 'Có một đánh giá 5 sao mới đã được gửi cho xe Mercedes C-Class',
          type: 'review_new',
          read: true,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 giờ trước
        }
      ]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Đánh dấu thông báo đã đọc
  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation(); // Ngăn event bubble lên và mở link
    
    try {
      await notificationsAPI.markAsRead(id);
      // Cập nhật state local
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Đánh dấu tất cả thông báo đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      // Cập nhật state local
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Xóa thông báo
  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation(); // Ngăn event bubble lên và mở link
    
    try {
      await notificationsAPI.deleteNotification(id);
      // Cập nhật state local
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
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

  // Xử lý đăng xuất
  const handleLogout = () => {
    try {
      authAPI.logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Nếu có lỗi, vẫn cần đảm bảo xóa token và chuyển hướng
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        document.cookie = 'admin_token=; Max-Age=0; path=/; SameSite=Lax';
      }
      router.push('/auth/login');
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

  return (
    <header className="fixed top-0 z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div className="flex items-center justify-start">
              <Link href="/dashboard" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Admin
                </span>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md ml-4 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input 
                type="search" 
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Search..." 
              />
            </div>
          </div>

          <div className="flex items-center">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span className="sr-only">Toggle dark mode</span>
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setDropdownOpen(false);
                }}
                className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <span className="sr-only">View notifications</span>
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                      {notifications.filter(n => !n.read).length}
                    </div>
                  )}
                </div>
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 z-50 mt-2 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-800 dark:divide-gray-600" style={{ width: '320px' }}>
                  <div className="flex justify-between items-center px-4 py-2 text-base font-medium text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                    <span>Thông báo</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      disabled={!notifications.some(n => !n.read)}
                      className="text-xs py-1"
                    >
                      Đánh dấu tất cả đã đọc
                    </Button>
                  </div>
                  
                  {notificationsLoading ? (
                    <div className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                      Đang tải thông báo...
                    </div>
                  ) : notificationsError ? (
                    <div className="py-4 px-4 text-center text-red-500 dark:text-red-400">
                      {notificationsError}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                      Không có thông báo nào
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => router.push('/dashboard')}
                          className={`flex px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                          <div className="flex-shrink-0">
                            <div className="relative mt-1">
                              <div className={`flex items-center justify-center w-10 h-10 text-white ${getNotificationColor(notification.type)} rounded-full`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              {!notification.read && (
                                <div className="absolute w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 -right-0.5 dark:border-gray-800" />
                              )}
                            </div>
                          </div>
                          <div className="w-full pl-3 pr-8 relative">
                            <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {notification.title}
                              </span>
                              <div>{notification.message}</div>
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeAgo(notification.createdAt)}
                            </div>
                            
                            {/* Action buttons */}
                            <div className="absolute right-0 top-0 flex flex-col space-y-1">
                              {!notification.read && (
                                <button 
                                  onClick={(e) => handleMarkAsRead(notification._id, e)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/30"
                                  title="Đánh dấu đã đọc"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={(e) => handleDeleteNotification(notification._id, e)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded-full dark:text-red-400 dark:hover:bg-red-900/30"
                                title="Xóa thông báo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Link
                    href="/dashboard/notifications"
                    className="block py-2 text-sm font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                  >
                    <div className="inline-flex items-center">
                      <span>Xem tất cả</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative ml-3">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open user menu</span>
                <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <User className="absolute w-10 h-10 text-gray-400 -left-1 -top-1" />
                </div>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-600" style={{ minWidth: '200px' }}>
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">{userInfo.name}</span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{userInfo.email}</span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 