"use client";

import { useState, useEffect } from 'react';
import { usersAPI } from '../../../lib/api';
import { 
  Search, 
  RefreshCw, 
  UserPlus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [processingUserId, setProcessingUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  
  const ITEMS_PER_PAGE = 10;
  
  const roleOptions = [
    { value: '', label: 'Tất cả vai trò' },
    { value: 'user', label: 'Người dùng' },
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'staff', label: 'Nhân viên' }
  ];

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 500);
    
    setDebounceTimeout(timeout);
    
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery
      };
      
      if (roleFilter) {
        params.role = roleFilter;
      }
      
      // API call
      const response = await usersAPI.getAllUsers(params);
      
      // Handle different response formats
      let usersData = [];
      let paginationData = { totalPages: 1, totalItems: 0 };
      
      if (response.data) {
        // If response has nested data structure
        if (response.data.users) {
          usersData = response.data.users;
          paginationData = response.data.pagination || paginationData;
        } else if (Array.isArray(response.data)) {
          // If response.data is directly the array of users
          usersData = response.data;
        }
      } else if (Array.isArray(response)) {
        // If response itself is the array of users
        usersData = response;
      }
      
      setUsers(usersData);
      setTotalPages(paginationData.totalPages || 1);
      setTotalItems(paginationData.totalItems || usersData.length);
      
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      setUsers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'staff':
        return 'Nhân viên';
      case 'user':
        return 'Người dùng';
      default:
        return role;
    }
  };

  const getStatusClass = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const openRoleModal = (user) => {
    setUserToChangeRole(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setUserToChangeRole(null);
    setSelectedRole('');
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setProcessingUserId(userToDelete._id);
      
      await usersAPI.deleteUser(userToDelete._id);
      
      // Remove user from list
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userToDelete._id));
      
      setSuccess(`Người dùng ${userToDelete.name} đã được xóa thành công`);
      closeDeleteModal();
      
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Không thể xóa người dùng. Vui lòng thử lại sau.');
      
      // For demo, remove from UI anyway
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userToDelete._id));
      closeDeleteModal();
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleRoleChange = async () => {
    if (!userToChangeRole || !selectedRole) return;
    
    try {
      setProcessingUserId(userToChangeRole._id);
      
      await usersAPI.updateUser(userToChangeRole._id, { role: selectedRole });
      
      // Update user in list
      setUsers(prevUsers => prevUsers.map(user => 
        user._id === userToChangeRole._id ? { ...user, role: selectedRole } : user
      ));
      
      setSuccess(`Vai trò của người dùng ${userToChangeRole.name} đã được cập nhật thành ${getRoleText(selectedRole)}`);
      closeRoleModal();
      
    } catch (err) {
      console.error('Failed to update user role:', err);
      setError('Không thể cập nhật vai trò người dùng. Vui lòng thử lại sau.');
      
      // For demo, update UI anyway
      setUsers(prevUsers => prevUsers.map(user => 
        user._id === userToChangeRole._id ? { ...user, role: selectedRole } : user
      ));
      closeRoleModal();
    } finally {
      setProcessingUserId(null);
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Danh sách người dùng trong hệ thống
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link
            href="/dashboard/users/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm người dùng mới
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
            placeholder="Tìm theo tên, email hoặc SĐT..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={fetchUsers}
          >
            <span className="px-3 py-1 text-xs text-white bg-blue-600 rounded-md">Tìm</span>
          </button>
        </div>
      
        <div className="flex flex-col md:flex-row gap-4">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={roleFilter}
            onChange={handleRoleFilterChange}
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('');
              setCurrentPage(1);
              fetchUsers();
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
      
      {/* Bảng người dùng */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">TÊN NGƯỜI DÙNG</th>
                <th scope="col" className="px-6 py-3">THÔNG TIN LIÊN HỆ</th>
                <th scope="col" className="px-6 py-3">VAI TRÒ</th>
                <th scope="col" className="px-6 py-3">TRẠNG THÁI</th>
                <th scope="col" className="px-6 py-3">NGÀY ĐĂNG KÝ</th>
                <th scope="col" className="px-6 py-3 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu người dùng...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center dark:bg-gray-700">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/users/${user._id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        
                        <Link
                          href={`/dashboard/users/${user._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => openRoleModal(user)}
                          disabled={processingUserId === user._id}
                          className="text-yellow-600 hover:text-yellow-900 flex items-center"
                          title="Phân quyền"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => openDeleteModal(user)}
                          disabled={processingUserId === user._id || user.role === 'admin'}
                          className={`${user.role === 'admin' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'} flex items-center`}
                          title={user.role === 'admin' ? 'Không thể xóa tài khoản quản trị viên' : 'Xóa người dùng'}
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
                Hiển thị <span className="font-medium">{users.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> đến <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> trong tổng số <span className="font-medium">{totalItems}</span> người dùng
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
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${currentPage === i + 1 ? 'bg-blue-50 border-blue-500 text-blue-600 z-10 dark:bg-blue-900 dark:text-blue-200' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'} text-sm font-medium`}
                  >
                    {i + 1}
                  </button>
                ))}
                
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
      
      {/* Modal xác nhận xóa người dùng */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeDeleteModal}></div>
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Xác nhận xóa người dùng</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Bạn có chắc chắn muốn xóa người dùng <span className="font-semibold">{userToDelete?.name}</span>? Hành động này không thể hoàn tác.
              </p>
            </div>
            
            <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={closeDeleteModal}
              >
                Hủy
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleDeleteUser}
                disabled={processingUserId !== null}
              >
                {processingUserId ? 'Đang xử lý...' : 'Xóa người dùng'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal phân quyền người dùng */}
      {showRoleModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeRoleModal}></div>
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
                <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white text-center">Phân quyền người dùng</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Thay đổi vai trò của người dùng <span className="font-semibold">{userToChangeRole?.name}</span>
              </p>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chọn vai trò mới
              </label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="user">Người dùng</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            
            <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={closeRoleModal}
              >
                Hủy
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleRoleChange}
                disabled={processingUserId !== null || !selectedRole}
              >
                {processingUserId ? 'Đang xử lý...' : 'Cập nhật vai trò'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 