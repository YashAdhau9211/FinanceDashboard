import React from 'react';

interface TimeFilterToggleProps {
  active: 3 | 6 | 12;
  onChange: (filter: 3 | 6 | 12) => void;
}

export const TimeFilterToggle = React.memo(function TimeFilterToggle({
  active,
  onChange,
}: TimeFilterToggleProps) {
  const filters: Array<3 | 6 | 12> = [3, 6, 12];

  return (
    <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700">
      {filters.map((months) => (
        <button
          key={months}
          onClick={() => onChange(months)}
          className={`
            px-3 py-1 text-sm font-medium transition-colors
            ${
              active === months
                ? 'bg-teal-700 text-white dark:bg-teal-600'
                : 'bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700'
            }
            ${months === 3 ? 'rounded-l-lg' : ''}
            ${months === 12 ? 'rounded-r-lg' : ''}
          `}
          aria-label={`Show ${months} months`}
          aria-pressed={active === months}
        >
          {months}M
        </button>
      ))}
    </div>
  );
});
