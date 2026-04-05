import type { Transaction, FilterState } from '../types';

/**
 * Pure function that applies all filters and sorting to transactions array
 */
export function filteredTransactions(
  transactions: Transaction[],
  filters: FilterState
): Transaction[] {
  let result = [...transactions];

  // Search across description, category, and amount fields
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter((txn) => {
      const descriptionMatch = txn.description.toLowerCase().includes(query);
      const categoryMatch = txn.category.toLowerCase().includes(query);
      const amountMatch = txn.amount.toString().includes(query);
      const merchantMatch = txn.merchant?.toLowerCase().includes(query) || false;

      return descriptionMatch || categoryMatch || amountMatch || merchantMatch;
    });
  }

  // Apply type filter (when not "all")
  if (filters.type !== 'all') {
    result = result.filter((txn) => txn.type === filters.type);
  }

  // Apply category filter (when not "all")
  if (filters.category !== 'all') {
    result = result.filter((txn) => txn.category === filters.category);
  }

  // Apply date range start filter (if provided)
  if (filters.dateRange.start) {
    result = result.filter((txn) => txn.date >= filters.dateRange.start!);
  }

  // Apply date range end filter (if provided)
  if (filters.dateRange.end) {
    result = result.filter((txn) => txn.date <= filters.dateRange.end!);
  }

  // Sort by specified field and direction
  result.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    // Get values based on sort field
    switch (filters.sortField) {
      case 'date':
        aValue = a.date;
        bValue = b.date;
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'description':
        aValue = a.description.toLowerCase();
        bValue = b.description.toLowerCase();
        break;
      default:
        aValue = a.date;
        bValue = b.date;
    }

    // Compare values
    let comparison = 0;
    if (aValue < bValue) {
      comparison = -1;
    } else if (aValue > bValue) {
      comparison = 1;
    }

    // Apply sort direction
    return filters.sortDir === 'asc' ? comparison : -comparison;
  });

  return result;
}
