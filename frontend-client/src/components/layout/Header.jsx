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

    fetchWebsiteInfo();
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
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary flex items-center">
            {websiteInfo.logo ? (
              <img 
                src={websiteInfo.logo.startsWith('http') ? 
                  websiteInfo.logo : 
                  `http://localhost:5000${websiteInfo.logo}`} 
                alt={websiteInfo.siteName} 
                className="h-8 mr-2"
              />
            ) : null}
            {websiteInfo.siteName}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link href="/cars" className="text-gray-700 hover:text-primary">
              Cars
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary">
              Contact
            </Link>
          </nav>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center text-gray-700 hover:text-primary"
                >
                  <span className="mr-1">{user?.name || 'My Account'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link href="/account/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Bookings
                    </Link>
                    <Link href="/account/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary">
                  Login
                </Link>
                <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col mt-4 space-y-4">
              <Link href="/" className="text-gray-700 hover:text-primary">
                Home
              </Link>
              <Link href="/cars" className="text-gray-700 hover:text-primary">
                Cars
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary">
                Contact
              </Link>
              
              {/* Mobile User Actions */}
              {isLoggedIn ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <Link href="/account" className="text-gray-700 hover:text-primary">
                      Dashboard
                    </Link>
                  </div>
                  <Link href="/account/bookings" className="text-gray-700 hover:text-primary">
                    My Bookings
                  </Link>
                  <Link href="/account/profile" className="text-gray-700 hover:text-primary">
                    Profile Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
                  <Link href="/login" className="text-gray-700 hover:text-primary">
                    Login
                  </Link>
                  <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition text-center">
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