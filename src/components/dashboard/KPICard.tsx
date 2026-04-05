import React from 'react';
import type { LucideProps } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import { formatCurrency } from '../../utils/formatters';
import { DeltaBadge } from './DeltaBadge';
import { Sparkline } from './Sparkline';

interface KPICardProps {
  label: string;
  value: number;
  delta: number;
  icon: React.ComponentType<LucideProps>;
  sparklineData: number[];
  format: 'currency' | 'percentage';
}

export const KPICard = React.memo(function KPICard({
  label,
  value,
  delta,
  icon: Icon,
  sparklineData,
  format,
}: KPICardProps) {
  const animatedValue = useCountUp(value, 800);

  const formattedValue =
    format === 'currency' ? formatCurrency(animatedValue) : `${animatedValue.toFixed(1)}%`;

  const ariaLabel = `${label}: ${formattedValue}, ${delta >= 0 ? 'up' : 'down'} ${Math.abs(delta).toFixed(1)}% from last month`;

  return (
    <div
      className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-sm h-full flex flex-col"
      aria-label={ariaLabel}
    >
      {/* Header: Icon + Label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-teal-500/10 rounded-lg">
          <Icon size={24} className="text-teal-500" aria-hidden="true" />
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      </div>

      {/* Value + Delta Badge */}
      <div className="flex flex-wrap items-center gap-3 mb-4 min-h-[3rem]">
        <span className="text-3xl font-bold font-mono text-gray-900 dark:text-gray-100">
          {formattedValue}
        </span>
        <DeltaBadge delta={delta} />
      </div>

      {/* Sparkline */}
      <div className="mt-auto">
        <Sparkline data={sparklineData} />
      </div>
    </div>
  );
});
