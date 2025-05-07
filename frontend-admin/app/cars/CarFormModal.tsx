"use client";

import { useState, useEffect } from "react";

interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  dailyPrice: number;
  status: string;
  image: string;
  createdAt: string;
}

interface CarFormModalProps {
  car: Car | null;
  isEdit: boolean;
  onClose: () => void;
  onSave: (car: Car) => void;
}

const CarFormModal = ({
  car,
  isEdit,
  onClose,
  onSave,
}: CarFormModalProps) => {
  const [formData, setFormData] = useState<Partial<Car>>({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    category: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    seats: 5,
    dailyPrice: 0,
    status: "available",
  });

  const categories = ["Sedan", "SUV", "Sports", "Electric", "Luxury", "Compact"];
  const transmissions = ["Automatic", "Manual"];
  const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid"];
  const statuses = ["available", "booked", "maintenance"];

  useEffect(() => {
    if (car && isEdit) {
      setFormData({
        name: car.name,
        brand: car.brand,
        model: car.model,
        year: car.year,
        category: car.category,
        transmission: car.transmission,
        fuelType: car.fuelType,
        seats: car.seats,
        dailyPrice: car.dailyPrice,
        status: car.status,
      });
    }
  }, [car, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "seats" || name === "dailyPrice" 
        ? parseFloat(value) 
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a complete car object with default values for the fields not in the form
    const newCar: Car = {
      id: car?.id || 0, // Will be replaced when saved
      name: formData.name || "",
      brand: formData.brand || "",
      model: formData.model || "",
      year: formData.year || new Date().getFullYear(),
      category: formData.category || "Sedan",
      transmission: formData.transmission || "Automatic",
      fuelType: formData.fuelType || "Gasoline",
      seats: formData.seats || 5,
      dailyPrice: formData.dailyPrice || 0,
      status: formData.status || "available",
      image: car?.image || "/images/cars/default-car.png",
      createdAt: car?.createdAt || new Date().toISOString().split('T')[0],
    };
    
    onSave(newCar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full overflow-auto rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:w-[35rem]">
        <div className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            {isEdit ? "Edit Car" : "Add New Car"}
          </h3>
          <button onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-2.5 block text-black dark:text-white">
                Car Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Car name"
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Brand <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Brand"
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Model <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Model"
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Year <span className="text-meta-1">*</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min={2000}
                max={new Date().getFullYear() + 1}
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Category <span className="text-meta-1">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Transmission <span className="text-meta-1">*</span>
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
              >
                {transmissions.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Fuel Type <span className="text-meta-1">*</span>
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
              >
                {fuelTypes.map((fuelType) => (
                  <option key={fuelType} value={fuelType}>
                    {fuelType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Seats <span className="text-meta-1">*</span>
              </label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                min={1}
                max={15}
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Daily Price ($) <span className="text-meta-1">*</span>
              </label>
              <input
                type="number"
                name="dailyPrice"
                value={formData.dailyPrice}
                onChange={handleChange}
                min={0}
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-2.5 block text-black dark:text-white">
                Car Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full cursor-pointer rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarFormModal; 