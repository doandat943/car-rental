'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    const checkAuthState = () => {
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('token');
          const userData = localStorage.getItem('user');
          
          if (token && userData) {
            const parsedUser = JSON.parse(userData);
            setIsLoggedIn(true);
            setUser(parsedUser);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear corrupted data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setUser(null);
        }
        // Set loading to false faster for better UX
        setTimeout(() => setAuthLoading(false), 50);
      }
    };

    // Check auth state immediately
    checkAuthState();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthState();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-changed', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  const login = (token, userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true);
      setUser(userData);
      // Trigger auth change event for other components
      window.dispatchEvent(new Event('auth-changed'));
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Trigger auth change event for other components
      window.dispatchEvent(new Event('auth-changed'));
    }
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  const updateUser = (newUserData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      // Trigger auth change event for other components
      window.dispatchEvent(new Event('auth-changed'));
    }
  };

  return {
    isLoggedIn,
    user,
    authLoading,
    mounted,
    login,
    logout,
    updateUser
  };
}; 