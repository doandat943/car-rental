import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

/**
 * Simple line chart component for trend visualization
 */
const SparklineChart = ({ data = [], color = 'blue', height = 40 }) => {
  if (!data || data.length < 2) return null;

  // Find min and max values to scale the chart
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;

  // Generate points for the polyline
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    // Normalize the value between 0 and height
    const y = height - ((value - minValue) / (range || 1)) * height;
    return `${x},${y}`;
  }).join(' ');

  // Use a stable ID based on color and data length for the gradient
  const gradientId = `gradient-${color}-${data.length}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={`var(--color-${color}-500)`} stopOpacity="0.3" />
          <stop offset="100%" stopColor={`var(--color-${color}-500)`} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area under the line */}
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={`url(#${gradientId})`}
      />
      
      {/* The line itself */}
      <polyline
        points={points}
        fill="none"
        stroke={`var(--color-${color}-500)`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * StatCard component for displaying key metrics with trend
 */
const StatCard = ({
  title,
  value,
  unit = '',
  icon,
  percentageChange,
  trend,
  trendData = [],
  color = 'blue', // 'blue', 'green', 'yellow', 'red'
  className,
  ...props
}) => {
  // Determine if trend is positive or negative
  const isTrendPositive = percentageChange > 0;
  const isTrendNegative = percentageChange < 0;
  
  // Map color to actual style classes
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-800',
      fill: 'fill-blue-500',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-100 dark:border-green-800',
      fill: 'fill-green-500',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-100 dark:border-yellow-800',
      fill: 'fill-yellow-500',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-100 dark:border-red-800',
      fill: 'fill-red-500',
    },
  };

  const colorClasses = colorMap[color] || colorMap.blue;
  
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          {icon && (
            <div className={cn("p-2 rounded-full", colorClasses.bg)}>
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </span>
          {unit && (
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
              {unit}
            </span>
          )}
        </div>
        
        {percentageChange !== undefined && (
          <div className="flex items-center mt-2">
            {isTrendPositive ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : isTrendNegative ? (
              <ArrowDown className="h-4 w-4 text-red-500" />
            ) : null}
            
            <span className={cn(
              "text-sm ml-1",
              isTrendPositive ? "text-green-500" : 
              isTrendNegative ? "text-red-500" : 
              "text-gray-500"
            )}>
              {Math.abs(percentageChange)}%
            </span>
            
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              {trend || 'vs last period'}
            </span>
          </div>
        )}
        
        {trendData.length > 1 && (
          <div className="mt-4">
            <SparklineChart 
              data={trendData} 
              color={color} 
              height={40} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;