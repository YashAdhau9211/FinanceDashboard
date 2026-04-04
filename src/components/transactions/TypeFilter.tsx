import { useFiltersStore } from '../../stores/filtersStore';
import type { TransactionType } from '../../types';

export function TypeFilter() {
  const type = useFiltersStore((state) => state.type);
  const setType = useFiltersStore((state) => state.setType);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as TransactionType | 'all');
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="type-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Transaction Type
      </label>
      <select
        id="type-filter"
        value={type}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
        <option value="transfer">Transfer</option>
      </select>
    </div>
  );
}
