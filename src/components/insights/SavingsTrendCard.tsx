import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { InsightCard } from './InsightCard';
import ChartErrorBoundary from './ChartErrorBoundary';
import type { SavingsTrendInsight } from '../../types';

interface SavingsTrendCardProps {
  insight: SavingsTrendInsight;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      month: string;
      savingsRate: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white dark:bg-navy-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.month}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Savings Rate: {data.savingsRate.toFixed(1)}%
      </p>
    </div>
  );
}

export const SavingsTrendCard: React.FC<SavingsTrendCardProps> = React.memo(({ insight }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fontSize = isMobile ? 10 : 12;
  const value = `${insight.currentSavingsRate.toFixed(1)}%`;
  const description = `6-month avg: ${insight.sixMonthAverage.toFixed(1)}%`;
  const variant = insight.currentSavingsRate >= 0 ? 'success' : 'danger';
  const ariaLabel = `Savings trend: current rate ${insight.currentSavingsRate.toFixed(1)}%, 6-month average ${insight.sixMonthAverage.toFixed(1)}%`;

  return (
    <InsightCard
      title="Savings Trend"
      value={value}
      description={description}
      variant={variant}
      ariaLabel={ariaLabel}
    >
      <div className="w-full h-full">
        <ChartErrorBoundary>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={insight.monthlyData}
              aria-label={`Line chart showing 12-month savings trend. Current savings rate is ${insight.currentSavingsRate.toFixed(1)}%, 6-month average is ${insight.sixMonthAverage.toFixed(1)}%`}
            >
              <defs>
                <linearGradient id="positiveZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="negativeZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                dataKey="month"
                tick={{ fontSize, fill: '#6B7280' }}
                stroke="#9CA3AF"
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize, fill: '#6B7280' }}
                stroke="#9CA3AF"
                tickLine={false}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceArea y1={0} y2={"dataMax" as any} fill="url(#positiveZone)" ifOverflow="extendDomain" />
              <ReferenceArea y1={"dataMin" as any} y2={0} fill="url(#negativeZone)" ifOverflow="extendDomain" />
              <Line
                type="monotone"
                dataKey="savingsRate"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ fill: '#10B981', r: 3, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5 }}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartErrorBoundary>
      </div>
    </InsightCard>
  );
});
