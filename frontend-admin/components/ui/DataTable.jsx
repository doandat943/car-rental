"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, MoreHorizontal, Search, Filter } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

const DataTable = ({
  data = [],
  columns = [],
  onRowClick,
  searchable = false,
  sortable = true,
  pagination = true,
  itemsPerPage = 10,
  actions,
  emptyMessage = "No data available",
  className,
  ...props
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Sort data
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);
  
  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return sortedData;
    
    return sortedData.filter(row => {
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sortedData, searchTerm]);
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = React.useMemo(() => {
    if (!pagination) return filteredData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, pagination, itemsPerPage]);
  
  // Handle row selection
  const handleSelectRow = (rowId) => {
    setSelectedRows(prev => {
      if (prev.includes(rowId)) {
        return prev.filter(id => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };
  
  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(row => row.id));
    }
  };
  
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="ml-1 h-4 w-4" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4" />
      : <ChevronDown className="ml-1 h-4 w-4" />;
  };
  
  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Table toolbar */}
      {(searchable || actions) && (
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          {searchable && (
            <div className="relative w-full md:w-auto mb-2 md:mb-0">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Table container */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  scope="col" 
                  className={cn(
                    "px-6 py-3", 
                    column.className,
                    sortable && column.sortable !== false ? "cursor-pointer select-none" : ""
                  )}
                  onClick={() => {
                    if (sortable && column.sortable !== false) {
                      handleSort(column.key);
                    }
                  }}
                >
                  <div className="flex items-center">
                    {column.header}
                    {sortable && column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex}
                  className={cn(
                    "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
                    onRowClick ? "cursor-pointer" : ""
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      {column.cell 
                        ? column.cell(row) 
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {pagination && totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 mt-4">
          <div className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span> of{' '}
            <span className="font-medium">{filteredData.length}</span> results
          </div>
          
          <div className="inline-flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pagination centered around current page
              let pageNum = currentPage;
              if (currentPage < 3) {
                pageNum = i + 1;
              } else if (currentPage > totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              }
              return null;
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable; 