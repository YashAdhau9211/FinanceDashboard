import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFiltersStore } from '../../stores/filtersStore';

export function DateRangePicker() {
  const dateRange = useFiltersStore((state) => state.dateRange);
  const setDateRange = useFiltersStore((state) => state.setDateRange);
  const [error, setError] = useState<string | null>(null);

  // Get today's date in YYYY-MM-DD format for max attribute
  const today = new Date().toISOString().split('T')[0];

  // Validate date range whenever it changes
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      if (endDate < startDate) {
        setError('End date cannot be before start date');
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  }, [dateRange.start, dateRange.end]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(e.target.value || null, dateRange.end);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(dateRange.start, e.target.value || null);
  };

  const handleClearStart = () => {
    setDateRange(null, dateRange.end);
  };

  const handleClearEnd = () => {
    setDateRange(dateRange.start, null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Start Date */}
        <div className="flex flex-col gap-1 flex-1">
          <label
            htmlFor="date-start"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Start Date
          </label>
          <div className="relative">
            <input
              id="date-start"
              type="date"
              value={dateRange.start || ''}
              onChange={handleStartChange}
              max={today}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {dateRange.start && (
              <button
                onClick={handleClearStart}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label="Clear start date"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1 flex-1">
          <label
            htmlFor="date-end"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            End Date
          </label>
          <div className="relative">
            <input
              id="date-end"
              type="date"
              value={dateRange.end || ''}
              onChange={handleEndChange}
              max={today}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {dateRange.end && (
              <button
                onClick={handleClearEnd}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label="Clear end date"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {error && (
        <div role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
