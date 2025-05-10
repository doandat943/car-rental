"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';

/**
 * Biểu đồ doanh thu
 * @param {Array} data - Dữ liệu biểu đồ
 * @param {string} period - Giai đoạn (week, month, year)
 */
export default function RevenueChart({ data = [], period = 'month' }) {
  // Format dữ liệu dựa trên giai đoạn
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    // Xử lý định dạng data tùy theo giai đoạn
    return data.map(item => ({
      ...item,
      // Format giá trị X-axis dựa trên giai đoạn
      name: period === 'week' ? `Ngày ${item.day || item.date}` : 
            period === 'month' ? `Tháng ${item.month}` : 
            `Quý ${item.quarter || item.year}`,
      // Đảm bảo giá trị doanh thu là số
      value: Number(item.revenue || item.value || 0),
    }));
  }, [data, period]);

  // Format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-sm text-blue-600 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 35,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              wrapperStyle={{ paddingBottom: 10 }}
              formatter={() => period === 'week' ? 'Doanh thu theo ngày' : 
                               period === 'month' ? 'Doanh thu theo tháng' : 
                               'Doanh thu theo quý'}
            />
            <Bar 
              dataKey="value" 
              name="Doanh thu" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
              barSize={period === 'week' ? 16 : 30} 
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">Không có dữ liệu hiển thị</p>
        </div>
      )}
    </div>
  );
} 