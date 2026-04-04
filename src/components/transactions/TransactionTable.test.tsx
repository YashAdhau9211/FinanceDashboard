import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionTable } from './TransactionTable';
import { useRoleStore } from '../../stores/roleStore';
import { useFiltersStore } from '../../stores/filtersStore';
import type { Transaction } from '../../types';

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-01-15',
    description: 'Grocery Shopping',
    amount: 1500,
    type: 'expense',
    category: 'groceries',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    date: '2025-01-14',
    description: 'Salary Payment',
    amount: 50000,
    type: 'income',
    category: 'salary',
    createdAt: '2025-01-14T10:00:00Z',
    updatedAt: '2025-01-14T10:00:00Z',
  },
];

describe('TransactionTable', () => {
  beforeEach(() => {
    // Reset stores before each test
    useRoleStore.setState({ role: 'ADMIN' });
    useFiltersStore.setState({
      searchQuery: '',
      type: 'all',
      category: 'all',
      dateRange: { start: null, end: null },
      sortField: 'date',
      sortDir: 'desc',
    });
  });

  it('renders table with correct columns', () => {
    render(<TransactionTable transactions={mockTransactions} isLoading={false} />);

    expect(screen.getByText('DATE')).toBeInTheDocument();
    expect(screen.getByText('DESCRIPTION')).toBeInTheDocument();
    expect(screen.getByText('CATEGORY')).toBeInTheDocument();
    expect(screen.getByText('TYPE')).toBeInTheDocument();
    expect(screen.getByText('AMOUNT')).toBeInTheDocument();
    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
  });

  it('renders transactions with alternating row backgrounds', () => {
    const { container } = render(
      <TransactionTable transactions={mockTransactions} isLoading={false} />
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveClass('bg-white');
    expect(rows[1]).toHaveClass('bg-gray-50');
  });

  it('hides ACTIONS column when role is ANALYST', () => {
    useRoleStore.setState({ role: 'ANALYST' });

    render(<TransactionTable transactions={mockTransactions} isLoading={false} />);

    expect(screen.queryByText('ACTIONS')).not.toBeInTheDocument();
  });

  it('shows ACTIONS column when role is ADMIN', () => {
    useRoleStore.setState({ role: 'ADMIN' });

    render(<TransactionTable transactions={mockTransactions} isLoading={false} />);

    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
  });

  it('shows loading state placeholder when isLoading is true', () => {
    render(<TransactionTable transactions={[]} isLoading={true} />);

    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
    expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
  });

  it('shows empty state when no transactions and no filters', () => {
    render(<TransactionTable transactions={[]} isLoading={false} />);

    expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    expect(screen.getByText('Add your first one to get started.')).toBeInTheDocument();
  });

  it('shows filtered empty state when no results with active filters', () => {
    useFiltersStore.setState({ searchQuery: 'test query' });

    render(<TransactionTable transactions={[]} isLoading={false} />);

    expect(screen.getByText('No transactions match your filters')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument();
  });

  it('shows filtered empty state when type filter is active', () => {
    useFiltersStore.setState({ type: 'income' });

    render(<TransactionTable transactions={[]} isLoading={false} />);

    expect(screen.getByText('No transactions match your filters')).toBeInTheDocument();
  });

  it('shows filtered empty state when category filter is active', () => {
    useFiltersStore.setState({ category: 'groceries' });

    render(<TransactionTable transactions={[]} isLoading={false} />);

    expect(screen.getByText('No transactions match your filters')).toBeInTheDocument();
  });

  it('shows filtered empty state when date range is active', () => {
    useFiltersStore.setState({ dateRange: { start: '2025-01-01', end: null } });

    render(<TransactionTable transactions={[]} isLoading={false} />);

    expect(screen.getByText('No transactions match your filters')).toBeInTheDocument();
  });
});
