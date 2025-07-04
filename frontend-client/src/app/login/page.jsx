"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingBooking, setPendingBooking] = useState(null);

  // Check for pending booking on component mount
  useEffect(() => {
    const bookingData = localStorage.getItem('pendingBooking');
    if (bookingData) {
      try {
        setPendingBooking(JSON.parse(bookingData));
      } catch (e) {
        console.error('Error parsing pending booking:', e);
        localStorage.removeItem('pendingBooking');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data && response.data.token) {
        // Save auth token and user data using the hook
        login(response.data.token, response.data.user || {});
        
        // Check for pending booking
        if (pendingBooking) {
          // Redirect to checkout with booking data
          const checkoutParams = new URLSearchParams({
            carId: pendingBooking.carId,
            startDate: pendingBooking.startDate,
            endDate: pendingBooking.endDate,
            includeDriver: (pendingBooking.includeDriver || false).toString(),
            doorstepDelivery: (pendingBooking.doorstepDelivery || false).toString(),
            totalAmount: (pendingBooking.totalAmount || 0).toString()
          });
          
          localStorage.removeItem('pendingBooking');
          router.push(`/checkout?${checkoutParams.toString()}`);
          return;
        }
        
        // Redirect to the previous page or home
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        router.push(redirect || '/');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/" className="font-medium text-primary hover:text-primary-dark">
              continue as guest
            </Link>
          </p>
          
          {pendingBooking && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm text-blue-800 text-center">
                Please sign in to complete your car booking
              </p>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-danger p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-danger">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-primary-300' : 'bg-primary hover:bg-primary-dark'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <p>For testing purposes, use:</p>
            <p className="font-medium text-gray-600">Email: john.doe@example.com</p>
            <p className="font-medium text-gray-600">Password: User123!</p>
          </div>
        </form>
      </div>
    </div>
  );
} 