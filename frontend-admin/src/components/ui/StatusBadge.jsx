/**
 * Component to display status badges with appropriate colors
 * @param {string} status - Current status
 * @param {object} statusMap - Mapping of status to label and color
 * @param {string} className - Custom CSS class
 * 
 * statusMap should have the format: {
 *   'status_key': { label: 'Status Label', color: 'color_name' },
 * }
 * 
 * Supported colors: green, blue, yellow, red, gray
 */
export default function StatusBadge({ status, statusMap = {}, className = '' }) {
  // Default option if status is not found in statusMap
  const defaultStatus = { label: status, color: 'gray' };
  
  // Get status info from statusMap or use default value
  const statusInfo = statusMap[status] || defaultStatus;
  
  // Create classes based on color
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  // Choose color class based on provided color
  const colorClass = colorClasses[statusInfo.color] || colorClasses.gray;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass} ${className}`}>
      {statusInfo.label}
    </span>
  );
} 