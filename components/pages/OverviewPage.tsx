'use client';

import MetricsCard from '@/components/MetricsCard';
import PipelineStage from '@/components/PipelineStage';
import RecommendationCard from '@/components/RecommendationCard';
import StatsBar from '@/components/StatsBar';
import { useSystemMetrics } from '@/lib/hooks/useData';
import { usePipelineStages } from '@/lib/hooks/useData';
import { useRecommendations } from '@/lib/hooks/useData';
import { useItems } from '@/lib/hooks/useData';
import { Item } from '@/lib/types';

export default function OverviewPage() {
  const { metrics, loading: metricsLoading } = useSystemMetrics();
  const { stages, loading: stagesLoading } = usePipelineStages();
  const { recommendations, loading: recsLoading } = useRecommendations();
  const { items, loading: itemsLoading } = useItems();

  const loading = metricsLoading || stagesLoading || recsLoading || itemsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Loading overview...</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Fetching data from Firebase</div>
        </div>
      </div>
    );
  }

  // Default metrics if not available
  const systemMetrics = metrics || {
    totalUsers: 0,
    totalItems: 0,
    totalInteractions: 0,
    totalRecommendations: recommendations.length,
    averageRating: 0,
    clickThroughRate: 0,
    conversionRate: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
  };

  // Get recent recommendations with items
  const recentRecommendations = recommendations
    .slice(0, 4)
    .map((rec) => {
      const item = items.find((i) => i.id === rec.itemId);
      return { recommendation: rec, item: item as Item };
    })
    .filter((r) => r.item);

  return (
    <div className="space-y-8">
      {/* System Metrics */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">System Overview</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total Users"
            value={systemMetrics.totalUsers}
            subtitle="Active users in system"
          />
          <MetricsCard
            title="Total Items"
            value={systemMetrics.totalItems}
            subtitle="Items in catalog"
          />
          <MetricsCard
            title="Total Interactions"
            value={systemMetrics.totalInteractions}
            subtitle="User-item interactions"
          />
          <MetricsCard
            title="Recommendations"
            value={systemMetrics.totalRecommendations}
            subtitle="Generated recommendations"
          />
        </div>
      </section>

      {/* Performance Metrics */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Performance Metrics</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Model Performance</h3>
            <div className="space-y-4">
              <StatsBar
                label="Precision"
                value={systemMetrics.precision}
                max={1}
                color="bg-green-600"
              />
              <StatsBar
                label="Recall"
                value={systemMetrics.recall}
                max={1}
                color="bg-blue-600"
              />
              <StatsBar
                label="F1 Score"
                value={systemMetrics.f1Score}
                max={1}
                color="bg-purple-600"
              />
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Business Metrics</h3>
            <div className="space-y-4">
              <StatsBar
                label="Click-Through Rate"
                value={systemMetrics.clickThroughRate}
                max={1}
                color="bg-indigo-600"
              />
              <StatsBar
                label="Conversion Rate"
                value={systemMetrics.conversionRate}
                max={1}
                color="bg-yellow-600"
              />
              <div className="pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average Rating: <span className="font-semibold">{systemMetrics.averageRating}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation Pipeline */}
      {stages.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Recommendation Pipeline</h2>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="space-y-4">
              {stages.map((stage, index) => (
                <PipelineStage key={stage.stage || index} stage={stage} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Recommendations */}
      {recentRecommendations.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Recent Recommendations</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recentRecommendations.map(({ recommendation, item }) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

