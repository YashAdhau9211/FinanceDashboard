import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { InsightCard } from './InsightCard';
import ChartErrorBoundary from './ChartErrorBoundary';
import { formatCurrency } from '../../utils/formatters';
import type { TopSpendingCategoryInsight } from '../../types';

interface TopSpendingCategoryCardProps {
  insight: TopSpendingCategoryInsight;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      category: string;
      amount: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white dark:bg-navy-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.category}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{formatCurrency(data.amount)}</p>
    </div>
  );
}

export const TopSpendingCategoryCard: React.FC<TopSpendingCategoryCardProps> = React.memo(
  ({ insight }) => {
    const value = insight.category || 'N/A';
    const description = insight.category
      ? `${formatCurrency(insight.amount)} (${insight.percentage.toFixed(1)}%)`
      : '';

    const ariaLabel = insight.category
      ? `Top spending category: ${insight.category}, ${formatCurrency(insight.amount)}`
      : 'Top spending category: No expense data available';

    return (
      <InsightCard
        title="Top Spending Category"
        value={value}
        description={description}
        variant="default"
        ariaLabel={ariaLabel}
      >
        {insight.chartData.length > 0 ? (
          <div className="w-full flex flex-col">
            <ChartErrorBoundary>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart
                  aria-label={`Donut chart showing spending breakdown by category. Top category is ${insight.category} at ${formatCurrency(insight.amount)}`}
                >
                  <Pie
                    data={insight.chartData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    animationDuration={600}
                  >
                    {insight.chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={entry.category === insight.category ? 1 : 0.6}
                        stroke={entry.category === insight.category ? '#0F2744' : 'none'}
                        strokeWidth={entry.category === insight.category ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartErrorBoundary>

            {/* Legend showing all categories */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {insight.chartData.slice(0, 4).map((entry) => (
                <div key={entry.category} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {entry.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            No expense data available
          </p>
        )}
      </InsightCard>
    );
  }
);
