"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CarFormModal from "./CarFormModal";
import DeleteCarModal from "./DeleteCarModal";

const CarsPage = () => {
  const [cars, setCars] = useState([
    {
      id: 1,
      name: "Toyota Camry",
      brand: "Toyota",
      model: "Camry",
      year: 2022,
      category: "Sedan",
      specifications: {
        transmission: "Automatic",
        fuelType: "Gasoline",
        seats: 5
      },
      price: { daily: 55 },
      availability: true,
      image: "/images/cars/toyota-camry.png",
      createdAt: "2023-01-10",
    },
    {
      id: 2,
      name: "Honda Civic",
      brand: "Honda",
      model: "Civic",
      year: 2023,
      category: "Sedan",
      specifications: {
        transmission: "Automatic",
        fuelType: "Gasoline",
        seats: 5
      },
      price: { daily: 45 },
      availability: true,
      image: "/images/cars/honda-civic.png",
      createdAt: "2023-02-15",
    },
    {
      id: 3,
      name: "Ford Mustang",
      brand: "Ford",
      model: "Mustang",
      year: 2022,
      category: "Sports",
      specifications: {
        transmission: "Automatic",
        fuelType: "Gasoline",
        seats: 4
      },
      price: { daily: 75 },
      availability: false,
      image: "/images/cars/ford-mustang.png",
      createdAt: "2023-03-05",
    },
  ]);
  
  const [categories, setCategories] = useState([
    { id: 1, name: "Sedan" },
    { id: 2, name: "SUV" },
    { id: 3, name: "Sports" },
    { id: 4, name: "Electric" }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Handle opening form for creating a new car
  const handleCreateCar = () => {
    setCurrentCar(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  // Handle opening form for editing an existing car
  const handleEditCar = (car) => {
    setCurrentCar(car);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  // Handle saving a car (create or update)
  const handleSaveCar = async (carData) => {
    try {
      if (isEditMode && currentCar) {
        // Update existing car
        setCars((prevCars) =>
          prevCars.map((car) => (car.id === currentCar.id ? {...carData, id: car.id} : car))
        );
      } else {
        // Create new car
        const newCar = {
          ...carData,
          id: Math.max(...cars.map(car => car.id), 0) + 1,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setCars((prevCars) => [...prevCars, newCar]);
      }
      
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Error saving car:", err);
      alert("Failed to save car. Please try again.");
    }
  };

  // Handle opening delete confirmation modal
  const handleDeleteCarClick = (car) => {
    setCurrentCar(car);
    setIsDeleteModalOpen(true);
  };

  // Handle confirming car deletion
  const handleDeleteCar = async () => {
    if (currentCar) {
      try {
        setCars((prevCars) =>
          prevCars.filter((car) => car.id !== currentCar.id)
        );
        setIsDeleteModalOpen(false);
      } catch (err) {
        console.error("Error deleting car:", err);
        alert("Failed to delete car. Please try again.");
      }
    }
  };

  // Helper function to get CSS class for status badge
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-success/10 text-success";
      case "booked":
        return "bg-warning/10 text-warning";
      case "maintenance":
        return "bg-danger/10 text-danger";
      default:
        return "bg-secondary/10 text-secondary";
    }
  };

  // Display loading spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Display error message
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-3 text-xl font-semibold text-black dark:text-white">Error</h2>
          <p className="text-danger">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Cars" />

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Car List
          </h5>
          <button
            onClick={handleCreateCar}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                fill="white"
              />
            </svg>
            Add New Car
          </button>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-8 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-12">
            <div className="p-2.5 xl:p-5 col-span-3">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Car
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-2 hidden md:block">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Specifications
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-1">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Price
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-1">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Status
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-1 hidden md:block">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Added
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-2">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Actions
              </h5>
            </div>
          </div>

          {cars.length === 0 ? (
            <div className="flex justify-center p-10">
              <p className="text-gray-500">No cars found. Add some cars to get started.</p>
            </div>
          ) : (
            cars.map((car, key) => (
              <div
                className={`grid grid-cols-8 sm:grid-cols-12 ${
                  key === cars.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={car.id || key}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5 col-span-3">
                  <div className="flex-shrink-0 w-14 h-14 relative">
                    <Image
                      src={car.image || "/images/cars/default-car.png"}
                      alt={car.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h5 className="font-medium text-black dark:text-white">
                      {car.name}
                    </h5>
                    <p className="text-sm text-black dark:text-white">
                      {car.brand} {car.model} ({car.year})
                    </p>
                    <p className="text-xs text-black dark:text-white md:hidden">
                      {car.category?.name || car.category} | {car.specifications?.transmission || 'N/A'} | {car.specifications?.fuelType || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center p-2.5 xl:p-5 col-span-2">
                  <div>
                    <p className="text-black dark:text-white">
                      Category: {car.category?.name || car.category || 'N/A'}
                    </p>
                    <p className="text-black dark:text-white">
                      Transmission: {car.specifications?.transmission || 'N/A'}
                    </p>
                    <p className="text-black dark:text-white">
                      Fuel: {car.specifications?.fuelType || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-2.5 xl:p-5 col-span-1">
                  <p className="text-black dark:text-white">${car.price?.daily || car.dailyPrice || 0}/day</p>
                </div>

                <div className="flex items-center p-2.5 xl:p-5 col-span-1">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusClass(
                      car.availability ? 'available' : 'booked'
                    )}`}
                  >
                    {car.availability ? 'Available' : 'Booked'}
                  </p>
                </div>

                <div className="hidden md:flex items-center p-2.5 xl:p-5 col-span-1">
                  <p className="text-black dark:text-white">
                    {new Date(car.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3.5 p-2.5 xl:p-5 col-span-2">
                  <button
                    onClick={() => handleEditCar(car)}
                    className="hover:text-primary"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                        fill=""
                      />
                      <path
                        d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteCarClick(car)}
                    className="hover:text-primary"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                        fill=""
                      />
                      <path
                        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                        fill=""
                      />
                      <path
                        d="M10.8789 9.7594C10.8789 9.42189 10.5977 9.11252 10.2321 9.11252C9.8946 9.11252 9.58521 9.39377 9.58521 9.7594V13.3313C9.58521 13.6688 9.86646 13.9782 10.2321 13.9782C10.5695 13.9782 10.8789 13.6969 10.8789 13.3313V9.7594Z"
                        fill=""
                      />
                      <path
                        d="M7.14645 9.7594C7.14645 9.42189 6.86521 9.11252 6.49958 9.11252C6.16208 9.11252 5.85271 9.39377 5.85271 9.7594V13.3313C5.85271 13.6688 6.13396 13.9782 6.49958 13.9782C6.83708 13.9782 7.14645 13.6969 7.14645 13.3313V9.7594Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Car Form Modal */}
      {isFormModalOpen && (
        <CarFormModal
          car={currentCar}
          categories={categories}
          isEdit={isEditMode}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveCar}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentCar && (
        <DeleteCarModal
          carName={currentCar.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteCar}
        />
      )}
    </>
  );
};

export default CarsPage; 