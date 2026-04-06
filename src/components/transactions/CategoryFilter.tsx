import { useFiltersStore } from '../../stores/filtersStore';
import { useCategoriesStore } from '../../stores/categoriesStore';
import type { Category } from '../../types';

export function CategoryFilter() {
  const category = useFiltersStore((state) => state.category);
  const setCategory = useFiltersStore((state) => state.setCategory);
  const getAllCategories = useCategoriesStore((state) => state.getAllCategories);
  const allCategories = getAllCategories();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as Category | 'all');
  };

  // Capitalize first letter for display
  const formatCategory = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="category-filter"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Category
      </label>
      <select
        id="category-filter"
        value={category}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="all">All Categories</option>
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>
            {formatCategory(cat)}
          </option>
        ))}
      </select>
    </div>
  );
}
