import { describe, it, expect } from 'vitest';
import { filteredTransactions } from './selectors';
import type { Transaction, FilterState } from '../types';

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
  {
    id: '4',
    date: '2025-01-05',
    description: 'Bank Transfer',
    amount: 10000,
    type: 'transfer',
    category: 'transfer',
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-05T10:00:00Z',
  },
  {
    id: '5',
    date: '2025-01-25',
    description: 'Freelance Project',
    amount: 15000,
    type: 'income',
    category: 'freelance',
    createdAt: '2025-01-25T10:00:00Z',
    updatedAt: '2025-01-25T10:00:00Z',
  },
];

// Default filter state
const defaultFilters: FilterState = {
  searchQuery: '',
  type: 'all',
  category: 'all',
  dateRange: { start: null, end: null },
  sortField: 'date',
  sortDir: 'desc',
};

describe('filteredTransactions', () => {
  describe('Search Query Filtering', () => {
    it('should filter by description (case-insensitive)', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'grocery',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Grocery Shopping');
    });

    it('should filter by category (case-insensitive)', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'salary',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('salary');
    });

    it('should filter by amount', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: '1500',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(2); // 1500 and 15000
      expect(result.some((t) => t.amount === 1500)).toBe(true);
      expect(result.some((t) => t.amount === 15000)).toBe(true);
    });

    it('should filter by merchant (case-insensitive)', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'supermart',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].merchant).toBe('SuperMart');
    });

    it('should return all transactions when search query is empty', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: '',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(5);
    });

    it('should return empty array when no matches found', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'nonexistent',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('Type Filtering', () => {
    it('should filter by income type', () => {
      const filters: FilterState = {
        ...defaultFilters,
        type: 'income',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(2);
      expect(result.every((t) => t.type === 'income')).toBe(true);
    });

    it('should filter by expense type', () => {
      const filters: FilterState = {
        ...defaultFilters,
        type: 'expense',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(2);
      expect(result.every((t) => t.type === 'expense')).toBe(true);
    });

    it('should filter by transfer type', () => {
      const filters: FilterState = {
        ...defaultFilters,
        type: 'transfer',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('transfer');
    });

    it('should return all transactions when type is "all"', () => {
      const filters: FilterState = {
        ...defaultFilters,
        type: 'all',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(5);
    });
  });

  describe('Category Filtering', () => {
    it('should filter by groceries category', () => {
      const filters: FilterState = {
        ...defaultFilters,
        category: 'groceries',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('groceries');
    });

    it('should filter by salary category', () => {
      const filters: FilterState = {
        ...defaultFilters,
        category: 'salary',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('salary');
    });

    it('should return all transactions when category is "all"', () => {
      const filters: FilterState = {
        ...defaultFilters,
        category: 'all',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(5);
    });
  });

  describe('Date Range Filtering', () => {
    it('should filter by start date only', () => {
      const filters: FilterState = {
        ...defaultFilters,
        dateRange: { start: '2025-01-15', end: null },
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(3); // Jan 15, 20, 25
      expect(result.every((t) => t.date >= '2025-01-15')).toBe(true);
    });

    it('should filter by end date only', () => {
      const filters: FilterState = {
        ...defaultFilters,
        dateRange: { start: null, end: '2025-01-15' },
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(3); // Jan 5, 10, 15
      expect(result.every((t) => t.date <= '2025-01-15')).toBe(true);
    });

    it('should filter by both start and end date', () => {
      const filters: FilterState = {
        ...defaultFilters,
        dateRange: { start: '2025-01-10', end: '2025-01-20' },
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(3); // Jan 10, 15, 20
      expect(result.every((t) => t.date >= '2025-01-10' && t.date <= '2025-01-20')).toBe(true);
    });

    it('should return all transactions when no date range specified', () => {
      const filters: FilterState = {
        ...defaultFilters,
        dateRange: { start: null, end: null },
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(5);
    });
  });

  describe('Sorting', () => {
    it('should sort by date ascending', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortField: 'date',
        sortDir: 'asc',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result[0].date).toBe('2025-01-05');
      expect(result[4].date).toBe('2025-01-25');
    });

    it('should sort by date descending', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortField: 'date',
        sortDir: 'desc',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result[0].date).toBe('2025-01-25');
      expect(result[4].date).toBe('2025-01-05');
    });

    it('should sort by amount ascending', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortField: 'amount',
        sortDir: 'asc',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result[0].amount).toBe(1500);
      expect(result[4].amount).toBe(50000);
    });

    it('should sort by amount descending', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortField: 'amount',
        sortDir: 'desc',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result[0].amount).toBe(50000);
      expect(result[4].amount).toBe(1500);
    });

    it('should sort by description ascending', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortField: 'description',
        sortDir: 'asc',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result[0].description).toBe('Bank Transfer');
      expect(result[4].description).toBe('Salary Payment');
    });

    it('should sort by description descending', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortField: 'description',
        sortDir: 'desc',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result[0].description).toBe('Salary Payment');
      expect(result[4].description).toBe('Bank Transfer');
    });
  });

  describe('Combined Filters', () => {
    it('should apply search query and type filter together', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'payment',
        type: 'income',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Salary Payment');
      expect(result[0].type).toBe('income');
    });

    it('should apply type and category filter together', () => {
      const filters: FilterState = {
        ...defaultFilters,
        type: 'expense',
        category: 'groceries',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('expense');
      expect(result[0].category).toBe('groceries');
    });

    it('should apply date range and type filter together', () => {
      const filters: FilterState = {
        ...defaultFilters,
        type: 'income',
        dateRange: { start: '2025-01-20', end: null },
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Freelance Project');
    });

    it('should apply all filters together', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'grocery',
        type: 'expense',
        category: 'groceries',
        dateRange: { start: '2025-01-01', end: '2025-01-31' },
        sortField: 'date',
        sortDir: 'desc',
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Grocery Shopping');
    });

    it('should return empty array when combined filters match nothing', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'grocery',
        type: 'income', // Grocery is expense, not income
      };
      const result = filteredTransactions(mockTransactions, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty transactions array', () => {
      const filters: FilterState = defaultFilters;
      const result = filteredTransactions([], filters);
      expect(result).toHaveLength(0);
    });

    it('should not mutate original transactions array', () => {
      const original = [...mockTransactions];
      const filters: FilterState = {
        ...defaultFilters,
        sortField: 'amount',
        sortDir: 'asc',
      };
      filteredTransactions(mockTransactions, filters);
      expect(mockTransactions).toEqual(original);
    });

    it('should handle transactions without merchant field', () => {
      const txnWithoutMerchant: Transaction = {
        id: '6',
        date: '2025-01-30',
        description: 'Online Purchase',
        amount: 3000,
        type: 'expense',
        category: 'shopping',
        createdAt: '2025-01-30T10:00:00Z',
        updatedAt: '2025-01-30T10:00:00Z',
      };
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'online',
      };
      const result = filteredTransactions([txnWithoutMerchant], filters);
      expect(result).toHaveLength(1);
    });
  });
});
