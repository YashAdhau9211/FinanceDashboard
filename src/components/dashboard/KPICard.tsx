import React from 'react';
import { Edit2 } from 'lucide-react';
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
  showEditButton?: boolean;
}

export const KPICard = React.memo(function KPICard({
  label,
  value,
  delta,
  icon: Icon,
  sparklineData,
  format,
  showEditButton = false,
}: KPICardProps) {
  const animatedValue = useCountUp(value, 800);

  const formattedValue =
    format === 'currency' ? formatCurrency(animatedValue) : `${animatedValue.toFixed(1)}%`;

  const ariaLabel = `${label}: ${formattedValue}, ${delta >= 0 ? 'up' : 'down'} ${Math.abs(delta).toFixed(1)}% from last month`;

  return (
    <div
      className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-sm opacity-0 translate-y-4 transition-all duration-300 kpi-card"
      aria-label={ariaLabel}
    >
      {/* Header: Icon + Label + Edit Button (Admin) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <Icon size={24} className="text-teal-500" aria-hidden="true" />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        </div>
        {showEditButton && (
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
            aria-label={`Edit ${label}`}
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>

      {/* Value + Delta Badge */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-bold font-mono text-gray-900 dark:text-gray-100">
          {formattedValue}
        </span>
        <DeltaBadge delta={delta} />
      </div>

      {/* Sparkline */}
      <Sparkline data={sparklineData} />
    </div>
  );
});
