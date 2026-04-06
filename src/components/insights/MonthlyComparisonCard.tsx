import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { InsightCard } from './InsightCard';
import { formatCurrency } from '../../utils/formatters';
import type { MonthlyComparisonInsight } from '../../types';

interface MonthlyComparisonCardProps {
  insight: MonthlyComparisonInsight;
}

export const MonthlyComparisonCard: React.FC<MonthlyComparisonCardProps> = React.memo(
  ({ insight }) => {
    const ariaLabel = `Monthly comparison: Current month income ${formatCurrency(insight.currentMonth.income)}, expenses ${formatCurrency(insight.currentMonth.expenses)}`;

    return (
      <InsightCard
        title="Monthly Comparison"
        value="Current vs Previous"
        variant="default"
        ariaLabel={ariaLabel}
      >
        <div className="space-y-3 w-full">
          {/* Income Comparison */}
          <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-navy-700/50 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Income
              </p>
              <p className="text-xl font-bold font-mono text-gray-900 dark:text-gray-100 break-words">
                {formatCurrency(insight.currentMonth.income)}
              </p>
            </div>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold flex-shrink-0 ${
                insight.deltas.incomeDelta >= 0
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}
            >
              {insight.deltas.incomeDelta >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="text-sm whitespace-nowrap">{Math.abs(insight.deltas.incomeDelta).toFixed(1)}%</span>
            </div>
          </div>

          {/* Expenses Comparison */}
          <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-navy-700/50 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Expenses
              </p>
              <p className="text-xl font-bold font-mono text-gray-900 dark:text-gray-100 break-words">
                {formatCurrency(insight.currentMonth.expenses)}
              </p>
            </div>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold flex-shrink-0 ${
                insight.deltas.expensesDelta <= 0
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}
            >
              {insight.deltas.expensesDelta >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="text-sm whitespace-nowrap">{Math.abs(insight.deltas.expensesDelta).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </InsightCard>
    );
  }
);
