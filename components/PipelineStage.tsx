import { RecommendationPipeline } from '@/lib/types';

interface PipelineStageProps {
  stage: RecommendationPipeline;
  index: number;
}

export default function PipelineStage({ stage, index }: PipelineStageProps) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const statusIcons = {
    completed: '✓',
    processing: '⟳',
    pending: '○',
    failed: '✗',
  };

  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${statusColors[stage.status]}`}
          >
            {statusIcons[stage.status]}
          </div>
          {index < 5 && (
            <div className="h-16 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
          )}
        </div>
        <div className="flex-1 pb-8">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{stage.stage}</h4>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[stage.status]}`}>
              {stage.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stage.description}</p>
          <div className="mt-3 flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Data: {stage.dataCount} records</span>
            <span>Duration: {stage.duration}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

