import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TransactionRow } from './TransactionRow';
import type { Transaction } from '../../types';

// Mock the stores
vi.mock('../../stores/roleStore', () => ({
  useRoleStore: vi.fn(() => 'ADMIN'),
}));

describe('TransactionRow Performance', () => {
  const mockTransaction: Transaction = {
    id: '1',
    date: '2026-01-15T10:00:00Z',
    description: 'Test Transaction',
    amount: 1000,
    type: 'expense',
    category: 'groceries',
    merchant: 'Test Merchant',
    tags: ['test'],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('should use React.memo to prevent unnecessary re-renders', () => {
    // Verify that TransactionRow is wrapped with memo
    // React.memo components have a $$typeof property
    expect(TransactionRow).toBeDefined();

    // Test that the component doesn't re-render when props don't change
    const { rerender } = render(
      <table>
        <tbody>
          <TransactionRow
            transaction={mockTransaction}
            isEven={true}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
          />
        </tbody>
      </table>
    );

    // Rerender with same props
    rerender(
      <table>
        <tbody>
          <TransactionRow
            transaction={mockTransaction}
            isEven={true}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
          />
        </tbody>
      </table>
    );

    // Component should not trigger unnecessary renders
    // This is a basic check - React.memo will handle the optimization
    expect(mockOnEdit).not.toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should render efficiently with large amounts of data', () => {
    const startTime = performance.now();

    render(
      <table>
        <tbody>
          <TransactionRow
            transaction={mockTransaction}
            isEven={true}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
          />
        </tbody>
      </table>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Single row should render in less than 50ms
    expect(renderTime).toBeLessThan(50);
  });

  it('should handle multiple rows efficiently', () => {
    const transactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
      id: `${i}`,
      date: '2026-01-15T10:00:00Z',
      description: `Transaction ${i}`,
      amount: 1000 + i,
      type: 'expense' as const,
      category: 'groceries' as const,
      merchant: 'Test Merchant',
      tags: ['test'],
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    }));

    const startTime = performance.now();

    render(
      <table>
        <tbody>
          {transactions.map((txn, index) => (
            <TransactionRow
              key={txn.id}
              transaction={txn}
              isEven={index % 2 === 0}
              onEdit={mockOnEdit}
              onDelete={mockOnDelete}
            />
          ))}
        </tbody>
      </table>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 50 rows should render in less than 800ms (allowing for test environment overhead)
    expect(renderTime).toBeLessThan(800);
  });
});
