"use client";

import { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface DashboardStatsProps {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalCars: number;
  bookingTrend: number[];
  revenueTrend: number[];
}

const DashboardStats = ({
  totalBookings,
  totalRevenue,
  totalUsers,
  totalCars,
  bookingTrend,
  revenueTrend,
}: DashboardStatsProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#3C50E0", "#80CAEE"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
    },
    grid: {
      show: true,
      strokeDashArray: 5,
      borderColor: "#E2E8F0",
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      enabled: true,
    },
  };

  const series = [
    {
      name: "Bookings",
      data: bookingTrend,
    },
    {
      name: "Revenue ($)",
      data: revenueTrend,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {/* Total Bookings Card */}
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.7844 11 13.7844C16.0188 13.7844 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.21564 11 2.21564C5.98126 2.21564 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.40937C10.1156 6.40937 9.40937 7.11562 9.40937 8C9.40937 8.88438 10.1156 9.59063 11 9.59063C11.8844 9.59063 12.5906 8.88438 12.5906 8C12.5906 7.11562 11.8844 6.40937 11 6.40937Z"
              fill=""
            />
          </svg>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-title-md font-bold text-black dark:text-white">
              {totalBookings}
            </h4>
            <span className="text-sm font-medium">Total Bookings</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
            {bookingTrend[bookingTrend.length - 1] >
            bookingTrend[bookingTrend.length - 2]
              ? "↑"
              : "↓"}
            {Math.abs(
              ((bookingTrend[bookingTrend.length - 1] -
                bookingTrend[bookingTrend.length - 2]) /
                bookingTrend[bookingTrend.length - 2]) *
                100
            ).toFixed(1)}
            %
          </span>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <svg
            className="fill-primary dark:fill-white"
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z"
              fill=""
            />
            <path
              d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z"
              fill=""
            />
            <path
              d="M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H19.0062C19.35 2.16562 19.6593 1.85624 19.6593 1.51249C19.6593 1.16874 19.35 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 13.025 13.2H3.46873L1.71873 7.56249H14.7094L14.0219 12.3062Z"
              fill=""
            />
          </svg>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-title-md font-bold text-black dark:text-white">
              ${totalRevenue.toLocaleString()}
            </h4>
            <span className="text-sm font-medium">Total Revenue</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
            {revenueTrend[revenueTrend.length - 1] >
            revenueTrend[revenueTrend.length - 2]
              ? "↑"
              : "↓"}
            {Math.abs(
              ((revenueTrend[revenueTrend.length - 1] -
                revenueTrend[revenueTrend.length - 2]) /
                revenueTrend[revenueTrend.length - 2]) *
                100
            ).toFixed(1)}
            %
          </span>
        </div>
      </div>

      {/* Total Users Card */}
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
              fill=""
            />
            <path
              d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.1094 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
              fill=""
            />
          </svg>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-title-md font-bold text-black dark:text-white">
              {totalUsers}
            </h4>
            <span className="text-sm font-medium">Total Users</span>
          </div>
        </div>
      </div>

      {/* Total Cars Card */}
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 9.79423C7.18418 10.5249 6.63636 11.0727 5.90564 11.0727H2.86173C2.13102 11.0727 1.58319 10.5249 1.58319 9.79423V6.75032C1.58319 6.01961 2.13102 5.47179 2.86173 5.47179H5.90564C6.63636 5.47179 7.18418 6.01961 7.18418 6.75032V9.79423ZM16.1764 5.47179H13.1325C12.4018 5.47179 11.8539 6.01961 11.8539 6.75032V9.79423C11.8539 10.5249 12.4018 11.0727 13.1325 11.0727H16.1764C16.9071 11.0727 17.4549 10.5249 17.4549 9.79423V6.75032C17.4549 6.01961 16.9071 5.47179 16.1764 5.47179ZM16.1764 12.351H13.1325C12.4018 12.351 11.8539 12.8988 11.8539 13.6295V16.6735C11.8539 17.4042 12.4018 17.952 13.1325 17.952H16.1764C16.9071 17.952 17.4549 17.4042 17.4549 16.6735V13.6295C17.4549 12.8988 16.9071 12.351 16.1764 12.351ZM5.90564 12.351H2.86173C2.13102 12.351 1.58319 12.8988 1.58319 13.6295V16.6735C1.58319 17.4042 2.13102 17.952 2.86173 17.952H5.90564C6.63636 17.952 7.18418 17.4042 7.18418 16.6735V13.6295C7.18418 12.8988 6.63636 12.351 5.90564 12.351Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-title-md font-bold text-black dark:text-white">
              {totalCars}
            </h4>
            <span className="text-sm font-medium">Total Cars</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="col-span-1 md:col-span-2 xl:col-span-4">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-3 justify-between gap-4 sm:flex">
            <div>
              <h5 className="text-xl font-semibold text-black dark:text-white">
                Booking & Revenue Statistics
              </h5>
            </div>
            <div>
              <div className="relative z-20 inline-block">
                <select
                  name="#"
                  id="#"
                  className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
                >
                  <option value="">This Year</option>
                  <option value="">Last Year</option>
                </select>
                <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                      fill="#637381"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                      fill="#637381"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div>
            <div id="chartOne" className="-ml-5">
              {isClient && (
                <ReactApexChart
                  options={options}
                  series={series}
                  type="area"
                  height={350}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats; 