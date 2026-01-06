'use client';

import DataTableWithPagination from '@/components/DataTableWithPagination';
import { useInteractions } from '@/lib/hooks/useData';
import { Interaction } from '@/lib/types';
import { formatTimestamp } from '@/lib/firebase/utils';

export default function InteractionsPage() {
  const { interactions, loading, error } = useInteractions();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Loading interactions...</div>
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

  const interactionColumns = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'User ID' },
    { key: 'itemId', header: 'Item ID' },
    {
      key: 'type',
      header: 'Type',
      render: (interaction: Interaction) => {
        const colors: Record<string, string> = {
          view: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
          click: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          purchase: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          rating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
        return (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors[interaction.type] || ''}`}>
            {interaction.type}
          </span>
        );
      },
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (interaction: Interaction) =>
        interaction.rating ? (
          <span className="text-yellow-600 dark:text-yellow-400">{interaction.rating} ⭐</span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (interaction: Interaction) => formatTimestamp(interaction.timestamp),
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Interactions</h2>
      <DataTableWithPagination
        data={interactions}
        columns={interactionColumns}
        searchFields={['userId', 'itemId', 'type', 'id']}
        searchPlaceholder="Search interactions by user ID, item ID, type, or ID..."
        itemsPerPage={20}
      />
    </section>
  );
}

