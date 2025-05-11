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

// Page for managing all notifications
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

  const LIMIT = 10; // Number of notifications per page

  // Get notifications based on filters and pagination
  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = {
        page,
        limit: LIMIT
      };
      
      // Add filters to params if available
      if (filter.read !== 'all') {
        params.read = filter.read === 'read';
      }
      
      if (filter.type !== 'all') {
        params.type = filter.type;
      }

      const response = await notificationsAPI.getAllNotifications(params);
      setNotifications(response?.data?.data || []);
      
      // Calculate total pages
      const total = response?.data?.total || 0;
      setTotalPages(Math.ceil(total / LIMIT) || 1);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Unable to load notifications. Please try again later.');
      setNotifications([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
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
      // Update UI even when API fails for better UX
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Update UI even when API fails
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Update UI even when API fails
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== id)
      );
    }
  };

  // Delete all read notifications
  const handleDeleteAllRead = async () => {
    try {
      // Filter out IDs of all read notifications
      const readNotificationIds = notifications
        .filter(notification => notification.read)
        .map(notification => notification._id);
      
      // Delete each read notification
      for (const id of readNotificationIds) {
        await notificationsAPI.deleteNotification(id);
      }
      
      // Update state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => !notification.read)
      );
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      // Update UI even if API fails
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => !notification.read)
      );
    }
  };

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Convert notification type to icon
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

  // Determine background color for notification icon
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

  // Format time in a friendly way
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) {
      return 'Just now';
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} days ago`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} months ago`;
    }
    
    const years = Math.floor(months / 12);
    return `${years} years ago`;
  };

  // Format time in full date format
  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get display name for notification type
  const getNotificationTypeName = (type) => {
    switch (type) {
      case 'booking_new':
        return 'New Booking';
      case 'booking_canceled':
        return 'Booking Canceled';
      case 'booking_completed':
        return 'Booking Completed';
      case 'review_new':
        return 'New Review';
      case 'message_new':
        return 'New Message';
      case 'payment_received':
        return 'Payment';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and view notifications in the system
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
            <span>Mark all as read</span>
          </Button>
          
          <Button 
            onClick={handleDeleteAllRead}
            disabled={!notifications.some(n => n.read) || loading}
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete all read</span>
          </Button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm mr-2 text-gray-500 dark:text-gray-400">Status:</label>
              <select 
                value={filter.read}
                onChange={(e) => setFilter({...filter, read: e.target.value})}
                className="text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm mr-2 text-gray-500 dark:text-gray-400">Type:</label>
              <select 
                value={filter.type}
                onChange={(e) => setFilter({...filter, type: e.target.value})}
                className="text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All</option>
                <option value="booking_new">New Booking</option>
                <option value="booking_canceled">Booking Canceled</option>
                <option value="booking_completed">Booking Completed</option>
                <option value="review_new">New Review</option>
                <option value="message_new">New Message</option>
                <option value="payment_received">Payment</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        {loading ? (
          <div className="p-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">No notifications</h3>
            <p className="text-gray-500 dark:text-gray-400">
              New notifications will appear here when customers perform actions in the system.
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
                              New
                            </span>
                          )}
                          <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {getNotificationTypeName(notification.type)}
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
                          <span>Mark as read</span>
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
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
                    Previous
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
                    Next
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