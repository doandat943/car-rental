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

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  onStatusUpdate: (bookingId: number, newStatus: string) => void;
}

const BookingDetailsModal = ({
  booking,
  onClose,
  onStatusUpdate,
}: BookingDetailsModalProps) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full overflow-auto rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:w-[40rem]">
        <div className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Booking Details - {booking.bookingNumber}
          </h3>
          <button onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* Booking Status and Payment Info */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between">
              <div>
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  ${booking.totalAmount}
                </h4>
                <p className="text-sm text-body">
                  {booking.totalDays} days @ ${booking.car.dailyPrice}/day
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
                <span
                  className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getPaymentStatusClass(
                    booking.paymentStatus
                  )}`}
                >
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Customer Information
            </h4>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full">
                <Image
                  src={booking.customer.avatar}
                  alt={booking.customer.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h5 className="text-md font-medium text-black dark:text-white">
                  {booking.customer.name}
                </h5>
                <p className="text-sm">{booking.customer.email}</p>
                <p className="text-sm">{booking.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Car Info */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Car Information
            </h4>
            <div className="flex gap-4">
              <div className="h-24 w-36">
                <Image
                  src={booking.car.image}
                  alt={booking.car.name}
                  width={144}
                  height={96}
                  className="h-full w-full rounded-sm object-cover"
                />
              </div>
              <div>
                <h5 className="text-md font-medium text-black dark:text-white">
                  {booking.car.name}
                </h5>
                <p className="text-sm">
                  {booking.car.brand} {booking.car.model} ({booking.car.year})
                </p>
                <p className="text-sm">Category: {booking.car.category}</p>
                <p className="text-sm">Daily Rate: ${booking.car.dailyPrice}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Rental Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Pickup Date
                </p>
                <p className="text-sm">{booking.startDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Return Date
                </p>
                <p className="text-sm">{booking.endDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Booking Created
                </p>
                <p className="text-sm">{booking.createdAt}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Booking Number
                </p>
                <p className="text-sm">{booking.bookingNumber}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons for Pending Bookings */}
          {booking.status === "pending" && (
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onStatusUpdate(booking.id, "active")}
                className="flex justify-center rounded bg-success py-2 px-6 font-medium text-white hover:bg-opacity-90"
              >
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={() => onStatusUpdate(booking.id, "cancelled")}
                className="flex justify-center rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90"
              >
                Cancel Booking
              </button>
            </div>
          )}

          {/* Action Button for Active Bookings */}
          {booking.status === "active" && (
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onStatusUpdate(booking.id, "completed")}
                className="flex justify-center rounded bg-success py-2 px-6 font-medium text-white hover:bg-opacity-90"
              >
                Mark as Completed
              </button>
              <button
                type="button"
                onClick={() => onStatusUpdate(booking.id, "cancelled")}
                className="flex justify-center rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90"
              >
                Cancel Booking
              </button>
            </div>
          )}

          {/* Close Button for Completed/Cancelled Bookings */}
          {(booking.status === "completed" || booking.status === "cancelled") && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal; 