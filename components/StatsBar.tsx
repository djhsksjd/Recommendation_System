interface StatsBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  showPercentage?: boolean;
}

export default function StatsBar({
  label,
  value,
  max,
  color = 'bg-blue-600',
  showPercentage = true,
}: StatsBarProps) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {showPercentage && (
          <span className="text-gray-600 dark:text-gray-400">{percentage.toFixed(1)}%</span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

