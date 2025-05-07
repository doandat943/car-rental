"use client";

import { FaCheck, FaBan, FaCheckDouble } from "react-icons/fa";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Car {
  id: number;
  name: string;
  image: string;
}

interface Booking {
  id: number;
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

interface BookingDetailsProps {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}

const BookingDetails = ({
  booking,
  onClose,
  onStatusChange,
}: BookingDetailsProps) => {
  // Function to get status badge class based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success text-success";
      case "pending":
        return "bg-warning text-warning";
      case "cancelled":
        return "bg-danger text-danger";
      case "completed":
        return "bg-info text-info";
      default:
        return "bg-gray-500 text-gray-500";
    }
  };

  // Function to get payment status badge class
  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success text-success";
      case "pending":
        return "bg-warning text-warning";
      case "refunded":
        return "bg-danger text-danger";
      default:
        return "bg-gray-500 text-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full overflow-auto rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:w-[35rem]">
        <div className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Booking Details
          </h3>
          <button onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        <div className="mt-4">
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Booking Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-body">Booking ID</p>
                <p className="font-medium text-black dark:text-white">
                  #{booking.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-body">Created On</p>
                <p className="font-medium text-black dark:text-white">
                  {booking.createdAt}
                </p>
              </div>
              <div>
                <p className="text-sm text-body">Status</p>
                <p
                  className={`mt-1 inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusBadgeClass(
                    booking.status
                  )}`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-body">Payment Status</p>
                <p
                  className={`mt-1 inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getPaymentStatusBadgeClass(
                    booking.paymentStatus
                  )}`}
                >
                  {booking.paymentStatus.charAt(0).toUpperCase() +
                    booking.paymentStatus.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Customer Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-body">Name</p>
                <p className="font-medium text-black dark:text-white">
                  {booking.customer.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-body">Email</p>
                <p className="font-medium text-black dark:text-white">
                  {booking.customer.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-body">Phone</p>
                <p className="font-medium text-black dark:text-white">
                  {booking.customer.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Car Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-body">Car</p>
                <p className="font-medium text-black dark:text-white">
                  {booking.car.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-body">Car ID</p>
                <p className="font-medium text-black dark:text-white">
                  #{booking.car.id}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Rental Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-body">Start Date</p>
                <p className="font-medium text-black dark:text-white">
                  {booking.startDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-body">End Date</p>
                <p className="font-medium text-black dark:text-white">
                  {booking.endDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-body">Total Days</p>
                <p className="font-medium text-black dark:text-white">
                  {booking.totalDays} days
                </p>
              </div>
              <div>
                <p className="text-sm text-body">Total Amount</p>
                <p className="font-medium text-black dark:text-white">
                  ${booking.totalAmount}
                </p>
              </div>
            </div>
          </div>

          {booking.status === "pending" && (
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded bg-success py-2 px-6 font-medium text-white hover:bg-opacity-90"
                onClick={() => {
                  onStatusChange(booking.id, "confirmed");
                  onClose();
                }}
              >
                <FaCheck /> Confirm
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90"
                onClick={() => {
                  onStatusChange(booking.id, "cancelled");
                  onClose();
                }}
              >
                <FaBan /> Cancel
              </button>
            </div>
          )}

          {booking.status === "confirmed" && (
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded bg-info py-2 px-6 font-medium text-white hover:bg-opacity-90"
                onClick={() => {
                  onStatusChange(booking.id, "completed");
                  onClose();
                }}
              >
                <FaCheckDouble /> Mark Completed
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90"
                onClick={() => {
                  onStatusChange(booking.id, "cancelled");
                  onClose();
                }}
              >
                <FaBan /> Cancel
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails; 