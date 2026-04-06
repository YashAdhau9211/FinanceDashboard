import { create } from 'zustand';
import type { FilterState, TransactionType, Category, SortDir } from '../types';

interface FiltersActions {
  setSearchQuery: (query: string) => void;
  setType: (type: TransactionType | 'all') => void;
  setCategory: (category: Category | string | 'all') => void; // Allow custom categories
  setDateRange: (start: string | null, end: string | null) => void;
  setSortField: (field: 'date' | 'amount' | 'description') => void;
  setSortDir: (dir: SortDir) => void;
  resetFilters: () => void;
}

// Default filter state
const defaultFilters: FilterState = {
  searchQuery: '',
  type: 'all',
  category: 'all',
  dateRange: { start: null, end: null },
  sortField: 'date',
  sortDir: 'desc',
};

export const useFiltersStore = create<FilterState & FiltersActions>()((set) => ({
  // Initialize with default filter state
  ...defaultFilters,

  // Set search query action
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Set type action
  setType: (type) => set({ type }),

  // Set category action
  setCategory: (category) => set({ category }),

  // Set date range action
  setDateRange: (start, end) => set({ dateRange: { start, end } }),

  // Set sort field action
  setSortField: (field) => set({ sortField: field }),

  // Set sort direction action
  setSortDir: (dir) => set({ sortDir: dir }),

  // Reset all filters to default values
  resetFilters: () => set(defaultFilters),
}));
