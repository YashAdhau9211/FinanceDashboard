import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { useFiltersStore } from '../../stores/filtersStore';
import { formatCurrency, formatShortAmount } from '../../utils/formatters';
import type { CategoryData } from '../../stores/selectors/categoryBreakdownSelector';

interface SpendingDonutProps {
  data: CategoryData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CategoryData;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white dark:bg-navy-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-medium mb-1 capitalize">{data.category}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {formatCurrency(data.amount)} ({data.percentage.toFixed(1)}%)
      </p>
    </div>
  );
};

const SpendingDonut: React.FC<SpendingDonutProps> = ({ data }) => {
  const navigate = useNavigate();
  const setCategory = useFiltersStore((state) => state.setCategory);

  // Compute total MTD expenses
  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);

  // Handle segment click - navigate to transactions with category filter
  const handleSegmentClick = (data: { payload?: CategoryData } & Partial<CategoryData>) => {
    // Recharts passes the data item with payload property
    const entry = data.payload || data;
    if (entry.category) {
      setCategory(entry.category);
      navigate('/transactions');
    }
  };

  // Handle keyboard navigation for segments
  const handleKeyDown = (event: React.KeyboardEvent, entry: CategoryData) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setCategory(entry.category);
      navigate('/transactions');
    }
  };

  return (
    <figure>
      <div
        className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-sm"
        aria-label="Spending breakdown donut chart showing expenses by category"
      >
        <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Spending Breakdown
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              onClick={handleSegmentClick}
              animationDuration={600}
              animationEasing="ease-in-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
                  aria-label={`${entry.category}: ${formatCurrency(entry.amount)} (${entry.percentage.toFixed(1)}%)`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, entry)}
                />
              ))}
              <Label
                value={`₹${formatShortAmount(totalExpenses).replace('₹', '')}`}
                position="center"
                className="text-2xl font-bold fill-gray-900 dark:fill-gray-100"
                style={{ fontSize: '24px', fontWeight: 'bold' }}
              />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize truncate">
                {item.category}: {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="sr-only">
        Spending breakdown showing expenses by category. Total expenses: {formatCurrency(totalExpenses)}.
        {data.length > 0 && ` Top category: ${data[0].category} at ${data[0].percentage.toFixed(1)}%.`}
      </figcaption>
    </figure>
  );
};

export default memo(SpendingDonut);
