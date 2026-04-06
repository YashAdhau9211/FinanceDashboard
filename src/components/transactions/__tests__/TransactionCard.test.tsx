import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionCard } from '../TransactionCard';
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

const mockTransaction: Transaction = {
  id: '1',
  date: '2025-01-15',
  description: 'Grocery Shopping at Whole Foods',
  amount: 1500,
  type: 'expense',
  category: 'groceries',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
};

describe('TransactionCard', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    // Reset mock to default ADMIN role
    mockUseRoleStore.mockImplementation(<T,>(selector: RoleSelector<T>) => {
      const state = { role: 'ADMIN' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return typeof selector === 'function' ? selector(state) : (state.role as T);
    });
  });

  it('should render transaction details', () => {
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Grocery Shopping at Whole Foods')).toBeInTheDocument();
    expect(screen.getByText(/₹1,500/)).toBeInTheDocument();
    expect(screen.getByText('15 Jan 2025')).toBeInTheDocument();
  });

  it('should display category badge with icon', () => {
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('should display type badge', () => {
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Expense')).toBeInTheDocument();
  });

  it('should show Edit and Delete buttons for ADMIN role', () => {
    // ADMIN is default in mock
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByLabelText('Edit transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete transaction')).toBeInTheDocument();
  });

  it('should hide action buttons for ANALYST role', async () => {
    // Update mock to return ANALYST
    mockUseRoleStore.mockImplementation(<T,>(selector: RoleSelector<T>) => {
      const state = { role: 'ANALYST' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return typeof selector === 'function' ? selector(state) : (state.role as T);
    });

    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.queryByLabelText('Edit transaction')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete transaction')).not.toBeInTheDocument();
  });

  it('should call onEdit when Edit button is clicked', () => {
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const editButton = screen.getByLabelText('Edit transaction');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTransaction);
  });

  it('should show delete confirmation when Delete button is clicked', () => {
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByLabelText('Delete transaction');
    fireEvent.click(deleteButton);

    expect(screen.getByText('Delete this transaction?')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onDelete when Confirm is clicked', async () => {
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByLabelText('Delete transaction');
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    // Wait for the setTimeout to complete
    await waitFor(
      () => {
        expect(mockOnDelete).toHaveBeenCalledWith('1');
      },
      { timeout: 300 }
    );
  });

  it('should hide confirmation when Cancel is clicked', () => {
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByLabelText('Delete transaction');
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Delete this transaction?')).not.toBeInTheDocument();
  });

  it('should apply correct color for expense amounts', () => {
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const amountElement = screen.getByText(/₹1,500/);
    expect(amountElement.className).toContain('text-red-600');
  });

  it('should apply correct color for income amounts', () => {
    const incomeTransaction: Transaction = {
      ...mockTransaction,
      type: 'income',
      amount: 5000,
    };

    render(
      <TransactionCard
        transaction={incomeTransaction}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const amountElement = screen.getByText(/₹5,000/);
    expect(amountElement.className).toContain('text-green-600');
  });

  it('should show negative sign for expense amounts', () => {
    render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText(/-₹1,500/)).toBeInTheDocument();
  });

  it('should have fade-in animation class', () => {
    const { container } = render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const card = container.firstChild as HTMLElement | null;
    expect(card?.className).toContain('animate-fade-in-from-top');
  });

  it('should have proper card styling', () => {
    const { container } = render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const card = container.firstChild as HTMLElement | null;
    expect(card?.className).toContain('bg-white');
    expect(card?.className).toContain('rounded-lg');
    expect(card?.className).toContain('border');
  });

  it('should have dark mode support', () => {
    const { container } = render(
      <TransactionCard transaction={mockTransaction} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const card = container.firstChild as HTMLElement | null;
    expect(card?.className).toContain('dark:bg-gray-800');
  });
});
