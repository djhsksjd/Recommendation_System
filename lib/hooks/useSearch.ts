import { useState, useMemo } from 'react';

export interface UseSearchOptions<T> {
  searchFields?: (keyof T)[];
  caseSensitive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSearch<T extends Record<string, any>>(
  data: T[],
  options: UseSearchOptions<T> = {}
) {
  const { searchFields, caseSensitive = false } = options;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = caseSensitive ? searchQuery : searchQuery.toLowerCase();

    return data.filter((item) => {
      if (searchFields && searchFields.length > 0) {
        // Search only in specified fields
        return searchFields.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          const stringValue = String(value);
          return caseSensitive ? stringValue.includes(query) : stringValue.toLowerCase().includes(query);
        });
      } else {
        // Search in all string fields
        return Object.values(item).some((value) => {
          if (value === null || value === undefined) return false;
          if (typeof value === 'string') {
            return caseSensitive ? value.includes(query) : value.toLowerCase().includes(query);
          }
          if (Array.isArray(value)) {
            return value.some((v) => {
              const str = String(v);
              return caseSensitive ? str.includes(query) : str.toLowerCase().includes(query);
            });
          }
          return false;
        });
      }
    });
  }, [data, searchQuery, searchFields, caseSensitive]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    hasResults: filteredData.length > 0,
    resultCount: filteredData.length,
  };
}

