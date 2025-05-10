"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Car Rental Admin
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
} 