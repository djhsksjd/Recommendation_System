import { Recommendation, Item } from '@/lib/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  item: Item;
}

export default function RecommendationCard({ recommendation, item }: RecommendationCardProps) {
  const algorithmColors: Record<string, string> = {
    'Collaborative Filtering': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Content-Based': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Hybrid': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {item.category}
            </span>
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="ml-4 text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {(recommendation.score * 100).toFixed(0)}%
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Score</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${algorithmColors[recommendation.algorithm] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
          {recommendation.algorithm}
        </span>
        <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.reason}</p>
      </div>
    </div>
  );
}

