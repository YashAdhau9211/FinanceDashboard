import { useRoleStore } from '../../stores/roleStore';
import { TransactionRow } from './TransactionRow.tsx';
import { TransactionCard } from './TransactionCard.tsx';
import { SortableHeader } from './SortableHeader.tsx';
import { useFiltersStore } from '../../stores/filtersStore';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { FilteredEmptyState } from './FilteredEmptyState';
import type { Transaction } from '../../types';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onAddTransaction: () => void;
}

export function TransactionTable({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  onAddTransaction,
}: TransactionTableProps) {
  const role = useRoleStore((state) => state.role);
  const sortField = useFiltersStore((state) => state.sortField);
  const sortDir = useFiltersStore((state) => state.sortDir);
  const setSortField = useFiltersStore((state) => state.setSortField);
  const setSortDir = useFiltersStore((state) => state.setSortDir);

  // Check if any filters are active
  const searchQuery = useFiltersStore((state) => state.searchQuery);
  const type = useFiltersStore((state) => state.type);
  const category = useFiltersStore((state) => state.category);
  const dateRange = useFiltersStore((state) => state.dateRange);
  const hasActiveFilters =
    searchQuery !== '' ||
    type !== 'all' ||
    category !== 'all' ||
    dateRange.start !== null ||
    dateRange.end !== null;

  // Handle sort logic
  const handleSort = (field: 'date' | 'amount' | 'description') => {
    if (sortField !== field) {
      // First click on this column: set to ascending
      setSortField(field);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      // Second click: set to descending
      setSortDir('desc');
    } else {
      // Third click: reset to default (date desc)
      setSortField('date');
      setSortDir('desc');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="transition-opacity duration-150">
        <SkeletonLoader />
      </div>
    );
  }

  // Show empty state when no transactions and no filters
  if (transactions.length === 0 && !hasActiveFilters) {
    return (
      <div className="transition-opacity duration-150">
        <EmptyState onAddTransaction={onAddTransaction} />
      </div>
    );
  }

  // Show filtered empty state when no results with active filters
  if (transactions.length === 0 && hasActiveFilters) {
    return (
      <div className="transition-opacity duration-150">
        <FilteredEmptyState />
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-opacity duration-150">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <SortableHeader
                field="date"
                label="DATE"
                currentSortField={sortField}
                currentSortDir={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                field="description"
                label="DESCRIPTION"
                currentSortField={sortField}
                currentSortDir={sortDir}
                onSort={handleSort}
              />
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
              >
                CATEGORY
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
              >
                TYPE
              </th>
              <SortableHeader
                field="amount"
                label="AMOUNT"
                currentSortField={sortField}
                currentSortDir={sortDir}
                onSort={handleSort}
              />
              {role === 'ADMIN' && (
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  ACTIONS
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                isEven={index % 2 === 0}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (visible only on mobile) */}
      <div className="md:hidden space-y-3 transition-opacity duration-150">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}
