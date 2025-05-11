"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// Icons
import { 
  Home, CheckSquare, Bell,
  Shield, AlertTriangle, Settings,
  ChevronDown, ChevronRight,
  Car, CalendarCheck, Users, BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [openedSections, setOpenedSections] = useState({
    general: true,
    management: true,
    pages: false
  });

  const toggleSection = (section) => {
    setOpenedSections({
      ...openedSections,
      [section]: !openedSections[section],
    });
  };

  // Check if a link is active
  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  // Define main navigation items
  const generalItems = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Notifications', icon: <Bell className="h-5 w-5" />, path: '/dashboard/notifications' }
  ];

  // Define management items
  const managementItems = [
    { name: 'Car Management', icon: <Car className="h-5 w-5" />, path: '/dashboard/cars' },
    { name: 'Bookings', icon: <CalendarCheck className="h-5 w-5" />, path: '/dashboard/bookings' },
    { name: 'Users', icon: <Users className="h-5 w-5" />, path: '/dashboard/users' },
    { name: 'Statistics & Reports', icon: <BarChart3 className="h-5 w-5" />, path: '/dashboard/statistics' }
  ];

  const pagesItems = [
    { name: 'Tasks', icon: <CheckSquare className="h-5 w-5" />, path: '/dashboard/tasks' },
    { name: 'Authentication', icon: <Shield className="h-5 w-5" />, path: '/dashboard/authentication' },
    { name: 'Errors', icon: <AlertTriangle className="h-5 w-5" />, path: '/dashboard/errors' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r bg-white px-4 pb-4 pt-4 dark:border-gray-700 dark:bg-gray-900">
      {/* Dashboard Logo */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Car Rental Admin
          </span>
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <div className="h-full overflow-y-auto custom-scrollbar">
        {/* General Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('general')}
            className="flex w-full items-center justify-between rounded-md p-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            <span className="text-sm font-medium">Overview</span>
            {openedSections.general ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {openedSections.general && (
            <ul className="mt-2 space-y-1">
              {generalItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center rounded-md px-3 py-2 text-sm ${
                      isActive(item.path)
                        ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400'
                        : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                    {item.isNew && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Management Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('management')}
            className="flex w-full items-center justify-between rounded-md p-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            <span className="text-sm font-medium">Management</span>
            {openedSections.management ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {openedSections.management && (
            <ul className="mt-2 space-y-1">
              {managementItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center rounded-md px-3 py-2 text-sm ${
                      isActive(item.path)
                        ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400'
                        : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                    {item.isNew && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pages Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('pages')}
            className="flex w-full items-center justify-between rounded-md p-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            <span className="text-sm font-medium">Other</span>
            {openedSections.pages ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {openedSections.pages && (
            <ul className="mt-2 space-y-1">
              {pagesItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center rounded-md px-3 py-2 text-sm ${
                      isActive(item.path)
                        ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400'
                        : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                    {item.isNew && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 