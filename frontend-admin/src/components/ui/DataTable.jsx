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
  emptyMessage = "No data available",
  loading = false,
}) {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(currentPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

  // Update when data changes
  useEffect(() => {
    if (searchable && searchTerm) {
      filterData(searchTerm);
    } else {
      setFilteredData(data);
    }
  }, [data, searchable, searchTerm]);

  // Update when currentPage changes from props
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  // Filter data when searching
  const filterData = (term) => {
    if (!term.trim()) {
      setFilteredData(data);
      return;
    }

    const lowercasedTerm = term.toLowerCase();
    const filtered = data.filter(item => {
      return columns.some(column => {
        // Skip columns with function cells
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

  // Handle search changes
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterData(term);
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (onPageChange) {
      // Use onPageChange from props if provided
      onPageChange(newPage);
    } else {
      // Handle internal pagination if no onPageChange
      setPage(newPage);
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 
                 sortConfig.direction === 'desc' ? 'none' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };

  // Sort data
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

  // Calculate total pages
  const totalPages = onPageChange 
    ? Math.ceil(totalItems / itemsPerPage) 
    : Math.ceil(filteredData.length / itemsPerPage);

  // Current page cannot be greater than total pages
  const currentPageSafe = Math.min(page, Math.max(1, totalPages)) || 1;

  // Get data for current page
  const paginatedData = onPageChange
    ? sortedData() // When using onPageChange, data is already paginated from server
    : pagination
      ? sortedData().slice(
          (currentPageSafe - 1) * itemsPerPage,
          currentPageSafe * itemsPerPage
        )
      : sortedData();

  return (
    <div className="w-full">
      {/* Header with search and actions */}
      {(searchable || actions) && (
        <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200 dark:border-gray-700">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-8 max-w-xs"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}

      {/* Table data */}
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
                    <p>Loading data...</p>
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

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {onPageChange ? (
              // Display server-side pagination info
              `Showing ${((currentPageSafe - 1) * itemsPerPage) + 1} to ${Math.min(currentPageSafe * itemsPerPage, totalItems)} of ${totalItems} records`
            ) : (
              // Display client-side pagination info
              `Showing ${((currentPageSafe - 1) * itemsPerPage) + 1} to ${Math.min(currentPageSafe * itemsPerPage, filteredData.length)} of ${filteredData.length} records`
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
            
            {/* Display 5 page buttons around current page */}
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Calculate page to show to balance around current page
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
              
              // Only display button if pageToShow is within valid range
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