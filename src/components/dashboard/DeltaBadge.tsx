import { TrendingUp, TrendingDown } from 'lucide-react';

interface DeltaBadgeProps {
  delta: number;
}

export function DeltaBadge({ delta }: DeltaBadgeProps) {
  const isPositive = delta >= 0;
  const ariaLabel = `${isPositive ? 'Up' : 'Down'} ${Math.abs(delta).toFixed(1)} percent from last month`;

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
        ${
          isPositive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
        }
      `}
      aria-label={ariaLabel}
    >
      {isPositive ? (
        <TrendingUp size={12} aria-hidden="true" />
      ) : (
        <TrendingDown size={12} aria-hidden="true" />
      )}
      {Math.abs(delta).toFixed(1)}%
    </span>
  );
}
