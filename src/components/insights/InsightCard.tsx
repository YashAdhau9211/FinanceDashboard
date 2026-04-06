import React from 'react';

interface InsightCardProps {
  title: string;
  value: string | React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  ariaLabel?: string;
}

const variantStyles = {
  default: {
    bg: 'bg-white dark:bg-navy-800',
    border: 'border-gray-200 dark:border-gray-700',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-700',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-700',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-700',
  },
};

export const InsightCard: React.FC<InsightCardProps> = React.memo(
  ({ title, value, description, children, variant = 'default', ariaLabel }) => {
    const styles = variantStyles[variant];

    return (
      <div
        className={`${styles.bg} ${styles.border} border rounded-lg p-6 shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-teal-500 focus-within:outline-none insight-card h-[380px] flex flex-col`}
        aria-label={ariaLabel}
        tabIndex={0}
      >
        <div className="flex-shrink-0">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            {title}
          </h3>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-mono break-words overflow-wrap-anywhere">
            {value}
          </div>
          {description && <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{description}</p>}
        </div>
        {children && (
          <div className="mt-4 flex-grow flex flex-col justify-center overflow-hidden">
            {children}
          </div>
        )}
      </div>
    );
  }
);
