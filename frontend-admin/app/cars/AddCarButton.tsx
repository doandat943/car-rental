"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AddCarButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ["Sedan", "SUV", "Sports", "Luxury", "Hatchback", "Van"];
  const transmissions = ["Automatic", "Manual"];
  const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add car logic would be here
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-6 text-white hover:bg-opacity-90"
      >
        <FaPlus />
        Add New Car
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] overflow-auto rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:w-[35rem]">
            <div className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                Add New Car
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
                    placeholder="Enter car name"
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
                    placeholder="Brand"
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
                    placeholder="Model"
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Category
                  </label>
                  <select
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
                    placeholder="Year"
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
                    placeholder="Daily price"
                    min="1"
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Car description"
                    className="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  ></textarea>
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
                  onClick={() => setIsModalOpen(false)}
                  className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Add Car
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCarButton; 