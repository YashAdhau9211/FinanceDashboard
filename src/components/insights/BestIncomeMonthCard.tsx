import React from 'react';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { InsightCard } from './InsightCard';
import { formatCurrency } from '../../utils/formatters';
import type { BestIncomeMonthInsight } from '../../types';

interface BestIncomeMonthCardProps {
  insight: BestIncomeMonthInsight;
}

export const BestIncomeMonthCard: React.FC<BestIncomeMonthCardProps> = React.memo(({ insight }) => {
  const hasData = insight.month !== null && insight.year !== null;
  const value = hasData ? `${insight.month} ${insight.year}` : 'No data';
  const description = hasData ? formatCurrency(insight.amount) : '';
  const ariaLabel = hasData
    ? `Best income month: ${insight.month} ${insight.year}, ${formatCurrency(insight.amount)}`
    : 'Best income month: No data available';

  return (
    <InsightCard
      title="Best Income Month"
      value={value}
      description={description}
      variant="success"
      ariaLabel={ariaLabel}
    >
      {hasData ? (
        <div className="flex flex-col gap-4 w-full">
          {/* Small bar chart showing income trend */}
          <div className="w-full h-24 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={insight.monthlyData || []}
                aria-label="Monthly income trend bar chart"
              >
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  stroke="#9CA3AF"
                  tickLine={false}
                />
                <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats section */}
          <div className="space-y-3">
            {/* Percentage change badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <div className="p-1.5 bg-green-500 rounded-full">
                <TrendingUp className="text-white" size={16} />
              </div>
              <div className="text-center">
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  vs Previous Month
                </div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  +{insight.percentageChange.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Additional context */}
            <div className="text-center px-3 py-2 bg-gray-50 dark:bg-navy-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your highest earning period
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-gray-500 dark:text-gray-400">No income data available</p>
        </div>
      )}
    </InsightCard>
  );
});
