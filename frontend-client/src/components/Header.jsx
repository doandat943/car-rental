'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { websiteAPI } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [websiteInfo, setWebsiteInfo] = useState({
    siteName: 'CarRental',
    logo: '',
  });
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }

    // Fetch website info
    async function fetchWebsiteInfo() {
      try {
        const response = await websiteAPI.getInfo();
        if (response.data && response.data.success) {
          setWebsiteInfo({
            siteName: response.data.data.siteName || 'CarRental',
            logo: response.data.data.logo || '',
          });
        }
      } catch (error) {
        console.error('Error fetching website info:', error);
      }
    }

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    fetchWebsiteInfo();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsUserMenuOpen(false);
    router.push('/');
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-2xl border-b border-gray-200' 
        : 'bg-white/95 backdrop-blur-md shadow-xl'
    }`}>
      <div className="container px-6 py-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center text-2xl font-bold group">
            {websiteInfo.logo ? (
              <div className="relative mr-3">
                <img 
                  src={websiteInfo.logo.startsWith('http') ? 
                    websiteInfo.logo : 
                    `http://localhost:5000${websiteInfo.logo}`} 
                  alt={websiteInfo.siteName} 
                  className="w-auto h-10 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm group-hover:opacity-100"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-10 h-10 mr-3 transition-all duration-300 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:shadow-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            )}
            <span className="font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {websiteInfo.siteName}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden space-x-1 md:flex">
            {[
              { href: '/', label: 'Home' },
              { href: '/cars', label: 'Cars' },
              { href: '/faq', label: 'FAQ' },
              { href: '/about', label: 'About' }
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="relative px-4 py-2 font-semibold text-gray-700 transition-all duration-300 rounded-lg hover:text-blue-600 hover:bg-blue-50 group"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"></div>
              </Link>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="items-center hidden space-x-4 md:flex">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center px-4 py-2 font-semibold text-gray-700 transition-all duration-300 rounded-lg hover:text-blue-600 hover:bg-blue-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 mr-2 text-sm font-bold text-white rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="mr-1">{user?.name || 'My Account'}</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 z-20 w-56 py-2 mt-2 bg-white border border-gray-200 shadow-2xl rounded-xl animate-slide-in-up">
                    {[
                      { href: '/account', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
                      { href: '/account/bookings', label: 'My Bookings', icon: 'M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                      { href: '/account/profile', label: 'Profile Settings', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
                    ].map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href} 
                        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 group"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400 transition-colors duration-300 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                        </svg>
                        {item.label}
                      </Link>
                    ))}
                    <div className="my-2 border-t border-gray-200"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-600 transition-all duration-300 hover:bg-red-50 group"
                    >
                      <svg className="w-5 h-5 mr-3 text-red-400 transition-colors duration-300 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="px-4 py-2 font-semibold text-gray-700 transition-all duration-300 rounded-lg hover:text-blue-600 hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2 text-sm font-semibold transition-all duration-300 transform shadow-lg btn btn-primary hover:shadow-xl hover:-translate-y-1"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 text-gray-700 transition-all duration-300 rounded-lg hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="pb-6 mt-6 border-t border-gray-200 md:hidden">
            <nav className="flex flex-col mt-6 space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/cars', label: 'Cars' },
                { href: '/faq', label: 'FAQ' },
                { href: '/about', label: 'About' }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="px-4 py-3 font-semibold text-gray-700 transition-all duration-300 rounded-lg hover:text-blue-600 hover:bg-blue-50"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile User Actions */}
              {isLoggedIn ? (
                <div className="pt-4 mt-4 space-y-2 border-t border-gray-200">
                  <div className="flex items-center px-4 py-2 font-semibold text-gray-700">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    {user?.name || 'My Account'}
                  </div>
                  {[
                    { href: '/account', label: 'Dashboard' },
                    { href: '/account/bookings', label: 'My Bookings' },
                    { href: '/account/profile', label: 'Profile Settings' }
                  ].map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className="block px-4 py-3 font-semibold text-gray-700 transition-all duration-300 rounded-lg hover:text-blue-600 hover:bg-blue-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button 
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 font-semibold text-left text-red-600 transition-all duration-300 rounded-lg hover:text-red-700 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 space-y-3 border-t border-gray-200">
                  <Link 
                    href="/login" 
                    className="block px-4 py-3 font-semibold text-gray-700 transition-all duration-300 rounded-lg hover:text-blue-600 hover:bg-blue-50"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="block px-6 py-3 mx-4 font-semibold text-center text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl hover:-translate-y-1"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 