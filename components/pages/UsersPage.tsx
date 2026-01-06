'use client';

import DataTableWithPagination from '@/components/DataTableWithPagination';
import { useUsers } from '@/lib/hooks/useData';
import { User } from '@/lib/types';

export default function UsersPage() {
  const { users, loading, error } = useUsers();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Loading users...</div>
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

  const userColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'age', header: 'Age' },
    {
      key: 'preferences',
      header: 'Preferences',
      render: (user: User) => (
        <div className="flex flex-wrap gap-1">
          {user.preferences.map((pref) => (
            <span
              key={pref}
              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {pref}
            </span>
          ))}
        </div>
      ),
    },
    { key: 'totalInteractions', header: 'Interactions' },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Users</h2>
      <DataTableWithPagination
        data={users}
        columns={userColumns}
        searchFields={['name', 'email', 'id']}
        searchPlaceholder="Search users by name, email, or ID..."
        itemsPerPage={20}
      />
    </section>
  );
}

