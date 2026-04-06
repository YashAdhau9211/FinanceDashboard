import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilteredTransactions } from '../useFilteredTransactions';
import { useTransactionsStore } from '../../stores/transactionsStore';
import { useFiltersStore } from '../../stores/filtersStore';
import { useRoleStore } from '../../stores/roleStore';
import type { Transaction } from '../../types';

// Mock transactions for testing
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-01-15',
    description: 'Grocery Shopping',
    amount: 1500,
    type: 'expense',
    category: 'groceries',
    merchant: 'SuperMart',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    date: '2025-01-10',
    description: 'Salary Payment',
    amount: 50000,
    type: 'income',
    category: 'salary',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '3',
    date: '2025-01-20',
    description: 'Restaurant Dinner',
    amount: 2500,
    type: 'expense',
    category: 'dining',
    merchant: 'Fine Dine',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z',
  },
];

describe('useFilteredTransactions', () => {
  beforeEach(() => {
    // Reset stores before each test
    act(() => {
      useTransactionsStore.setState({ transactions: mockTransactions });
      useFiltersStore.getState().resetFilters();
      useRoleStore.setState({ role: 'ADMIN' });
    });
  });

  it('should return all transactions with default filters', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    expect(result.current).toHaveLength(3);
    // Default sort is date desc, so newest first
    expect(result.current[0].date).toBe('2025-01-20');
    expect(result.current[2].date).toBe('2025-01-10');
  });

  it('should return filtered transactions based on search query', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    act(() => {
      useFiltersStore.getState().setSearchQuery('grocery');
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].description).toBe('Grocery Shopping');
  });

  it('should return filtered transactions based on type', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    act(() => {
      useFiltersStore.getState().setType('income');
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].type).toBe('income');
  });

  it('should return filtered transactions based on category', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    act(() => {
      useFiltersStore.getState().setCategory('dining');
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].category).toBe('dining');
  });

  it('should return filtered transactions based on date range', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    act(() => {
      useFiltersStore.getState().setDateRange('2025-01-15', null);
    });

    expect(result.current).toHaveLength(2); // Jan 15 and Jan 20
    expect(result.current.every((t) => t.date >= '2025-01-15')).toBe(true);
  });

  it('should recompute when transactions change', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    expect(result.current).toHaveLength(3);

    // Add a new transaction
    act(() => {
      useTransactionsStore.getState().addTransaction({
        date: '2025-01-25',
        description: 'New Transaction',
        amount: 5000,
        type: 'expense',
        category: 'shopping',
      });
    });

    expect(result.current).toHaveLength(4);
  });

  it('should recompute when filters change', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    expect(result.current).toHaveLength(3);

    // Apply type filter
    act(() => {
      useFiltersStore.getState().setType('expense');
    });

    expect(result.current).toHaveLength(2);

    // Change type filter
    act(() => {
      useFiltersStore.getState().setType('income');
    });

    expect(result.current).toHaveLength(1);
  });

  it('should recompute when sort field changes', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    // Default sort is date desc
    expect(result.current[0].date).toBe('2025-01-20');

    // Change to amount desc
    act(() => {
      useFiltersStore.getState().setSortField('amount');
      useFiltersStore.getState().setSortDir('desc');
    });

    expect(result.current[0].amount).toBe(50000);
  });

  it('should recompute when sort direction changes', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    // Default sort is date desc
    expect(result.current[0].date).toBe('2025-01-20');

    // Change to date asc
    act(() => {
      useFiltersStore.getState().setSortDir('asc');
    });

    expect(result.current[0].date).toBe('2025-01-10');
  });

  it('should handle multiple filter changes', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    // Apply search query
    act(() => {
      useFiltersStore.getState().setSearchQuery('shopping');
    });

    expect(result.current).toHaveLength(1);

    // Add type filter
    act(() => {
      useFiltersStore.getState().setType('expense');
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].description).toBe('Grocery Shopping');

    // Clear filters
    act(() => {
      useFiltersStore.getState().resetFilters();
    });

    expect(result.current).toHaveLength(3);
  });

  it('should handle transaction deletion', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    expect(result.current).toHaveLength(3);

    // Delete a transaction
    act(() => {
      useTransactionsStore.getState().deleteTransaction('1');
    });

    expect(result.current).toHaveLength(2);
    expect(result.current.every((t) => t.id !== '1')).toBe(true);
  });

  it('should handle transaction update', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    // Apply type filter for income
    act(() => {
      useFiltersStore.getState().setType('income');
    });

    expect(result.current).toHaveLength(1);

    // Update an expense transaction to income
    act(() => {
      useTransactionsStore.getState().updateTransaction('1', {
        type: 'income',
      });
    });

    expect(result.current).toHaveLength(2);
  });

  it('should return empty array when no transactions match filters', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    act(() => {
      useFiltersStore.getState().setSearchQuery('nonexistent');
    });

    expect(result.current).toHaveLength(0);
  });

  it('should memoize results and not recompute unnecessarily', () => {
    const { result, rerender } = renderHook(() => useFilteredTransactions());

    const firstResult = result.current;

    // Rerender without changing stores
    rerender();

    // Should return the same reference (memoized)
    expect(result.current).toBe(firstResult);
  });

  it('should handle combined filters correctly', () => {
    const { result } = renderHook(() => useFilteredTransactions());

    // Apply multiple filters
    act(() => {
      useFiltersStore.getState().setType('expense');
      useFiltersStore.getState().setCategory('groceries');
      useFiltersStore.getState().setDateRange('2025-01-01', '2025-01-31');
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].description).toBe('Grocery Shopping');
  });
});
