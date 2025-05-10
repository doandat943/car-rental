/**
 * Component hiển thị badge trạng thái với màu sắc phù hợp
 * @param {string} status - Trạng thái hiện tại
 * @param {object} statusMap - Mapping trạng thái với nhãn và màu
 * @param {string} className - CSS class tùy chỉnh
 * 
 * statusMap nên có định dạng: {
 *   'status_key': { label: 'Status Label', color: 'color_name' },
 * }
 * 
 * Các màu hỗ trợ: green, blue, yellow, red, gray
 */
export default function StatusBadge({ status, statusMap = {}, className = '' }) {
  // Tùy chọn mặc định nếu không tìm thấy status trong statusMap
  const defaultStatus = { label: status, color: 'gray' };
  
  // Lấy thông tin trạng thái từ statusMap hoặc dùng giá trị mặc định
  const statusInfo = statusMap[status] || defaultStatus;
  
  // Tạo classes dựa trên màu
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  // Chọn class màu dựa trên color được cung cấp
  const colorClass = colorClasses[statusInfo.color] || colorClasses.gray;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass} ${className}`}>
      {statusInfo.label}
    </span>
  );
} 