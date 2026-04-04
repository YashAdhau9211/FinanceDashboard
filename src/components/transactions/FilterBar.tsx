import { SearchBar } from './SearchBar';
import { TypeFilter } from './TypeFilter';
import { CategoryFilter } from './CategoryFilter';
import { DateRangePicker } from './DateRangePicker';
import { FilterResetButton } from './FilterResetButton';

export function FilterBar() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex flex-col gap-4">
        {/* Search Bar - Full Width on all screens */}
        <div className="w-full">
          <SearchBar />
        </div>

        {/* Filter Controls - Responsive Grid: stacks on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TypeFilter />
          <CategoryFilter />
          <div className="sm:col-span-2 lg:col-span-1">
            <DateRangePicker />
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <FilterResetButton />
          </div>
        </div>
      </div>
    </div>
  );
}
