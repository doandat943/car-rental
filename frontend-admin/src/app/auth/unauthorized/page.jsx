"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogIn } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function UnauthorizedPage() {
  const router = useRouter();

  // Remove token and user info when this page is displayed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      document.cookie = 'admin_token=; Max-Age=0; path=/; SameSite=Lax';
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-full inline-flex items-center justify-center w-20 h-20 mb-4">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Session Expired
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your session has expired or you don't have permission to access this page.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Please log in again to continue using the system.
          </p>
          
          <Button
            onClick={() => router.push('/auth/login')}
            className="w-full flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Log in again
          </Button>
        </div>
      </div>
    </div>
  );
} 