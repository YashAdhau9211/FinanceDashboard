import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { TransactionRow } from './TransactionRow';
import { useRoleStore } from '../../stores/roleStore';
import type { Transaction } from '../../types';

describe('TransactionRow', () => {
  const mockTransaction: Transaction = {
    id: '1',
    date: '2025-01-15',
    description: 'Grocery Shopping',
    amount: 1500,
    type: 'expense',
    category: 'groceries',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  };

  beforeEach(() => {
    useRoleStore.setState({ role: 'ADMIN' });
  });

  it('formats date as DD MMM YYYY', () => {
    render(<TransactionRow transaction={mockTransaction} isEven={true} />);

    expect(screen.getByText('15 Jan 2025')).toBeInTheDocument();
  });

  it('renders category pill with icon', () => {
    render(<TransactionRow transaction={mockTransaction} isEven={true} />);

    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('renders type badge with correct color for income', () => {
    const incomeTransaction: Transaction = {
      ...mockTransaction,
      type: 'income',
      amount: 50000,
    };

    render(<TransactionRow transaction={incomeTransaction} isEven={true} />);

    const badge = screen.getByText('Income');
    expect(badge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('renders type badge with correct color for expense', () => {
    render(<TransactionRow transaction={mockTransaction} isEven={true} />);

    const badge = screen.getByText('Expense');
    expect(badge).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('renders type badge with correct color for transfer', () => {
    const transferTransaction: Transaction = {
      ...mockTransaction,
      type: 'transfer',
    };

    render(<TransactionRow transaction={transferTransaction} isEven={true} />);

    const badge = screen.getByText('Transfer');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-700');
  });

  it('formats amount with INR symbol and correct color for income', () => {
    const incomeTransaction: Transaction = {
      ...mockTransaction,
      type: 'income',
      amount: 50000,
    };

    const { container } = render(<TransactionRow transaction={incomeTransaction} isEven={true} />);

    // Find the td element containing the amount
    const amountCell = container.querySelector('td.text-green-600');
    expect(amountCell).toBeInTheDocument();
    expect(amountCell?.textContent).toContain('₹50,000.00');
  });

  it('formats amount with INR symbol and correct color for expense', () => {
    const { container } = render(<TransactionRow transaction={mockTransaction} isEven={true} />);

    // Find the td element containing the amount
    const amountCell = container.querySelector('td.text-red-600');
    expect(amountCell).toBeInTheDocument();
    expect(amountCell?.textContent).toContain('-');
    expect(amountCell?.textContent).toContain('₹1,500.00');
  });

  it('formats amount with correct color for transfer', () => {
    const transferTransaction: Transaction = {
      ...mockTransaction,
      type: 'transfer',
    };

    const { container } = render(
      <TransactionRow transaction={transferTransaction} isEven={true} />
    );

    // Find the td element containing the amount
    const amountCell = container.querySelector('td.text-gray-600');
    expect(amountCell).toBeInTheDocument();
    expect(amountCell?.textContent).toContain('₹1,500.00');
  });

  it('truncates description at 32 characters with ellipsis', () => {
    const longDescTransaction: Transaction = {
      ...mockTransaction,
      description: 'This is a very long description that exceeds thirty-two characters',
    };

    render(<TransactionRow transaction={longDescTransaction} isEven={true} />);

    // The truncated text has a space before the ellipsis
    expect(screen.getByText(/This is a very long description \.\.\./)).toBeInTheDocument();
  });

  it('shows tooltip for truncated description on hover', async () => {
    const user = userEvent.setup();
    const longDescTransaction: Transaction = {
      ...mockTransaction,
      description: 'This is a very long description that exceeds thirty-two characters',
    };

    render(<TransactionRow transaction={longDescTransaction} isEven={true} />);

    const truncatedText = screen.getByText(/This is a very long description \.\.\./);
    await user.hover(truncatedText);

    // Tooltip should appear with full text
    expect(
      screen.getByText('This is a very long description that exceeds thirty-two characters')
    ).toBeInTheDocument();
  });

  it('abbreviates amount for values >= ₹10,00,000', () => {
    const largeAmountTransaction: Transaction = {
      ...mockTransaction,
      amount: 1500000,
      type: 'income',
    };

    render(<TransactionRow transaction={largeAmountTransaction} isEven={true} />);

    expect(screen.getByText('₹15L')).toBeInTheDocument();
  });

  it('shows tooltip for abbreviated amount on hover', async () => {
    const user = userEvent.setup();
    const largeAmountTransaction: Transaction = {
      ...mockTransaction,
      amount: 1500000,
      type: 'income',
    };

    render(<TransactionRow transaction={largeAmountTransaction} isEven={true} />);

    const abbreviatedAmount = screen.getByText('₹15L');
    await user.hover(abbreviatedAmount);

    // Tooltip should appear with full amount
    expect(screen.getByText(/₹15,00,000.00/)).toBeInTheDocument();
  });

  it('renders Actions column buttons when role is ADMIN', () => {
    useRoleStore.setState({ role: 'ADMIN' });

    render(<TransactionRow transaction={mockTransaction} isEven={true} />);

    expect(screen.getByLabelText('Edit transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete transaction')).toBeInTheDocument();
  });

  it('does not render Actions column when role is ANALYST', () => {
    useRoleStore.setState({ role: 'ANALYST' });

    render(<TransactionRow transaction={mockTransaction} isEven={true} />);

    expect(screen.queryByLabelText('Edit transaction')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete transaction')).not.toBeInTheDocument();
  });

  it('applies white background for even rows', () => {
    const { container } = render(<TransactionRow transaction={mockTransaction} isEven={true} />);

    const row = container.querySelector('tr');
    expect(row).toHaveClass('bg-white');
  });

  it('applies gray-50 background for odd rows', () => {
    const { container } = render(<TransactionRow transaction={mockTransaction} isEven={false} />);

    const row = container.querySelector('tr');
    expect(row).toHaveClass('bg-gray-50');
  });

  it('applies fade-in animation for new rows', () => {
    const { container } = render(
      <TransactionRow transaction={mockTransaction} isEven={true} isNew={true} onEdit={() => {}} onDelete={() => {}} />
    );

    const row = container.querySelector('tr');
    expect(row).toHaveClass('animate-fade-in-from-top');
  });

  it('does not apply fade-in animation for existing rows', () => {
    const { container } = render(
      <TransactionRow transaction={mockTransaction} isEven={true} isNew={false} onEdit={() => {}} onDelete={() => {}} />
    );

    const row = container.querySelector('tr');
    expect(row).not.toHaveClass('animate-fade-in-from-top');
  });

  it('applies fade-out-collapse animation when deleting', async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn();

    render(
      <TransactionRow transaction={mockTransaction} isEven={true} onEdit={() => {}} onDelete={mockDelete} />
    );

    // Click delete button
    const deleteButton = screen.getByLabelText('Delete transaction');
    await user.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByText('Confirm');
    await user.click(confirmButton);

    // Check that animation class is applied
    const row = screen.getByRole('row');
    expect(row).toHaveClass('animate-fade-out-collapse');
  });

  it('respects prefers-reduced-motion via CSS media query', () => {
    // Animation classes are applied to the component
    // The CSS @media (prefers-reduced-motion: reduce) rule handles disabling animations
    const { container } = render(
      <TransactionRow transaction={mockTransaction} isEven={true} isNew={true} onEdit={() => {}} onDelete={() => {}} />
    );

    const row = container.querySelector('tr');
    expect(row).toHaveClass('animate-fade-in-from-top');
    
    // The actual animation disabling is handled by CSS, not component logic
  });
});
