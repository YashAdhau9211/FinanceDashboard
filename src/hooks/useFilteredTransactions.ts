import { useMemo } from 'react';
import { useTransactionsStore } from '../stores/transactionsStore';
import { useFiltersStore } from '../stores/filtersStore';
import { filteredTransactions } from '../utils/selectors';
import type { Transaction } from '../types';

/**
 * React hook that provides filtered transactions with automatic reactivity
 */
export function useFilteredTransactions(): Transaction[] {
  // Subscribe to transactions array from TransactionsStore
  const transactions = useTransactionsStore((state) => state.transactions);

  // Subscribe to individual filter values from FiltersStore
  const searchQuery = useFiltersStore((state) => state.searchQuery);
  const type = useFiltersStore((state) => state.type);
  const category = useFiltersStore((state) => state.category);
  const dateRange = useFiltersStore((state) => state.dateRange);
  const sortField = useFiltersStore((state) => state.sortField);
  const sortDir = useFiltersStore((state) => state.sortDir);

  // Memoize filtered transactions to avoid unnecessary recomputation
  // Recomputes only when transactions or any filter value changes
  return useMemo(
    () =>
      filteredTransactions(transactions, {
        searchQuery,
        type,
        category,
        dateRange,
        sortField,
        sortDir,
      }),
    [transactions, searchQuery, type, category, dateRange, sortField, sortDir]
  );
}
