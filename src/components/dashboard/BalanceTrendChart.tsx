import React, { useState, useMemo, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyData } from '../../types';
import { formatCurrency, formatShortAmount } from '../../utils/formatters';
import { TimeFilterToggle } from './TimeFilterToggle';

interface BalanceTrendChartProps {
  data: MonthlyData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white dark:bg-navy-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <span className="text-xs text-gray-700 dark:text-gray-300">Income: {formatCurrency(payload[0]?.value || 0)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-gray-700 dark:text-gray-300">Expenses: {formatCurrency(payload[1]?.value || 0)}</span>
        </div>
      </div>
    </div>
  );
}

export const BalanceTrendChart = React.memo(function BalanceTrendChart({
  data,
}: BalanceTrendChartProps) {
  const [timeFilter, setTimeFilter] = useState<3 | 6 | 12>(12);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect and listen for dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    return data.slice(-timeFilter);
  }, [data, timeFilter]);

  // Format month labels (MMM YYYY)
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <figure>
      <div
        className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-sm"
        aria-label={`Balance trend chart showing income and expenses over ${timeFilter} months`}
      >
        {/* Header: Title + Time Filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Balance Trend</h2>
          <TimeFilterToggle active={timeFilter} onChange={setTimeFilter} />
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filteredData} key={isDarkMode ? 'dark' : 'light'}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#6B7280' : '#E5E7EB'} />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fontSize: 12, fill: isDarkMode ? '#F3F4F6' : '#374151' }}
              stroke={isDarkMode ? '#9CA3AF' : '#D1D5DB'}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={timeFilter === 12 ? 1 : 0}
            />
            <YAxis
              tickFormatter={(value) => formatShortAmount(value)}
              tick={{ fontSize: 12, fill: isDarkMode ? '#F3F4F6' : '#374151' }}
              stroke={isDarkMode ? '#9CA3AF' : '#D1D5DB'}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#14B8A6"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              animationDuration={600}
              animationEasing="ease-in-out"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#expensesGradient)"
              animationDuration={600}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">
        Balance trend showing income and expenses over the last {timeFilter} months. The chart
        displays two area series: income in teal and expenses in amber.
      </figcaption>
    </figure>
  );
});
