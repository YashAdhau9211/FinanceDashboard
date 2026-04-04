import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useFiltersStore } from '../../stores/filtersStore';

export function SearchBar() {
  const searchQuery = useFiltersStore((state) => state.searchQuery);
  const setSearchQuery = useFiltersStore((state) => state.setSearchQuery);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleClear = () => {
    setLocalQuery('');
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="search-transactions" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Search transactions
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          id="search-transactions"
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
