"use client";

import { useState } from 'react';
import { PlusCircle, Edit, Trash2, Filter } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import DataTable from '../../../components/ui/DataTable';

export default function CarsPage() {
  // Sample data for cars
  const cars = [
    {
      id: 1,
      name: 'Tesla Model 3',
      category: 'Electric',
      price: '$120',
      status: 'Available',
      registrationNumber: 'TS-3421',
      year: 2021,
    },
    {
      id: 2,
      name: 'BMW X5',
      category: 'SUV',
      price: '$175',
      status: 'Booked',
      registrationNumber: 'BM-2234',
      year: 2020,
    },
    {
      id: 3,
      name: 'Mercedes C-Class',
      category: 'Sedan',
      price: '$150',
      status: 'Available',
      registrationNumber: 'ME-5542',
      year: 2019,
    },
    {
      id: 4,
      name: 'Toyota Camry',
      category: 'Sedan',
      price: '$85',
      status: 'Under Maintenance',
      registrationNumber: 'TY-8876',
      year: 2022,
    },
    {
      id: 5,
      name: 'Honda Civic',
      category: 'Sedan',
      price: '$75',
      status: 'Available',
      registrationNumber: 'HC-7766',
      year: 2021,
    },
    {
      id: 6,
      name: 'Audi A4',
      category: 'Sedan',
      price: '$145',
      status: 'Available',
      registrationNumber: 'AU-1122',
      year: 2020,
    },
    {
      id: 7,
      name: 'Ford Mustang',
      category: 'Sports',
      price: '$200',
      status: 'Booked',
      registrationNumber: 'FM-9988',
      year: 2019,
    },
    {
      id: 8,
      name: 'Chevrolet Impala',
      category: 'Sedan',
      price: '$95',
      status: 'Available',
      registrationNumber: 'CI-3344',
      year: 2021,
    },
    {
      id: 9,
      name: 'Nissan Altima',
      category: 'Sedan',
      price: '$80',
      status: 'Under Maintenance',
      registrationNumber: 'NA-5566',
      year: 2022,
    },
    {
      id: 10,
      name: 'Hyundai Sonata',
      category: 'Sedan',
      price: '$70',
      status: 'Available',
      registrationNumber: 'HS-7788',
      year: 2020,
    },
  ];

  // Function to handle row click
  const handleRowClick = (car) => {
    console.log('Car clicked:', car);
    // Here you would typically navigate to a detail page or open a modal
  };

  // Function to handle adding a new car
  const handleAddCar = () => {
    console.log('Add car clicked');
    // Here you would typically open a modal or navigate to a form page
  };

  // Function to handle editing a car
  const handleEditCar = (e, car) => {
    e.stopPropagation(); // Prevent row click from firing
    console.log('Edit car clicked:', car);
    // Here you would typically open a modal or navigate to a form page
  };

  // Function to handle deleting a car
  const handleDeleteCar = (e, car) => {
    e.stopPropagation(); // Prevent row click from firing
    console.log('Delete car clicked:', car);
    // Here you would typically show a confirmation dialog
  };

  // Columns for cars table
  const carsColumns = [
    {
      key: 'name',
      header: 'Car Name',
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'price',
      header: 'Daily Rate',
    },
    {
      key: 'year',
      header: 'Year',
    },
    {
      key: 'registrationNumber',
      header: 'Reg. Number',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <span 
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            row.status === 'Available' ? 'bg-green-100 text-green-800' :
            row.status === 'Booked' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleEditCar(e, row)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleDeleteCar(e, row)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Cars Management</h1>
        
        <Button onClick={handleAddCar}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Car
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={cars}
            columns={carsColumns}
            searchable={true}
            sortable={true}
            pagination={true}
            itemsPerPage={8}
            onRowClick={handleRowClick}
            actions={
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}