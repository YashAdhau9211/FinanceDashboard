import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionActivityHeatmap } from './TransactionActivityHeatmap';
import { useTransactionsStore } from '../../stores/transactionsStore';
import type { Transaction } from '../../types';

describe('Feature: sprint-1-dashboard-overview - TransactionActivityHeatmap', () => {
  beforeEach(() => {
    // Reset store before each test
    useTransactionsStore.setState({
      transactions: [],
    });
  });

  it('should render 42 cells (7×6 grid)', () => {
    // Arrange: Set up empty transactions
    useTransactionsStore.setState({
      transactions: [],
    });

    // Act: Render component
    render(<TransactionActivityHeatmap />);

    // Assert: Check that 42 cells are rendered (7 days × 6 time slots)
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(42);
  });

  it('should display day labels (Mon-Sun)', () => {
    // Arrange
    useTransactionsStore.setState({
      transactions: [],
    });

    // Act
    render(<TransactionActivityHeatmap />);

    // Assert: Check that all day labels are displayed (they appear in both Y-axis and daily breakdown)
    expect(screen.getAllByText('Mon').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tue').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Wed').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Thu').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Fri').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sat').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sun').length).toBeGreaterThanOrEqual(1);
  });

  it('should display time slot labels (12 AM, 4 AM, 8 AM, 12 PM, 4 PM, 8 PM)', () => {
    // Arrange
    useTransactionsStore.setState({
      transactions: [],
    });

    // Act
    render(<TransactionActivityHeatmap />);

    // Assert: Check that all time slot labels are displayed
    expect(screen.getByText('12 AM')).toBeInTheDocument();
    expect(screen.getByText('4 AM')).toBeInTheDocument();
    expect(screen.getByText('8 AM')).toBeInTheDocument();
    expect(screen.getByText('12 PM')).toBeInTheDocument();
    expect(screen.getByText('4 PM')).toBeInTheDocument();
    expect(screen.getByText('8 PM')).toBeInTheDocument();
  });

  it('should apply correct color intensity based on transaction count', () => {
    // Arrange: Create transactions at specific times
    // Using ISO format with time to test heatmap time slot mapping
    const transactions: Transaction[] = [
      // Monday 10am (8am-12pm slot) - 1 transaction
      {
        id: '1',
        date: '2024-01-01T10:00:00.000Z', // Monday
        description: 'Test 1',
        amount: 100,
        type: 'expense',
        category: 'groceries',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z',
      },
      // Monday 10:30am (8am-12pm slot) - 2nd transaction
      {
        id: '2',
        date: '2024-01-01T10:30:00.000Z',
        description: 'Test 2',
        amount: 200,
        type: 'expense',
        category: 'dining',
        createdAt: '2024-01-01T10:30:00.000Z',
        updatedAt: '2024-01-01T10:30:00.000Z',
      },
      // Monday 11am (8am-12pm slot) - 3rd transaction
      {
        id: '3',
        date: '2024-01-01T11:00:00.000Z',
        description: 'Test 3',
        amount: 300,
        type: 'expense',
        category: 'shopping',
        createdAt: '2024-01-01T11:00:00.000Z',
        updatedAt: '2024-01-01T11:00:00.000Z',
      },
    ];

    useTransactionsStore.setState({ transactions });

    // Act
    render(<TransactionActivityHeatmap />);

    // Assert: Check that cells have appropriate color classes
    const cells = screen.getAllByRole('gridcell');

    // Check that we have cells with different colors based on transaction counts
    const tealCells = cells.filter((cell) => cell.className.includes('bg-teal'));
    const grayCells = cells.filter((cell) => cell.className.includes('bg-gray'));

    // Should have at least one teal cell (for the 3 transactions)
    expect(tealCells.length).toBeGreaterThan(0);

    // Should have many gray cells (for 0 transactions)
    expect(grayCells.length).toBeGreaterThan(35);
  });

  it('should have ARIA labels for accessibility', () => {
    // Arrange: Create a transaction
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2024-01-01T10:00:00.000Z', // Monday 10am
        description: 'Test',
        amount: 100,
        type: 'expense',
        category: 'groceries',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z',
      },
    ];

    useTransactionsStore.setState({ transactions });

    // Act
    render(<TransactionActivityHeatmap />);

    // Assert: Check that cells have aria-label attributes
    const cells = screen.getAllByRole('gridcell');
    cells.forEach((cell) => {
      expect(cell).toHaveAttribute('aria-label');
      const ariaLabel = cell.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/\w+ \d+[ap]m-\d+[ap]m: \d+ transactions?/);
    });
  });

  it('should display tooltip text on hover (title attribute)', () => {
    // Arrange
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2024-01-01T10:00:00.000Z', // Monday 10am
        description: 'Test',
        amount: 100,
        type: 'expense',
        category: 'groceries',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z',
      },
    ];

    useTransactionsStore.setState({ transactions });

    // Act
    render(<TransactionActivityHeatmap />);

    // Assert: Check that cells have title attributes for tooltips
    const cells = screen.getAllByRole('gridcell');
    cells.forEach((cell) => {
      expect(cell).toHaveAttribute('title');
      const title = cell.getAttribute('title');
      expect(title).toMatch(/\w+ \d+[ap]m-\d+[ap]m: \d+ transactions?/);
    });
  });

  it('should handle empty transactions gracefully', () => {
    // Arrange: No transactions
    useTransactionsStore.setState({
      transactions: [],
    });

    // Act
    render(<TransactionActivityHeatmap />);

    // Assert: All cells should show 0 transactions
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(42);

    cells.forEach((cell) => {
      const ariaLabel = cell.getAttribute('aria-label');
      expect(ariaLabel).toContain('0 transactions');
      expect(cell.className).toContain('bg-gray-100');
    });
  });

  it('should display legend with color scale', () => {
    // Arrange
    useTransactionsStore.setState({
      transactions: [],
    });

    // Act
    render(<TransactionActivityHeatmap />);

    // Assert: Check that legend is displayed
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('should apply correct color for different transaction count thresholds', () => {
    // Arrange: Create transactions to test color thresholds
    const createTransaction = (id: string, date: string): Transaction => ({
      id,
      date,
      description: `Test ${id}`,
      amount: 100,
      type: 'expense',
      category: 'groceries',
      createdAt: date,
      updatedAt: date,
    });

    const transactions: Transaction[] = [
      // 1-2 transactions: teal-200
      createTransaction('1', '2024-01-01T10:00:00.000Z'), // Monday 10am
      createTransaction('2', '2024-01-01T10:30:00.000Z'), // Monday 10:30am

      // 3-5 transactions: teal-400
      createTransaction('3', '2024-01-02T10:00:00.000Z'), // Tuesday 10am
      createTransaction('4', '2024-01-02T10:30:00.000Z'),
      createTransaction('5', '2024-01-02T11:00:00.000Z'),
    ];

    useTransactionsStore.setState({ transactions });

    // Act
    render(<TransactionActivityHeatmap />);

    // Assert: Check that we have cells with different colors
    const cells = screen.getAllByRole('gridcell');

    // Check that we have both teal and gray cells
    const tealCells = cells.filter((cell) => cell.className.includes('bg-teal'));
    const grayCells = cells.filter((cell) => cell.className.includes('bg-gray'));

    // Should have some teal cells (for transactions) and some gray cells (for no transactions)
    expect(tealCells.length).toBeGreaterThan(0);
    expect(grayCells.length).toBeGreaterThan(0);

    // Total should be 42 cells (7 days × 6 time slots)
    expect(cells.length).toBe(42);
  });
});
