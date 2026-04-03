import type { Transaction } from '../../types';

export function getRecentTransactions(transactions: Transaction[]): Transaction[] {
  // Sort transactions by date descending (most recent first)
  const sorted = [...transactions].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  // Return first 5 transactions
  return sorted.slice(0, 5);
}
