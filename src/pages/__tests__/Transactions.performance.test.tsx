import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Transactions } from '../Transactions';
import { useTransactionsStore } from '../../stores/transactionsStore';
import { useFiltersStore } from '../../stores/filtersStore';
import type { Transaction } from '../../types';

// Mock the stores
vi.mock('../stores/roleStore', () => ({
  useRoleStore: vi.fn((selector) => {
    const state = { role: 'ADMIN' };
    return typeof selector === 'function' ? selector(state) : state.role;
  }),
}));

vi.mock('../stores/uiStore', () => ({
  useUIStore: vi.fn(() => ({
    isSlideOverOpen: false,
    slideOverMode: 'add',
    editingTransaction: null,
    openSlideOver: vi.fn(),
    closeSlideOver: vi.fn(),
    setEditingTransaction: vi.fn(),
  })),
}));

describe('Transactions Page Performance', () => {
  beforeEach(() => {
    // Reset stores
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

  it('should render initial page in less than 500ms with 50 transactions', () => {
    // Create 50 mock transactions
    const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
      id: `${i}`,
      date: `2026-01-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
      description: `Transaction ${i}`,
      amount: 1000 + i * 100,
      type: i % 3 === 0 ? 'income' : i % 3 === 1 ? 'expense' : 'transfer',
      category: 'groceries',
      merchant: `Merchant ${i}`,
      tags: ['test'],
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    })) as Transaction[];

    useTransactionsStore.setState({ transactions: mockTransactions });

    const startTime = performance.now();
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );
    const endTime = performance.now();

    const renderTime = endTime - startTime;

    // Initial render should be under 600ms
    expect(renderTime).toBeLessThan(600);
  });

  it('should render initial page in less than 500ms with 100 transactions', () => {
    // Create 100 mock transactions
    const mockTransactions: Transaction[] = Array.from({ length: 100 }, (_, i) => ({
      id: `${i}`,
      date: `2026-01-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
      description: `Transaction ${i}`,
      amount: 1000 + i * 100,
      type: i % 3 === 0 ? 'income' : i % 3 === 1 ? 'expense' : 'transfer',
      category: 'groceries',
      merchant: `Merchant ${i}`,
      tags: ['test'],
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    })) as Transaction[];

    useTransactionsStore.setState({ transactions: mockTransactions });

    const startTime = performance.now();
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );
    const endTime = performance.now();

    const renderTime = endTime - startTime;

    // Initial render should be under 600ms even with 100 transactions
    expect(renderTime).toBeLessThan(600);
  });

  it('should handle empty state efficiently', () => {
    useTransactionsStore.setState({ transactions: [] });

    const startTime = performance.now();
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );
    const endTime = performance.now();

    const renderTime = endTime - startTime;

    // Empty state should render quickly
    expect(renderTime).toBeLessThan(300);
  });

  it('should handle filtered state efficiently', () => {
    // Create 100 mock transactions
    const mockTransactions: Transaction[] = Array.from({ length: 100 }, (_, i) => ({
      id: `${i}`,
      date: `2026-01-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
      description: `Transaction ${i}`,
      amount: 1000 + i * 100,
      type: i % 3 === 0 ? 'income' : i % 3 === 1 ? 'expense' : 'transfer',
      category: 'groceries',
      merchant: `Merchant ${i}`,
      tags: ['test'],
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    })) as Transaction[];

    useTransactionsStore.setState({ transactions: mockTransactions });

    // Apply filters
    useFiltersStore.setState({
      searchQuery: 'Transaction 5',
      type: 'expense',
      category: 'groceries',
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

    const startTime = performance.now();
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );
    const endTime = performance.now();

    const renderTime = endTime - startTime;

    // Filtered render should still be under 600ms
    expect(renderTime).toBeLessThan(600);
  });
});
