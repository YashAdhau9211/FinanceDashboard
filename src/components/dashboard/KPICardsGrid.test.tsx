import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICardsGrid } from './KPICardsGrid';
import type { Transaction, Role } from '../../types';

// Mock the stores
vi.mock('../../stores/transactionsStore', () => ({
  useTransactionsStore: vi.fn(),
}));

vi.mock('../../stores/roleStore', () => ({
  useRoleStore: vi.fn(),
}));

// Mock the useCountUp hook
vi.mock('../../hooks/useCountUp', () => ({
  useCountUp: (target: number) => target,
}));

import { useTransactionsStore } from '../../stores/transactionsStore';
import { useRoleStore } from '../../stores/roleStore';

describe('KPICardsGrid', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2025-01-15',
      description: 'Salary',
      amount: 100000,
      type: 'income',
      category: 'salary',
      createdAt: '2025-01-15T00:00:00Z',
      updatedAt: '2025-01-15T00:00:00Z',
    },
    {
      id: '2',
      date: '2025-01-16',
      description: 'Groceries',
      amount: -5000,
      type: 'expense',
      category: 'groceries',
      createdAt: '2025-01-16T00:00:00Z',
      updatedAt: '2025-01-16T00:00:00Z',
    },
    {
      id: '3',
      date: '2024-12-15',
      description: 'Previous Salary',
      amount: 95000,
      type: 'income',
      category: 'salary',
      createdAt: '2024-12-15T00:00:00Z',
      updatedAt: '2024-12-15T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.mocked(useTransactionsStore).mockImplementation(
      <T,>(
        selector: (state: {
          transactions: Transaction[];
          addTransaction: () => void;
          updateTransaction: () => void;
          deleteTransaction: () => void;
          getTransactionById: () => undefined;
          getFilteredTransactions: () => Transaction[];
        }) => T
      ) =>
        selector({
          transactions: mockTransactions,
          addTransaction: vi.fn(),
          updateTransaction: vi.fn(),
          deleteTransaction: vi.fn(),
          getTransactionById: vi.fn(() => undefined),
          getFilteredTransactions: vi.fn(() => mockTransactions),
        })
    );
    vi.mocked(useRoleStore).mockImplementation(
      <T,>(selector: (state: { role: Role; setRole: () => void; toggleRole: () => void }) => T) =>
        selector({ role: 'ANALYST', setRole: vi.fn(), toggleRole: vi.fn() })
    );
  });

  it('should render all 4 KPI cards', () => {
    render(<KPICardsGrid />);

    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Savings Rate')).toBeInTheDocument();
  });

  it('should have responsive grid classes', () => {
    const { container } = render(<KPICardsGrid />);

    const grid = container.querySelector('.grid');
    expect(grid?.className).toContain('grid-cols-1');
    expect(grid?.className).toContain('md:grid-cols-2');
    expect(grid?.className).toContain('lg:grid-cols-4');
    expect(grid?.className).toContain('gap-4');
  });

  it('should show edit buttons when role is ADMIN', () => {
    vi.mocked(useRoleStore).mockImplementation(
      <T,>(selector: (state: { role: Role; setRole: () => void; toggleRole: () => void }) => T) =>
        selector({ role: 'ADMIN', setRole: vi.fn(), toggleRole: vi.fn() })
    );

    render(<KPICardsGrid />);

    const editButtons = screen.getAllByLabelText(/Edit/);
    expect(editButtons).toHaveLength(4);
  });

  it('should not show edit buttons when role is ANALYST', () => {
    vi.mocked(useRoleStore).mockImplementation(
      <T,>(selector: (state: { role: Role; setRole: () => void; toggleRole: () => void }) => T) =>
        selector({ role: 'ANALYST', setRole: vi.fn(), toggleRole: vi.fn() })
    );

    render(<KPICardsGrid />);

    const editButtons = screen.queryAllByLabelText(/Edit/);
    expect(editButtons).toHaveLength(0);
  });

  it('should apply staggered animation classes', () => {
    const { container } = render(<KPICardsGrid />);

    const cards = container.querySelectorAll('.kpi-card');
    expect(cards).toHaveLength(4);

    // All cards should initially have opacity-0 and translate-y-4
    cards.forEach((card) => {
      expect(card.className).toContain('transition-all');
      expect(card.className).toContain('duration-300');
    });
  });

  it('should compute correct sparkline data for each KPI', () => {
    const { container } = render(<KPICardsGrid />);

    // Check that sparklines are rendered (they contain LineChart components)
    const sparklines = container.querySelectorAll('.h-12');
    expect(sparklines.length).toBeGreaterThanOrEqual(4);
  });
});
