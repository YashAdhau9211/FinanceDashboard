import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredTransactions } from './useFilteredTransactions';
import { useTransactionsStore } from '../stores/transactionsStore';
import { useFiltersStore } from '../stores/filtersStore';
import type { Transaction } from '../types';

describe('useFilteredTransactions Performance - Memoization', () => {
  const mockTransactions: Transaction[] = Array.from({ length: 100 }, (_, i) => ({
    id: `${i}`,
    date: `2026-01-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    description: `Transaction ${i}`,
    amount: 1000 + i * 100,
    type: (i % 3 === 0 ? 'income' : i % 3 === 1 ? 'expense' : 'transfer') as
      | 'income'
      | 'expense'
      | 'transfer',
    category: 'groceries' as const,
    merchant: `Merchant ${i}`,
    tags: ['test'],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  }));

  beforeEach(() => {
    useTransactionsStore.setState({ transactions: mockTransactions });
    useFiltersStore.setState({
      searchQuery: '',
      type: 'all',
      category: 'all',
      dateRange: { start: null, end: null },
      sortField: 'date',
      sortDir: 'desc',
      setSearchQuery: vi.fn(),
      setType: vi.fn(),
      setCategory: vi.fn(),
      setDateRange: vi.fn(),
      setSortField: vi.fn(),
      setSortDir: vi.fn(),
      resetFilters: vi.fn(),
    });
  });

  it('should memoize results when dependencies do not change', () => {
    const { result, rerender } = renderHook(() => useFilteredTransactions());

    const firstResult = result.current;

    // Rerender without changing dependencies
    rerender();

    const secondResult = result.current;

    // Results should be the same reference (memoized)
    expect(firstResult).toBe(secondResult);
  });

  it('should recompute when transactions change', () => {
    const { result, rerender } = renderHook(() => useFilteredTransactions());

    const firstResult = result.current;

    // Change transactions
    useTransactionsStore.setState({
      transactions: [
        ...mockTransactions,
        {
          id: '999',
          date: '2026-01-15T10:00:00Z',
          description: 'New Transaction',
          amount: 5000,
          type: 'income' as const,
          category: 'salary' as const,
          merchant: 'New Merchant',
          tags: ['new'],
          createdAt: '2026-01-15T10:00:00Z',
          updatedAt: '2026-01-15T10:00:00Z',
        },
      ],
    });

    rerender();

    const secondResult = result.current;

    // Results should be different (recomputed)
    expect(firstResult).not.toBe(secondResult);
    expect(secondResult.length).toBe(101);
  });

  it('should recompute when filters change', () => {
    const { result, rerender } = renderHook(() => useFilteredTransactions());

    const firstResult = result.current;
    const firstLength = firstResult.length;

    // Change filter
    useFiltersStore.setState({ type: 'income' });

    rerender();

    const secondResult = result.current;

    // Results should be different (recomputed)
    expect(firstResult).not.toBe(secondResult);
    // Should have fewer results after filtering
    expect(secondResult.length).toBeLessThan(firstLength);
  });

  it('should not recompute when unrelated state changes', () => {
    const { result, rerender } = renderHook(() => useFilteredTransactions());

    const firstResult = result.current;

    // Trigger a rerender without changing dependencies
    // (In a real app, this could be from a parent component re-rendering)
    rerender();

    const secondResult = result.current;

    // Results should be the same reference (memoized)
    expect(firstResult).toBe(secondResult);
  });

  it('should compute filtered results efficiently with 100 transactions', () => {
    const startTime = performance.now();

    renderHook(() => useFilteredTransactions());

    const endTime = performance.now();
    const computeTime = endTime - startTime;

    // Computing filtered results should be fast
    expect(computeTime).toBeLessThan(50);
  });

  it('should compute filtered results efficiently with search query', () => {
    useFiltersStore.setState({ searchQuery: 'Transaction 5' });

    const startTime = performance.now();

    renderHook(() => useFilteredTransactions());

    const endTime = performance.now();
    const computeTime = endTime - startTime;

    // Computing filtered results with search should still be fast
    expect(computeTime).toBeLessThan(50);
  });

  it('should compute filtered results efficiently with multiple filters', () => {
    useFiltersStore.setState({
      searchQuery: 'Transaction',
      type: 'expense',
      category: 'groceries',
      dateRange: { start: '2026-01-01', end: '2026-01-31' },
      sortField: 'amount',
      sortDir: 'asc',
      setSearchQuery: vi.fn(),
      setType: vi.fn(),
      setCategory: vi.fn(),
      setDateRange: vi.fn(),
      setSortField: vi.fn(),
      setSortDir: vi.fn(),
      resetFilters: vi.fn(),
    });

    const startTime = performance.now();

    renderHook(() => useFilteredTransactions());

    const endTime = performance.now();
    const computeTime = endTime - startTime;

    // Computing filtered results with multiple filters should still be fast
    expect(computeTime).toBeLessThan(100);
  });
});
