"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BookingDetailsModal from "./BookingDetailsModal";

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
  year: number;
  category: string;
  image: string;
  dailyPrice: number;
}

interface Booking {
  id: number;
  bookingNumber: string;
  customer: Customer;
  car: Car;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      bookingNumber: "BK-2023-0001",
      customer: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        avatar: "/images/user/user-01.png",
      },
      car: {
        id: 1,
        name: "Toyota Camry",
        brand: "Toyota",
        model: "Camry",
        year: 2022,
        category: "Sedan",
        image: "/images/cars/toyota-camry.png",
        dailyPrice: 55,
      },
      startDate: "2023-06-15",
      endDate: "2023-06-20",
      totalDays: 5,
      totalAmount: 275,
      status: "completed",
      paymentStatus: "paid",
      createdAt: "2023-06-10",
    },
    {
      id: 2,
      bookingNumber: "BK-2023-0002",
      customer: {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 987 654 321",
        avatar: "/images/user/user-02.png",
      },
      car: {
        id: 2,
        name: "Honda Civic",
        brand: "Honda",
        model: "Civic",
        year: 2023,
        category: "Sedan",
        image: "/images/cars/honda-civic.png",
        dailyPrice: 45,
      },
      startDate: "2023-07-01",
      endDate: "2023-07-05",
      totalDays: 4,
      totalAmount: 180,
      status: "active",
      paymentStatus: "paid",
      createdAt: "2023-06-25",
    },
    {
      id: 3,
      bookingNumber: "BK-2023-0003",
      customer: {
        id: 3,
        name: "Michael Johnson",
        email: "michael.j@example.com",
        phone: "+1 555 123 456",
        avatar: "/images/user/user-03.png",
      },
      car: {
        id: 3,
        name: "Ford Mustang",
        brand: "Ford",
        model: "Mustang",
        year: 2022,
        category: "Sports",
        image: "/images/cars/ford-mustang.png",
        dailyPrice: 75,
      },
      startDate: "2023-07-10",
      endDate: "2023-07-15",
      totalDays: 5,
      totalAmount: 375,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: "2023-07-05",
    },
    {
      id: 4,
      bookingNumber: "BK-2023-0004",
      customer: {
        id: 4,
        name: "Emily Wilson",
        email: "emily.w@example.com",
        phone: "+1 333 444 5555",
        avatar: "/images/user/user-04.png",
      },
      car: {
        id: 4,
        name: "BMW X5",
        brand: "BMW",
        model: "X5",
        year: 2023,
        category: "SUV",
        image: "/images/cars/bmw-x5.png",
        dailyPrice: 95,
      },
      startDate: "2023-08-01",
      endDate: "2023-08-07",
      totalDays: 6,
      totalAmount: 570,
      status: "cancelled",
      paymentStatus: "refunded",
      createdAt: "2023-07-20",
    },
  ]);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Handle viewing booking details
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = (bookingId: number, newStatus: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
    setIsDetailsModalOpen(false);
  };

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

  // Helper function to get CSS class for payment status badge
  const getPaymentStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-success/10 text-success";
      case "unpaid":
        return "bg-warning/10 text-warning";
      case "refunded":
        return "bg-info/10 text-info";
      default:
        return "bg-secondary/10 text-secondary";
    }
  };

  return (
    <>
      <Breadcrumb pageName="Bookings" />

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Booking List
          </h5>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-9 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-12">
            <div className="p-2.5 xl:p-5 col-span-2">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Booking #
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-2">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Customer
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-2">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Car
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-2 hidden md:block">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Dates
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-1">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Amount
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-1">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Status
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-1 hidden sm:block">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Payment
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 col-span-1">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Actions
              </h5>
            </div>
          </div>

          {bookings.map((booking, key) => (
            <div
              className={`grid grid-cols-9 sm:grid-cols-12 ${
                key === bookings.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={key}
            >
              <div className="flex items-center p-2.5 xl:p-5 col-span-2">
                <p className="text-black dark:text-white">
                  {booking.bookingNumber}
                </p>
              </div>

              <div className="flex items-center gap-3 p-2.5 xl:p-5 col-span-2">
                <div className="flex-shrink-0">
                  <Image
                    src={booking.customer.avatar}
                    alt="Customer"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="hidden sm:block">
                  <h5 className="font-medium text-black dark:text-white">
                    {booking.customer.name}
                  </h5>
                  <p className="text-xs text-black dark:text-white">
                    {booking.customer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-2.5 xl:p-5 col-span-2">
                <div>
                  <h5 className="font-medium text-black dark:text-white">
                    {booking.car.name}
                  </h5>
                  <p className="text-xs text-black dark:text-white">
                    {booking.car.brand} {booking.car.model} ({booking.car.year})
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center p-2.5 xl:p-5 col-span-2">
                <div>
                  <p className="text-black dark:text-white">
                    {booking.startDate} to {booking.endDate}
                  </p>
                  <p className="text-xs text-black dark:text-white">
                    {booking.totalDays} days
                  </p>
                </div>
              </div>

              <div className="flex items-center p-2.5 xl:p-5 col-span-1">
                <p className="text-black dark:text-white">
                  ${booking.totalAmount}
                </p>
              </div>

              <div className="flex items-center p-2.5 xl:p-5 col-span-1">
                <p
                  className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </p>
              </div>

              <div className="hidden sm:flex items-center p-2.5 xl:p-5 col-span-1">
                <p
                  className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getPaymentStatusClass(
                    booking.paymentStatus
                  )}`}
                >
                  {booking.paymentStatus}
                </p>
              </div>

              <div className="flex items-center space-x-3.5 p-2.5 xl:p-5 col-span-1">
                <button
                  onClick={() => handleViewBooking(booking)}
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Details Modal */}
      {isDetailsModalOpen && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setIsDetailsModalOpen(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

export default BookingsPage; 