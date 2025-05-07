"use client";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";

interface Car {
  id: number;
  name: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  transmission: string;
  fuelType: string;
  dailyPrice: number;
  status: string;
  image: string;
}

interface EditButtonProps {
  car: Car;
}

const EditButton = ({ car }: EditButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...car });

  const categories = ["Sedan", "SUV", "Sports", "Luxury", "Hatchback", "Van"];
  const transmissions = ["Automatic", "Manual"];
  const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid"];
  const statuses = ["Available", "Maintenance", "Reserved"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update car logic would be here
    console.log("Updated car data:", formData);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="hover:text-primary"
      >
        <FaEdit />
      </button>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] overflow-auto rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:w-[35rem]">
            <div className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                Edit Car
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Car Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="2000"
                    max="2030"
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    required
                  >
                    <option value="">Select Transmission</option>
                    {transmissions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Fuel Type
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Daily Price ($)
                  </label>
                  <input
                    type="number"
                    name="dailyPrice"
                    value={formData.dailyPrice}
                    onChange={handleChange}
                    min="1"
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
                    required
                  >
                    <option value="">Select Status</option>
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Update Car Image
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
                  onClick={() => setIsModalOpen(false)}
                  className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Update Car
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditButton; 