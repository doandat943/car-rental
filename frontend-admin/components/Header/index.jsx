"use client";

import { LogOut } from 'lucide-react';
import { authAPI } from '../../lib/api';
import { useRouter } from 'next/navigation';

const Header = ({ className = "" }) => {
  const router = useRouter();

  // Xử lý đăng xuất
  const handleLogout = () => {
    authAPI.logout();
    router.push('/auth/login');
  };

  return (
    <header className={`sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none ${className}`}>
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-black dark:text-white">Car Rental Admin</span>
        </div>
        
        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* Profile menu with logout */}
          <div className="relative">
            <div 
              className="flex cursor-pointer items-center gap-2"
              onClick={() => handleLogout()}
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  Đăng xuất
                </span>
              </span>
              <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 