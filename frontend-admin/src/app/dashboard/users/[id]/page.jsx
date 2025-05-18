"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Loader2,
  UserX,
  AlertCircle
} from 'lucide-react';
import { usersAPI } from '../../../../lib/api';
import { Button } from '../../../../components/ui/Button';

export default function UserDetails({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProcessing, setDeleteProcessing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getUserById(id);
        
        if (response.success) {
          setUser(response.data);
        } else {
          setError('Unable to load user information');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Error loading user data');
        
        // Sample data for error case
        setUser({
          _id: id,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
          address: '123 Main St, New York, NY 10001',
          bookings: [],
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const handleDeleteUser = async () => {
    try {
      setDeleteProcessing(true);
      
      const response = await usersAPI.deleteUser(id);
      
      if (response.success) {
        // Redirect to users list after successful deletion
        router.push('/dashboard/users');
      } else {
        setError('Failed to delete user: ' + (response.message || 'Unknown error'));
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again later.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
        return 'Administrator';
      case 'staff':
        return 'Staff';
      case 'user':
        return 'User';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="mr-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">User Details</h1>
          </div>
          {user && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {user.name} ({user.email})
            </p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link href={`/dashboard/users/${id}/edit`}>
            <Button variant="outline" className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          </Link>
          
          {user && user.role !== 'admin' && (
            <Button 
              variant="destructive" 
              className="flex items-center"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <UserX className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 flex p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
          <span className="sr-only">Error</span>
          <div>{error}</div>
        </div>
      )}
      
      {/* User information card */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main information */}
          <div className="md:col-span-2 bg-white rounded-lg shadow dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">User Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</h3>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</h3>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Registered On</h3>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {user.address && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Address</h3>
                <p className="text-base text-gray-900 dark:text-white">{user.address}</p>
              </div>
            )}
          </div>
          
          {/* Sidebar with status */}
          <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Account Status</h2>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {user.lastLogin && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Login</h3>
                <p className="text-sm text-gray-900 dark:text-white">{formatDate(user.lastLogin)}</p>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h3>
              
              <div className="flex flex-col space-y-2">
                <Link href={`/dashboard/users/${id}/edit`}>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                
                <Link href={`/dashboard/bookings?userId=${id}`}>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Bookings
                  </Button>
                </Link>
                
                {user.role !== 'admin' && (
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => !deleteProcessing && setShowDeleteConfirm(false)}></div>
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Confirm User Deletion</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete {user?.name}? This action cannot be undone.
              </p>
            </div>
            
            <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={deleteProcessing}
                className="flex items-center"
              >
                {deleteProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Delete User
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 