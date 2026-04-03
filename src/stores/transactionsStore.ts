import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, FilterState } from '../types';
import { mockTransactions } from '../utils/mockTransactions';

interface TransactionsState {
  transactions: Transaction[];
}

interface TransactionsActions {
  addTransaction: (
    transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getFilteredTransactions: (filters: FilterState) => Transaction[];
}

export const useTransactionsStore = create<
  TransactionsState & TransactionsActions
>()(
  persist(
    (set, get) => ({
      // Initialize state with mockTransactions array
      transactions: mockTransactions,

      // Add transaction action - generate id, createdAt, updatedAt
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            {
              ...transaction,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      // Update transaction action - update fields, set updatedAt
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) => {
            if (t.id !== id) return t;
            
            // Filter out undefined values to preserve unmodified fields
            const filteredUpdates = Object.fromEntries(
              Object.entries(updates).filter(([_, value]) => value !== undefined)
            );
            
            return {
              ...t,
              ...filteredUpdates,
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      // Delete transaction action - remove by id
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // Get transaction by id selector
      getTransactionById: (id) => {
        return get().transactions.find((t) => t.id === id);
      },

      // Get filtered transactions selector
      getFilteredTransactions: (filters) => {
        let filtered = get().transactions;

        // Apply search query - case-insensitive matching in description/merchant
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.description.toLowerCase().includes(query) ||
              t.merchant?.toLowerCase().includes(query)
          );
        }

        // Apply type filter
        if (filters.type !== 'all') {
          filtered = filtered.filter((t) => t.type === filters.type);
        }

        // Apply category filter
        if (filters.category !== 'all') {
          filtered = filtered.filter((t) => t.category === filters.category);
        }

        // Apply date range filter
        if (filters.dateRange.start) {
          filtered = filtered.filter((t) => t.date >= filters.dateRange.start!);
        }
        if (filters.dateRange.end) {
          filtered = filtered.filter((t) => t.date <= filters.dateRange.end!);
        }

        // Apply sorting
        filtered.sort((a, b) => {
          const aVal = a[filters.sortField];
          const bVal = b[filters.sortField];
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return filters.sortDir === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },
    }),
    {
      name: 'zorvyn-transactions', // localStorage key
    }
  )
);
