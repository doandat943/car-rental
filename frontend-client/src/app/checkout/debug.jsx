"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { carsAPI } from '@/lib/api';

export default function CheckoutDebugPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carId = searchParams.get('carId');
    if (carId) {
      fetchCar(carId);
    } else {
      setError('No car ID provided');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchCar = async (carId) => {
    try {
      console.log('Fetching car with ID:', carId);
      const response = await carsAPI.getCarById(carId);
      console.log('Car response:', response);
      
      if (response?.data?.success) {
        console.log('Car data:', response.data.data);
        setCar(response.data.data);
      } else {
        setError('Failed to fetch car data');
      }
    } catch (err) {
      console.error('Error fetching car:', err);
      setError('Error fetching car: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Checkout Debug</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">URL Params:</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify({
            carId: searchParams.get('carId'),
            startDate: searchParams.get('startDate'),
            endDate: searchParams.get('endDate'),
            includeDriver: searchParams.get('includeDriver'),
            doorstepDelivery: searchParams.get('doorstepDelivery'),
            totalAmount: searchParams.get('totalAmount')
          }, null, 2)}
        </pre>
      </div>

      {car && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Car Data:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Name:</strong> {typeof car.name === 'string' ? car.name : JSON.stringify(car.name)}</p>
            <p><strong>Brand:</strong> {typeof car.brand === 'string' ? car.brand : JSON.stringify(car.brand)}</p>
            <p><strong>Model:</strong> {typeof car.model === 'string' ? car.model : JSON.stringify(car.model)}</p>
            <p><strong>Year:</strong> {car.year}</p>
            <p><strong>Price:</strong> {JSON.stringify(car.price)}</p>
          </div>
        </div>
      )}
    </div>
  );
} 