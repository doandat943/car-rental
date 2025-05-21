"use client";

import Image from "next/image";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
}

interface Booking {
  id: number;
  customer: Customer;
  car: Car;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface RecentBookingsTableProps {
  bookings: Booking[];
}

const RecentBookingsTable = ({ bookings }: RecentBookingsTableProps) => {
  // Helper function to get CSS class for status badge
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success/10 text-success";
      case "active":
        return "bg-primary/10 text-primary";
      case "pending":
        return "bg-warning/10 text-warning";
      case "cancelled":
        return "bg-danger/10 text-danger";
      default:
        return "bg-secondary/10 text-secondary";
    }
  };

  // Function to generate booking code from ID
  const generateBookingCode = (id: number) => {
    // Convert ID to string and take the last 6 characters
    const idStr = id.toString();
    const code = idStr.substring(Math.max(0, idStr.length - 6)).toUpperCase();
    return `BK-${code}`;
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Recent Bookings
        </h4>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[110px] py-4 px-4 font-medium text-black dark:text-white">
                Booking #
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Customer
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Car
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Date
              </th>
              <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">
                Amount
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.slice(0, 5).map((booking) => (
              <tr key={booking.id}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {generateBookingCode(booking.id)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full">
                      <Image
                        src={booking.customer.avatar}
                        alt={booking.customer.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        {booking.customer.name}
                      </h5>
                      <p className="text-xs text-body">{booking.customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {booking.car.brand} {booking.car.model}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {booking.startDate}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    ${booking.totalAmount}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookingsTable; 