"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { authAPI } from '../../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    // Chỉ thực hiện ở phía client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        // Kiểm tra nếu có redirect trong URL thì chuyển hướng đến đó
        const redirect = searchParams.get('redirect');
        router.push(redirect || '/dashboard');
      }
    }
  }, [router, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Kiểm tra trường bắt buộc
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      setLoading(false);
      return;
    }

    try {
      // Gọi API đăng nhập
      const response = await authAPI.login(email, password);
      
      // Lưu token vào localStorage đã được xử lý trong API
      
      // Lưu thông tin người dùng vào localStorage nếu có
      if (response.data && response.data.user) {
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      } else {
        // Nếu không có thông tin người dùng từ API, lưu thông tin mặc định
        localStorage.setItem('admin_user', JSON.stringify({
          name: 'Admin User',
          email: email,
          role: 'admin'
        }));
      }
      
      // Kiểm tra nếu có redirect trong URL thì chuyển hướng đến đó
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Car Rental Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Login to access the admin system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    className="pl-10"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Contact the administrator if you have trouble logging in
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 