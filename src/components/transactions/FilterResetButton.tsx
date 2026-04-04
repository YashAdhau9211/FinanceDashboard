import { useFiltersStore } from '../../stores/filtersStore';

export function FilterResetButton() {
  const { searchQuery, type, category, dateRange, resetFilters } = useFiltersStore();

  // Calculate active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (type !== 'all') count++;
    if (category !== 'all') count++;
    if (dateRange.start || dateRange.end) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();
  const isDisabled = activeCount === 0;

  return (
    <button
      onClick={resetFilters}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${
          isDisabled
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }
        flex items-center gap-2
      `}
    >
      Clear Filters
      {activeCount > 0 && (
        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-teal-600 dark:bg-teal-500 rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  );
}
