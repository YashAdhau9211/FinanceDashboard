import { useFiltersStore } from '../../stores/filtersStore';

export function FilteredEmptyState() {
  const resetFilters = useFiltersStore((state) => state.resetFilters);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center py-12">
      <div className="flex flex-col items-center text-center">
        {/* Message */}
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No transactions match your filters
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          Try adjusting your search or filter criteria.
        </p>

        {/* Clear Filters Button */}
        <button
          onClick={resetFilters}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
