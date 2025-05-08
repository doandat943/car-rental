"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

export default function DataTable({
  data = [],
  columns = [],
  searchable = false,
  pagination = false,
  itemsPerPage = 10,
  currentPage = 1,
  totalItems = 0,
  onPageChange,
  actions,
  emptyMessage = "Không có dữ liệu",
  loading = false,
}) {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(currentPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

  // Cập nhật khi data thay đổi
  useEffect(() => {
    if (searchable && searchTerm) {
      filterData(searchTerm);
    } else {
      setFilteredData(data);
    }
  }, [data, searchable, searchTerm]);

  // Cập nhật khi currentPage thay đổi từ props
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  // Lọc dữ liệu khi tìm kiếm
  const filterData = (term) => {
    if (!term.trim()) {
      setFilteredData(data);
      return;
    }

    const lowercasedTerm = term.toLowerCase();
    const filtered = data.filter(item => {
      return columns.some(column => {
        // Bỏ qua những cột có cell là function
        if (typeof column.cell === 'function') {
          return false;
        }
        
        const value = item[column.key];
        if (value === null || value === undefined) {
          return false;
        }
        
        return String(value).toLowerCase().includes(lowercasedTerm);
      });
    });
    
    setFilteredData(filtered);
  };

  // Xử lý khi thay đổi tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterData(term);
  };

  // Xử lý khi thay đổi trang
  const handlePageChange = (newPage) => {
    if (onPageChange) {
      // Sử dụng onPageChange từ props nếu được cung cấp
      onPageChange(newPage);
    } else {
      // Xử lý phân trang nội bộ nếu không có onPageChange
      setPage(newPage);
    }
  };

  // Xử lý sắp xếp
  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 
                 sortConfig.direction === 'desc' ? 'none' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };

  // Sắp xếp dữ liệu
  const sortedData = () => {
    if (sortConfig.direction === 'none' || !sortConfig.key) {
      return filteredData;
    }
    
    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      
      if (valA === valB) return 0;
      
      const comparison = valA > valB ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  };

  // Tính toán số trang
  const totalPages = onPageChange 
    ? Math.ceil(totalItems / itemsPerPage) 
    : Math.ceil(filteredData.length / itemsPerPage);

  // Trang hiện tại không thể lớn hơn tổng số trang
  const currentPageSafe = Math.min(page, Math.max(1, totalPages)) || 1;

  // Lấy dữ liệu cho trang hiện tại
  const paginatedData = onPageChange
    ? sortedData() // Khi sử dụng onPageChange, dữ liệu đã được phân trang từ server
    : pagination
      ? sortedData().slice(
          (currentPageSafe - 1) * itemsPerPage,
          currentPageSafe * itemsPerPage
        )
      : sortedData();

  return (
    <div className="w-full">
      {/* Header với tìm kiếm và actions */}
      {(searchable || actions) && (
        <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200 dark:border-gray-700">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-8 max-w-xs"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable !== false && sortConfig.key === column.key && (
                      <span className="text-gray-400">
                        {sortConfig.direction === 'asc' ? ' ▲' : 
                         sortConfig.direction === 'desc' ? ' ▼' : ''}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {loading && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td colSpan={columns.length} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent mb-4"></div>
                    <p>Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            )}
            
            {!loading && paginatedData.length === 0 && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td colSpan={columns.length} className="px-6 py-10 text-center">
                  {emptyMessage}
                </td>
              </tr>
            )}
            
            {!loading && paginatedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {column.cell ? column.cell(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {pagination && totalPages > 1 && (
        <div className="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {onPageChange ? (
              // Hiển thị thông tin phân trang từ server
              `Hiển thị ${((currentPageSafe - 1) * itemsPerPage) + 1} đến ${Math.min(currentPageSafe * itemsPerPage, totalItems)} trong tổng số ${totalItems} bản ghi`
            ) : (
              // Hiển thị thông tin phân trang local
              `Hiển thị ${((currentPageSafe - 1) * itemsPerPage) + 1} đến ${Math.min(currentPageSafe * itemsPerPage, filteredData.length)} trong tổng số ${filteredData.length} bản ghi`
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPageSafe - 1)}
              disabled={currentPageSafe <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Hiển thị 5 nút trang gần trang hiện tại */}
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Tính toán số trang để hiển thị cân đối xung quanh trang hiện tại
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPageSafe <= 3) {
                pageToShow = i + 1;
              } else if (currentPageSafe >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPageSafe - 2 + i;
              }
              
              // Chỉ hiển thị nút nếu pageToShow nằm trong phạm vi hợp lệ
              if (pageToShow > 0 && pageToShow <= totalPages) {
                return (
                  <Button
                    key={pageToShow}
                    variant={currentPageSafe === pageToShow ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageToShow)}
                  >
                    {pageToShow}
                  </Button>
                );
              }
              
              return null;
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPageSafe + 1)}
              disabled={currentPageSafe >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}