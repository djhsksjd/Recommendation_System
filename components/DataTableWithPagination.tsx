'use client';

import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import { usePagination } from '@/lib/hooks/usePagination';
import { useSearch } from '@/lib/hooks/useSearch';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableWithPaginationProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  emptyMessage?: string;
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  itemsPerPage?: number;
  showSearch?: boolean;
  showPagination?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTableWithPagination<T extends Record<string, any>>({
  data,
  columns,
  title,
  emptyMessage = 'No data available',
  searchFields,
  searchPlaceholder = 'Search...',
  itemsPerPage: initialItemsPerPage = 10,
  showSearch = true,
  showPagination = true,
}: DataTableWithPaginationProps<T>) {
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Search
  const { searchQuery, setSearchQuery, filteredData } = useSearch(data, { searchFields });

  // Pagination
  const pagination = usePagination(filteredData, {
    itemsPerPage,
    initialPage: 1,
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    if (searchQuery && pagination.currentPage !== 1) {
      pagination.goToPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={searchPlaceholder}
            />
          </div>
          {searchQuery && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Found {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={showPagination ? pagination.paginatedData : filteredData}
        columns={columns}
        title={title}
        emptyMessage={emptyMessage}
      />

      {/* Pagination */}
      {showPagination && filteredData.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={pagination.totalItems}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
        />
      )}
    </div>
  );
}

