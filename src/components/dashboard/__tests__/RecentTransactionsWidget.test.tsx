import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecentTransactionsWidget } from '../RecentTransactionsWidget';
import type { Transaction } from '../../../types';

// Helper to wrap component with Router
function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('RecentTransactionsWidget', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2025-01-15',
      description: 'Grocery Shopping',
      amount: 2500,
      type: 'expense',
      category: 'groceries',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
    },
    {
      id: '2',
      date: '2025-01-14',
      description: 'Salary Deposit',
      amount: 50000,
      type: 'income',
      category: 'salary',
      createdAt: '2025-01-14T09:00:00Z',
      updatedAt: '2025-01-14T09:00:00Z',
    },
    {
      id: '3',
      date: '2025-01-13',
      description: 'Restaurant Dinner',
      amount: 1200,
      type: 'expense',
      category: 'dining',
      createdAt: '2025-01-13T20:00:00Z',
      updatedAt: '2025-01-13T20:00:00Z',
    },
    {
      id: '4',
      date: '2025-01-12',
      description: 'Transfer to Savings',
      amount: 10000,
      type: 'transfer',
      category: 'transfer',
      createdAt: '2025-01-12T15:00:00Z',
      updatedAt: '2025-01-12T15:00:00Z',
    },
    {
      id: '5',
      date: '2025-01-11',
      description: 'Uber Ride',
      amount: 350,
      type: 'expense',
      category: 'transportation',
      createdAt: '2025-01-11T18:00:00Z',
      updatedAt: '2025-01-11T18:00:00Z',
    },
  ];

  it('should render 5 transactions', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
    expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
    expect(screen.getByText('Restaurant Dinner')).toBeInTheDocument();
    expect(screen.getByText('Transfer to Savings')).toBeInTheDocument();
    expect(screen.getByText('Uber Ride')).toBeInTheDocument();
  });

  it('should display transaction descriptions', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    mockTransactions.forEach((transaction) => {
      expect(screen.getByText(transaction.description)).toBeInTheDocument();
    });
  });

  it('should display formatted dates', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument();
    expect(screen.getByText('Jan 14, 2025')).toBeInTheDocument();
    expect(screen.getByText('Jan 13, 2025')).toBeInTheDocument();
  });

  it('should display formatted amounts', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    expect(screen.getByText('-₹2,500.00')).toBeInTheDocument();
    expect(screen.getByText('+₹50,000.00')).toBeInTheDocument();
    expect(screen.getByText('-₹1,200.00')).toBeInTheDocument();
  });

  it('should color-code income amounts in green', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    const incomeAmount = screen.getByText('+₹50,000.00');
    expect(incomeAmount).toHaveClass('text-green-700');
  });

  it('should color-code expense amounts in red', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    const expenseAmount = screen.getByText('-₹2,500.00');
    expect(expenseAmount).toHaveClass('text-red-700');
  });

  it('should color-code transfer amounts in gray', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    const transferAmount = screen.getByText('₹10,000.00');
    expect(transferAmount).toHaveClass('text-gray-600');
  });

  it('should prefix income amounts with +', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    expect(screen.getByText('+₹50,000.00')).toBeInTheDocument();
  });

  it('should prefix expense amounts with -', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    expect(screen.getByText('-₹2,500.00')).toBeInTheDocument();
    expect(screen.getByText('-₹1,200.00')).toBeInTheDocument();
  });

  it('should not prefix transfer amounts', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    const transferAmount = screen.getByText('₹10,000.00');
    expect(transferAmount.textContent).not.toMatch(/^[+-]/);
  });

  it('should display "View All" link', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    const viewAllLink = screen.getByText('View All →');
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute('href', '/transactions');
  });

  it('should use semantic HTML with ul/li structure', () => {
    const { container } = renderWithRouter(
      <RecentTransactionsWidget transactions={mockTransactions} />
    );

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();

    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(5);
  });

  it('should display category icons for each transaction', () => {
    const { container } = renderWithRouter(
      <RecentTransactionsWidget transactions={mockTransactions} />
    );

    // Check that icon containers exist (one for each transaction)
    const iconContainers = container.querySelectorAll('.w-10.h-10.rounded-full');
    expect(iconContainers).toHaveLength(5);
  });

  it('should handle empty transactions array', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={[]} />);

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('View All →')).toBeInTheDocument();

    const { container } = render(
      <BrowserRouter>
        <RecentTransactionsWidget transactions={[]} />
      </BrowserRouter>
    );
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(0);
  });

  it('should render component title', () => {
    renderWithRouter(<RecentTransactionsWidget transactions={mockTransactions} />);

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
  });
});
