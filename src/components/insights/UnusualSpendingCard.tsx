import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { InsightCard } from './InsightCard';
import { formatCurrency } from '../../utils/formatters';
import type { UnusualSpendingInsight } from '../../types';

interface UnusualSpendingCardProps {
  insight: UnusualSpendingInsight;
}

export const UnusualSpendingCard: React.FC<UnusualSpendingCardProps> = React.memo(({ insight }) => {
  const alertCount = insight.alerts.length;
  const value = alertCount > 0 ? `${alertCount} Alert${alertCount > 1 ? 's' : ''}` : 'No Alerts';
  const variant = alertCount > 0 ? 'warning' : 'default';

  const ariaLabel = `Unusual spending: ${alertCount} alert${alertCount > 1 ? 's' : ''}`;

  return (
    <InsightCard
      title="Unusual Spending Alert"
      value={value}
      variant={variant}
      ariaLabel={ariaLabel}
    >
      {alertCount > 0 ? (
        <div className="space-y-2 w-full">
          {insight.alerts.map((alert) => (
            <div
              key={alert.category}
              className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="p-1.5 bg-amber-500 rounded-full flex-shrink-0">
                  <AlertTriangle className="text-white" size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {alert.category}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatCurrency(alert.currentAmount)}{' '}
                    <span className="text-gray-400">vs avg</span>{' '}
                    {formatCurrency(alert.threeMonthAverage)}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 rounded">
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                  +{alert.percentageIncrease.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">No unusual spending detected</p>
        </div>
      )}
    </InsightCard>
  );
});
