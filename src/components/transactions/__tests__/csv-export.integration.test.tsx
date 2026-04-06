import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Transactions } from '../../../pages/Transactions';
import { useTransactionsStore } from '../../../stores/transactionsStore';
import { useFiltersStore } from '../../../stores/filtersStore';
import { useRoleStore } from '../../../stores/roleStore';
import type { Transaction } from '../../../types';

describe('CSV Export Integration Tests', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Salary Payment',
      amount: 5000,
      type: 'income',
      category: 'salary',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      date: '2024-01-16',
      description: 'Grocery Shopping',
      amount: 150,
      type: 'expense',
      category: 'groceries',
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T10:00:00Z',
    },
    {
      id: '3',
      date: '2024-01-17',
      description: 'Restaurant Dinner',
      amount: 75,
      type: 'expense',
      category: 'dining',
      createdAt: '2024-01-17T10:00:00Z',
      updatedAt: '2024-01-17T10:00:00Z',
    },
    {
      id: '4',
      date: '2024-02-01',
      description: 'Freelance Income',
      amount: 1200,
      type: 'income',
      category: 'freelance',
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-02-01T10:00:00Z',
    },
    {
      id: '5',
      date: '2024-02-05',
      description: 'Coffee Shop',
      amount: 5.5,
      type: 'expense',
      category: 'dining',
      createdAt: '2024-02-05T10:00:00Z',
      updatedAt: '2024-02-05T10:00:00Z',
    },
  ];

  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Set ADMIN role to see export button
    useRoleStore.setState({ role: 'ADMIN' });

    // Initialize transactions
    useTransactionsStore.setState({ transactions: mockTransactions });

    // Reset filters to default state
    useFiltersStore.getState().resetFilters();

    // Mock URL methods
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    vi.restoreAllMocks();
  });

  /**
   * Test: Export includes only filtered transactions (search filter)
   */
  it('should export only transactions matching search query', async () => {
    const user = userEvent.setup();

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Apply search filter for "Salary"
    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    await user.type(searchInput, 'Salary');

    // Wait for filter to apply
    await waitFor(() => {
      expect(useFiltersStore.getState().searchQuery).toBe('Salary');
    });

    // Click export button
    const exportButton = screen.getByLabelText('Export transactions to CSV');
    await user.click(exportButton);

    // Read the blob content
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
    const text = await blobArg.text();

    // Verify only "Salary Payment" transaction is in CSV
    expect(text).toContain('Salary Payment');
    expect(text).not.toContain('Grocery Shopping');
    expect(text).not.toContain('Restaurant Dinner');
    expect(text).not.toContain('Freelance Income');
    expect(text).not.toContain('Coffee Shop');

    // Verify CSV has header + 1 data row
    const lines = text.trim().split('\n');
    expect(lines.length).toBe(2); // header + 1 row
  });

  /**
   * Test: Export includes only filtered transactions (type filter)
   */
  it('should export only transactions matching type filter', async () => {
    const user = userEvent.setup();

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Apply type filter for "income"
    const typeSelect = screen.getByLabelText(/transaction type/i);
    await user.selectOptions(typeSelect, 'income');

    // Wait for filter to apply
    await waitFor(() => {
      expect(useFiltersStore.getState().type).toBe('income');
    });

    // Click export button
    const exportButton = screen.getByLabelText('Export transactions to CSV');
    await user.click(exportButton);

    // Read the blob content
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
    const text = await blobArg.text();

    // Verify only income transactions are in CSV
    expect(text).toContain('Salary Payment');
    expect(text).toContain('Freelance Income');
    expect(text).not.toContain('Grocery Shopping');
    expect(text).not.toContain('Restaurant Dinner');
    expect(text).not.toContain('Coffee Shop');

    // Verify CSV has header + 2 data rows
    const lines = text.trim().split('\n');
    expect(lines.length).toBe(3); // header + 2 rows
  });

  /**
   * Test: Export includes only filtered transactions (category filter)
   */
  it('should export only transactions matching category filter', async () => {
    const user = userEvent.setup();

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Apply category filter for "dining"
    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'dining');

    // Wait for filter to apply
    await waitFor(() => {
      expect(useFiltersStore.getState().category).toBe('dining');
    });

    // Click export button
    const exportButton = screen.getByLabelText('Export transactions to CSV');
    await user.click(exportButton);

    // Read the blob content
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
    const text = await blobArg.text();

    // Verify only dining transactions are in CSV
    expect(text).toContain('Restaurant Dinner');
    expect(text).toContain('Coffee Shop');
    expect(text).not.toContain('Salary Payment');
    expect(text).not.toContain('Grocery Shopping');
    expect(text).not.toContain('Freelance Income');

    // Verify CSV has header + 2 data rows
    const lines = text.trim().split('\n');
    expect(lines.length).toBe(3); // header + 2 rows
  });

  /**
   * Test: Export works with multiple filters combined
   */
  it('should export only transactions matching multiple combined filters', async () => {
    const user = userEvent.setup();

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Apply type filter for "expense"
    const typeSelect = screen.getByLabelText(/transaction type/i);
    await user.selectOptions(typeSelect, 'expense');

    // Apply category filter for "dining"
    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'dining');

    // Wait for filters to apply
    await waitFor(() => {
      expect(useFiltersStore.getState().type).toBe('expense');
      expect(useFiltersStore.getState().category).toBe('dining');
    });

    // Click export button
    const exportButton = screen.getByLabelText('Export transactions to CSV');
    await user.click(exportButton);

    // Read the blob content
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
    const text = await blobArg.text();

    // Verify only expense + dining transactions are in CSV
    expect(text).toContain('Restaurant Dinner');
    expect(text).toContain('Coffee Shop');
    expect(text).not.toContain('Salary Payment');
    expect(text).not.toContain('Grocery Shopping');
    expect(text).not.toContain('Freelance Income');

    // Verify CSV has header + 2 data rows
    const lines = text.trim().split('\n');
    expect(lines.length).toBe(3); // header + 2 rows
  });

  /**
   * Test: Export works with date range filter
   */
  it('should export only transactions within date range filter', async () => {
    const user = userEvent.setup();

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Apply date range filter for January 2024
    useFiltersStore.getState().setDateRange('2024-01-01', '2024-01-31');

    // Wait for filter to apply
    await waitFor(() => {
      const dateRange = useFiltersStore.getState().dateRange;
      expect(dateRange.start).toBe('2024-01-01');
      expect(dateRange.end).toBe('2024-01-31');
    });

    // Click export button
    const exportButton = screen.getByLabelText('Export transactions to CSV');
    await user.click(exportButton);

    // Read the blob content
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
    const text = await blobArg.text();

    // Verify only January transactions are in CSV
    expect(text).toContain('Salary Payment');
    expect(text).toContain('Grocery Shopping');
    expect(text).toContain('Restaurant Dinner');
    expect(text).not.toContain('Freelance Income');
    expect(text).not.toContain('Coffee Shop');

    // Verify CSV has header + 3 data rows
    const lines = text.trim().split('\n');
    expect(lines.length).toBe(4); // header + 3 rows
  });

  /**
   * Test: Export handles empty filtered results
   */
  it('should handle export when no transactions match filters', async () => {
    const user = userEvent.setup();

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Apply search filter that matches nothing
    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    await user.type(searchInput, 'NonexistentTransaction12345');

    // Wait for filter to apply
    await waitFor(() => {
      expect(useFiltersStore.getState().searchQuery).toBe('NonexistentTransaction12345');
    });

    // Click export button
    const exportButton = screen.getByLabelText('Export transactions to CSV');
    await user.click(exportButton);

    // Verify export was triggered (download link was clicked)
    expect(mockClick).toHaveBeenCalled();

    // Read the blob content
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
    const text = await blobArg.text();

    // PapaParse with empty array generates just the header row
    // Verify no transaction data is present
    expect(text).not.toContain('Salary Payment');
    expect(text).not.toContain('Grocery Shopping');
    expect(text).not.toContain('Restaurant Dinner');
    expect(text).not.toContain('Freelance Income');
    expect(text).not.toContain('Coffee Shop');
    expect(text.length).toBeLessThan(100); // Should be minimal content
  });

  /**
   * Test: Export respects all transactions when no filters applied
   */
  it('should export all transactions when no filters are applied', async () => {
    const user = userEvent.setup();

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Ensure no filters are applied (default state)
    expect(useFiltersStore.getState().searchQuery).toBe('');
    expect(useFiltersStore.getState().type).toBe('all');
    expect(useFiltersStore.getState().category).toBe('all');

    // Click export button
    const exportButton = screen.getByLabelText('Export transactions to CSV');
    await user.click(exportButton);

    // Read the blob content
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
    const text = await blobArg.text();

    // Verify all transactions are in CSV
    expect(text).toContain('Salary Payment');
    expect(text).toContain('Grocery Shopping');
    expect(text).toContain('Restaurant Dinner');
    expect(text).toContain('Freelance Income');
    expect(text).toContain('Coffee Shop');

    // Verify CSV has header + 5 data rows
    const lines = text.trim().split('\n');
    expect(lines.length).toBe(6); // header + 5 rows
  });

  /**
   * Test: Export works after resetting filters
   */
  it('should export all transactions after filters are reset', async () => {
    const user = userEvent.setup();

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Apply a filter
    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    await user.type(searchInput, 'Salary');

    // Wait for filter to apply
    await waitFor(() => {
      expect(useFiltersStore.getState().searchQuery).toBe('Salary');
    });

    // Reset filters
    useFiltersStore.getState().resetFilters();

    // Wait for reset to apply
    await waitFor(() => {
      expect(useFiltersStore.getState().searchQuery).toBe('');
    });

    // Click export button
    const exportButton = screen.getByLabelText('Export transactions to CSV');
    await user.click(exportButton);

    // Read the blob content
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
    const text = await blobArg.text();

    // Verify all transactions are in CSV after reset
    expect(text).toContain('Salary Payment');
    expect(text).toContain('Grocery Shopping');
    expect(text).toContain('Restaurant Dinner');
    expect(text).toContain('Freelance Income');
    expect(text).toContain('Coffee Shop');

    // Verify CSV has header + 5 data rows
    const lines = text.trim().split('\n');
    expect(lines.length).toBe(6); // header + 5 rows
  });
});
