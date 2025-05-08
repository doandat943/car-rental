import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Banner = () => {
  return (
    <div className="banner">
      <div className="container h-full flex items-center z-10 relative">
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Find Your Perfect Ride</h1>
          <p className="text-lg opacity-90">
            Explore our premium selection of vehicles and book your dream car today.
            Affordable rates, reliable service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/cars" 
              className="btn btn-primary"
            >
              Browse Cars
            </Link>
            <Link
              href="#how-it-works"
              className="btn btn-outline"
            >
              How It Works
            </Link>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/10"></div>
      <div className="absolute top-20 right-20 w-20 h-20 rounded-full bg-white/10"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-white/10"></div>
    </div>
  );
};

export default Banner; 