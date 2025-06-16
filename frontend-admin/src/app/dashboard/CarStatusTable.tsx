"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch, FaEdit, FaTrash, FaCar, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { carsAPI, API_BASE_URL } from '@/lib/api';

/**
 * CarStatusTable Component
 * 
 * Displays a table of cars with their current status
 * and provides filtering, sorting, and action options
 */

interface CarStatusTableProps {
  cars: any[];
}

const CarStatusTable = ({ cars }: CarStatusTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const router = useRouter();

  // Filter cars based on search term
  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sort
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Car Status
        </h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search cars..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th 
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Car
                {sortField === 'name' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th 
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status
                {sortField === 'status' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                Daily Rate
                {sortField === 'price' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCars.map((car) => (
              <tr key={car._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3 relative">
                      {car.images && car.images.length > 0 ? (
                        <Image 
                          src={car.images[0].startsWith('http') ? car.images[0] : `${API_BASE_URL}${car.images[0]}`}
                          alt={car.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaCar className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{car.name}</div>
                      <div className="text-gray-500 text-sm">{car.brand} {car.model}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div><span className="font-medium">Year:</span> {car.year}</div>
                    <div><span className="font-medium">Category:</span> {car.category?.name || 'N/A'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    car.status === 'active' ? 'bg-green-100 text-green-800' : 
                    car.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    car.status === 'overdue_return' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {car.status === 'active' ? 'Active' : 
                     car.status === 'maintenance' ? 'Maintenance' :
                     car.status === 'overdue_return' ? 'Overdue Return' : 
                     'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${car.price?.daily || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/dashboard/cars/${car._id}`} passHref>
                      <button className="text-indigo-600 hover:text-indigo-900 p-1">
                        <FaEye />
                      </button>
                    </Link>
                    <Link href={`/dashboard/cars/edit/${car._id}`} passHref>
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FaEdit />
                      </button>
                    </Link>
                    <button 
                      className="text-red-600 hover:text-red-900 p-1"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this car?')) {
                          try {
                            await carsAPI.deleteCar(car._id);
                            // Refresh the page to show updated list
                            router.refresh();
                          } catch (error) {
                            console.error('Error deleting car:', error);
                            alert('Error deleting car');
                          }
                        }
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarStatusTable; 