'use client';

import { useState } from 'react';
import RecommendationCard from '@/components/RecommendationCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import { useRecommendations } from '@/lib/hooks/useData';
import { useUsers } from '@/lib/hooks/useData';
import { useItems } from '@/lib/hooks/useData';
import { usePagination } from '@/lib/hooks/usePagination';
import { useSearch } from '@/lib/hooks/useSearch';
import { Item } from '@/lib/types';

export default function RecommendationsPage() {
  const { recommendations, loading, error } = useRecommendations();
  const { users } = useUsers();
  const { items } = useItems();
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Filter by user if selected
  const filteredByUser = selectedUserId
    ? recommendations.filter((r) => r.userId === selectedUserId)
    : recommendations;

  // Search
  const { searchQuery, setSearchQuery, filteredData } = useSearch(filteredByUser, {
    searchFields: ['itemId', 'algorithm', 'reason'],
  });

  // Pagination
  const pagination = usePagination(filteredData, {
    itemsPerPage: 12,
    initialPage: 1,
  });

  // Get recommendations with items
  const getRecommendationsWithItems = () => {
    return pagination.paginatedData.map((rec) => {
      const item = items.find((i) => i.id === rec.itemId);
      return { recommendation: rec, item: item as Item };
    }).filter((r) => r.item);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Loading recommendations...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
      </div>
    );
  }

  const recommendationsWithItems = getRecommendationsWithItems();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Recommendations</h2>
        
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by item ID, algorithm, or reason..."
            />
          </div>
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by User:
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                pagination.goToPage(1);
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        {filteredData.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {pagination.startIndex}-{pagination.endIndex} of {pagination.totalItems} recommendations
          </div>
        )}
      </div>

      {/* Recommendations Grid */}
      {recommendationsWithItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendationsWithItems.map(({ recommendation, item }) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              itemsPerPage={pagination.itemsPerPage}
              onItemsPerPageChange={pagination.setItemsPerPage}
              totalItems={pagination.totalItems}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
            />
          )}
        </>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-500 dark:text-gray-400">No recommendations found</p>
        </div>
      )}
    </section>
  );
}

