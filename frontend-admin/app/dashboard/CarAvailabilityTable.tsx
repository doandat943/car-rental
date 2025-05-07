"use client";

import Image from "next/image";

interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  dailyPrice: number;
  status: string;
  image: string;
}

interface CarAvailabilityTableProps {
  cars: Car[];
}

const CarAvailabilityTable = ({ cars }: CarAvailabilityTableProps) => {
  // Helper function to get CSS class for status badge
  const getStatusClass = (status: string) => {
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

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Car Availability Status
      </h4>
      <div className="flex flex-col">
        <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-4 col-span-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Vehicle
            </h5>
          </div>
          <div className="p-2.5 xl:p-4 col-span-1 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Category
            </h5>
          </div>
          <div className="p-2.5 xl:p-4 col-span-1 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Price/Day
            </h5>
          </div>
          <div className="p-2.5 xl:p-4 col-span-1 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Status
            </h5>
          </div>
          <div className="p-2.5 xl:p-4 col-span-1 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Details
            </h5>
          </div>
        </div>

        {cars.slice(0, 5).map((car, index) => (
          <div
            key={car.id}
            className={`grid grid-cols-6 ${
              index !== cars.length - 1
                ? "border-b border-stroke dark:border-strokedark"
                : ""
            }`}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-4 col-span-2">
              <div className="h-12 w-12 relative">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {car.name}
                </h5>
                <p className="text-sm text-black dark:text-white">
                  {car.brand} {car.model} ({car.year})
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-4 col-span-1">
              <p className="text-black dark:text-white">{car.category}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-4 col-span-1">
              <p className="text-black dark:text-white">${car.dailyPrice}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-4 col-span-1">
              <p
                className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusClass(
                  car.status
                )}`}
              >
                {car.status}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-4 col-span-1">
              <button className="inline-flex items-center justify-center rounded-md border border-primary p-2 text-primary hover:bg-opacity-90">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarAvailabilityTable; 