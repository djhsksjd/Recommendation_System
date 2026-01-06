/**
 * Utility functions for pagination
 */

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

export function getPaginationInfo(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
): PaginationInfo {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    startIndex: startIndex + 1, // 1-based for display
    endIndex,
  };
}

export function getPageNumbers(currentPage: number, totalPages: number, maxVisible: number = 5): number[] {
  const pages: number[] = [];
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  // Adjust if we're near the start or end
  if (end - start < maxVisible - 1) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxVisible - 1);
    } else {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

