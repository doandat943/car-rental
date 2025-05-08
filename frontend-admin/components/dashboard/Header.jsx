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
  LogOut
} from 'lucide-react';
import { authAPI } from '../../lib/api';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'New booking request',
      message: 'User John Doe has requested to book a car',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'Booking canceled',
      message: 'User Jane Smith has canceled their booking',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'New review submitted',
      message: 'A new 5-star review has been submitted',
      time: '3 hours ago',
      read: true
    }
  ];

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
                  <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                    {notifications.filter(n => !n.read).length}
                  </div>
                </div>
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 z-50 mt-2 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-800 dark:divide-gray-600" style={{ width: '320px' }}>
                  <div className="block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                    Notifications
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex px-4 py-3 ${notification.read ? 'opacity-60' : 'bg-gray-50 dark:bg-gray-700'}`}
                      >
                        <div className="flex-shrink-0">
                          <div className="relative mt-1">
                            {/* Placeholder for notification icon or user avatar */}
                            <div className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full">
                              <Bell className="w-5 h-5" />
                            </div>
                            {!notification.read && (
                              <div className="absolute w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 -right-0.5 dark:border-gray-800" />
                            )}
                          </div>
                        </div>
                        <div className="w-full pl-3">
                          <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </span>
                            <div>{notification.message}</div>
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-500">
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="block py-2 text-sm font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                  >
                    <div className="inline-flex items-center">
                      <span>View all</span>
                    </div>
                  </a>
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