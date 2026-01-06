'use client';

import { useState } from 'react';
import OverviewPage from '@/components/pages/OverviewPage';
import UsersPage from '@/components/pages/UsersPage';
import ItemsPage from '@/components/pages/ItemsPage';
import InteractionsPage from '@/components/pages/InteractionsPage';
import RecommendationsPage from '@/components/pages/RecommendationsPage';

type Tab = 'overview' | 'users' | 'items' | 'interactions' | 'recommendations';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'items', label: 'Items' },
    { id: 'interactions', label: 'Interactions' },
    { id: 'recommendations', label: 'Recommendations' },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'users':
        return <UsersPage />;
      case 'items':
        return <ItemsPage />;
      case 'interactions':
        return <InteractionsPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recommendation System Dashboard
            </h1>
            <nav className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {renderPage()}
      </main>
    </div>
  );
}
