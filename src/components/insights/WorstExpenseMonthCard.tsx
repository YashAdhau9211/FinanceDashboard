import React from 'react';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { InsightCard } from './InsightCard';
import { formatCurrency } from '../../utils/formatters';
import type { WorstExpenseMonthInsight } from '../../types';

interface WorstExpenseMonthCardProps {
  insight: WorstExpenseMonthInsight;
}

export const WorstExpenseMonthCard: React.FC<WorstExpenseMonthCardProps> = React.memo(
  ({ insight }) => {
    const hasData = insight.month !== null && insight.year !== null;
    const value = hasData ? `${insight.month} ${insight.year}` : 'No data';
    const description = hasData ? formatCurrency(insight.amount) : '';
    const variant = insight.hasOverspend ? 'danger' : 'warning';
    const ariaLabel = hasData
      ? `Worst expense month: ${insight.month} ${insight.year}, ${formatCurrency(insight.amount)}${insight.hasOverspend ? ', expenses exceeded income' : ''}`
      : 'Worst expense month: No data available';

    return (
      <InsightCard
        title="Worst Expense Month"
        value={value}
        description={description}
        variant={variant}
        ariaLabel={ariaLabel}
      >
        {hasData ? (
          <div className="flex flex-col gap-4 w-full">
            {/* Small bar chart showing expense trend */}
            <div className="w-full h-24 px-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={insight.monthlyData || []}
                  aria-label="Monthly expense trend bar chart"
                >
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    stroke="#9CA3AF"
                    tickLine={false}
                  />
                  <Bar
                    dataKey="amount"
                    fill={insight.hasOverspend ? '#EF4444' : '#F59E0B'}
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stats section */}
            <div className="space-y-3">
              {/* Overspend warning or expense indicator */}
              {insight.hasOverspend ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
                  <div className="p-1.5 bg-red-500 rounded-full">
                    <AlertTriangle className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Critical Alert
                    </div>
                    <div className="text-sm font-bold text-red-700 dark:text-red-300">
                      Expenses exceeded income
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <div className="p-1.5 bg-amber-500 rounded-full">
                    <TrendingDown className="text-white" size={16} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      Highest Spending Period
                    </div>
                    <div className="text-sm font-bold text-amber-700 dark:text-amber-300">
                      Monitor carefully
                    </div>
                  </div>
                </div>
              )}

              {/* Additional context */}
              <div className="text-center px-3 py-2 bg-gray-50 dark:bg-navy-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {insight.hasOverspend ? 'Budget exceeded this month' : 'Peak expense period'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500 dark:text-gray-400">No expense data available</p>
          </div>
        )}
      </InsightCard>
    );
  }
);
