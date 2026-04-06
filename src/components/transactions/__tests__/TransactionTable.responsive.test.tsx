import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionTable } from '../TransactionTable';
import type { Transaction } from '../../../types';

type RoleState = { role: 'ADMIN' | 'ANALYST' };
type RoleActions = { setRole: (role: 'ADMIN' | 'ANALYST') => void; toggleRole: () => void };
type RoleSelector<T> = (state: RoleState & RoleActions) => T;

// Mock the stores
const mockUseRoleStore = vi.fn(<T,>(selector: RoleSelector<T>) => {
  const state = { role: 'ADMIN' as const, setRole: vi.fn(), toggleRole: vi.fn() };
  return typeof selector === 'function' ? selector(state) : (state.role as T);
});

vi.mock('../../../stores/roleStore', () => ({
  useRoleStore: <T,>(selector?: RoleSelector<T>) => mockUseRoleStore(selector!),
}));

vi.mock('../../../stores/filtersStore', () => ({
  useFiltersStore: vi.fn((selector) => {
    const state = {
      sortField: 'date',
      sortDir: 'desc' as const,
      setSortField: vi.fn(),
      setSortDir: vi.fn(),
      searchQuery: '',
      type: 'all' as const,
      category: 'all' as const,
      dateRange: { start: null, end: null },
    };
    return selector(state);
  }),
}));

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
    description: 'Salary',
    amount: 50000,
    type: 'income',
    category: 'salary',
    createdAt: '2025-01-14T10:00:00Z',
    updatedAt: '2025-01-14T10:00:00Z',
  },
];

describe('TransactionTable - Responsive Design', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnAddTransaction = vi.fn();

  beforeEach(() => {
    // Reset mock to default ADMIN role
    mockUseRoleStore.mockImplementation((selector) => {
      const state = { role: 'ADMIN' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return typeof selector === 'function' ? selector(state) : state.role;
    });
  });

  it('should render desktop table view on large screens', () => {
    // Set viewport to desktop size
    global.innerWidth = 1024;

    render(
      <TransactionTable
        transactions={mockTransactions}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddTransaction={mockOnAddTransaction}
      />
    );

    // Desktop table should have the hidden md:block class
    const tableContainer = screen.getByRole('table').parentElement;
    expect(tableContainer?.className).toContain('md:block');
  });

  it('should render mobile card view on small screens', () => {
    // Set viewport to mobile size
    global.innerWidth = 375;

    render(
      <TransactionTable
        transactions={mockTransactions}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddTransaction={mockOnAddTransaction}
      />
    );

    // Mobile cards should be present
    const cards = screen.getAllByText(/Grocery Shopping|Salary/);
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should display all transaction data in mobile card view', () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddTransaction={mockOnAddTransaction}
      />
    );

    // Check that transaction details are visible (using getAllByText for duplicates)
    expect(screen.getAllByText('Grocery Shopping').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Salary').length).toBeGreaterThan(0);

    // Check amounts are displayed (using getAllByText for duplicates)
    expect(screen.getAllByText(/₹1,500/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₹50,000/).length).toBeGreaterThan(0);
  });

  it('should show action buttons in mobile card view for ADMIN role', () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddTransaction={mockOnAddTransaction}
      />
    );

    // Check for Edit and Delete buttons in mobile view (ADMIN is default in mock)
    const editButtons = screen.getAllByLabelText(/Edit transaction/);
    const deleteButtons = screen.getAllByLabelText(/Delete transaction/);

    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('should hide action buttons in mobile card view for ANALYST role', async () => {
    // Update mock to return ANALYST
    mockUseRoleStore.mockImplementation(<T,>(selector: RoleSelector<T>) => {
      const state = { role: 'ANALYST' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return typeof selector === 'function' ? selector(state) : (state.role as T);
    });

    render(
      <TransactionTable
        transactions={mockTransactions}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddTransaction={mockOnAddTransaction}
      />
    );

    // Action buttons should not be present
    expect(screen.queryByLabelText(/Edit transaction/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Delete transaction/)).not.toBeInTheDocument();
  });

  it('should apply fade transition classes', () => {
    const { container } = render(
      <TransactionTable
        transactions={mockTransactions}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddTransaction={mockOnAddTransaction}
      />
    );

    // Check for transition classes
    const transitionElements = container.querySelectorAll('.transition-opacity');
    expect(transitionElements.length).toBeGreaterThan(0);
  });
});
