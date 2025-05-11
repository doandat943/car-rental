"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';

/**
 * Revenue Chart
 * @param {Array} data - Chart data
 * @param {string} period - Time period (week, month, year)
 */
export default function RevenueChart({ data = [], period = 'month' }) {
  // Format data based on period
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    // Process data format depending on period
    return data.map(item => ({
      ...item,
      // Format X-axis value based on period
      name: period === 'week' ? `Day ${item.day || item.date}` : 
            period === 'month' ? `Month ${item.month}` : 
            `Quarter ${item.quarter || item.year}`,
      // Ensure revenue value is a number
      value: Number(item.revenue || item.value || 0),
    }));
  }, [data, period]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
              formatter={() => period === 'week' ? 'Daily Revenue' : 
                               period === 'month' ? 'Monthly Revenue' : 
                               'Quarterly Revenue'}
            />
            <Bar 
              dataKey="value" 
              name="Revenue" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
              barSize={period === 'week' ? 16 : 30} 
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">No data to display</p>
        </div>
      )}
    </div>
  );
} 