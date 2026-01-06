'use client';

import DataTableWithPagination from '@/components/DataTableWithPagination';
import { useItems } from '@/lib/hooks/useData';
import { Item } from '@/lib/types';

export default function ItemsPage() {
  const { items, loading, error } = useItems();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Loading items...</div>
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

  const itemColumns = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Title' },
    { key: 'category', header: 'Category' },
    {
      key: 'tags',
      header: 'Tags',
      render: (item: Item) => (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (item: Item) => `$${item.price.toFixed(2)}`,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (item: Item) => (
        <span className="font-semibold text-yellow-600 dark:text-yellow-400">{item.rating} ⭐</span>
      ),
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Items</h2>
      <DataTableWithPagination
        data={items}
        columns={itemColumns}
        searchFields={['title', 'category', 'id']}
        searchPlaceholder="Search items by title, category, or ID..."
        itemsPerPage={20}
      />
    </section>
  );
}

