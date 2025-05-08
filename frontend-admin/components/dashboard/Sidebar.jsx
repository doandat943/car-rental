"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// Các icon
import { 
  Home, Mail, CheckSquare, 
  Shield, AlertTriangle, Settings,
  ChevronDown, ChevronRight, Package,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [openedSections, setOpenedSections] = useState({
    general: true,
    pages: true,
    components: false,
  });

  const toggleSection = (section) => {
    setOpenedSections({
      ...openedSections,
      [section]: !openedSections[section],
    });
  };

  // Check if a link is active
  const isActive = (path) => pathname === path;

  // Define main navigation items
  const generalItems = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Email', icon: <Mail className="h-5 w-5" />, path: '/dashboard/email' },
    { name: 'Tasks', icon: <CheckSquare className="h-5 w-5" />, path: '/dashboard/tasks', isNew: true },
  ];

  const pagesItems = [
    { name: 'Authentication', icon: <Shield className="h-5 w-5" />, path: '/dashboard/authentication' },
    { name: 'Errors', icon: <AlertTriangle className="h-5 w-5" />, path: '/dashboard/errors' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/dashboard/settings', isNew: true },
  ];

  // Components list
  const componentItems = [
    'Accordion', 'Alert', 'Alert Dialog', 'Aspect Ratio', 'Avatar', 'Badge', 
    'Breadcrumb', 'Button', 'Calendar', 'Card', 'Carousel', 'Checkbox', 
    'Collapsible', 'Combobox', 'Command', 'Context Menu', 'Dialog', 
    'Dropdown Menu', 'Form', 'Hover Card', 'Input', 'Label', 'Menubar', 
    'Navigation Menu', 'Popover', 'Progress', 'Radio Group', 'Scroll Area', 
    'Select', 'Separator', 'Sheet', 'Skeleton', 'Slider', 'Switch', 
    'Table', 'Tabs', 'Textarea', 'Toast', 'Toggle', 'Tooltip'
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
            <span className="text-sm font-medium">General</span>
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

        {/* Pages Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('pages')}
            className="flex w-full items-center justify-between rounded-md p-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            <span className="text-sm font-medium">Pages</span>
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

        {/* Components Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('components')}
            className="flex w-full items-center justify-between rounded-md p-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            <span className="text-sm font-medium">Components</span>
            {openedSections.components ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {openedSections.components && (
            <ul className="mt-2 space-y-1">
              {componentItems.map((name) => (
                <li key={name}>
                  <Link
                    href={`/dashboard/components/${name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`flex items-center rounded-md px-3 py-2 text-sm ${
                      isActive(`/dashboard/components/${name.toLowerCase().replace(/\s+/g, '-')}`)
                        ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400'
                        : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                    }`}
                  >
                    <Package className="h-5 w-5" />
                    <span className="ml-3">{name}</span>
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