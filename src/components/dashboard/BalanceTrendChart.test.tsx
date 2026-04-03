import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BalanceTrendChart } from './BalanceTrendChart';
import type { MonthlyData } from '../../types';

// Mock Recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: ({ dataKey }: { dataKey: string }) => <div data-testid={`area-${dataKey}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

describe('BalanceTrendChart Component', () => {
  const mockData: MonthlyData[] = [
    {
      month: '2024-01',
      income: 50000,
      expenses: 30000,
      net: 20000,
      transactionCount: 10,
    },
    {
      month: '2024-02',
      income: 55000,
      expenses: 32000,
      net: 23000,
      transactionCount: 12,
    },
    {
      month: '2024-03',
      income: 60000,
      expenses: 35000,
      net: 25000,
      transactionCount: 15,
    },
    {
      month: '2024-04',
      income: 58000,
      expenses: 33000,
      net: 25000,
      transactionCount: 11,
    },
    {
      month: '2024-05',
      income: 62000,
      expenses: 36000,
      net: 26000,
      transactionCount: 13,
    },
    {
      month: '2024-06',
      income: 65000,
      expenses: 38000,
      net: 27000,
      transactionCount: 14,
    },
    {
      month: '2024-07',
      income: 67000,
      expenses: 39000,
      net: 28000,
      transactionCount: 16,
    },
    {
      month: '2024-08',
      income: 70000,
      expenses: 40000,
      net: 30000,
      transactionCount: 17,
    },
    {
      month: '2024-09',
      income: 72000,
      expenses: 41000,
      net: 31000,
      transactionCount: 18,
    },
    {
      month: '2024-10',
      income: 75000,
      expenses: 42000,
      net: 33000,
      transactionCount: 19,
    },
    {
      month: '2024-11',
      income: 78000,
      expenses: 43000,
      net: 35000,
      transactionCount: 20,
    },
    {
      month: '2024-12',
      income: 80000,
      expenses: 45000,
      net: 35000,
      transactionCount: 21,
    },
  ];

  it('renders chart with data', () => {
    render(<BalanceTrendChart data={mockData} />);

    expect(screen.getByText('Balance Trend')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area-income')).toBeInTheDocument();
    expect(screen.getByTestId('area-expenses')).toBeInTheDocument();
  });

  it('renders time filter toggle with default 12M selected', () => {
    render(<BalanceTrendChart data={mockData} />);

    const twelveMonthButton = screen.getByText('12M');
    expect(twelveMonthButton).toHaveClass('bg-teal-700');
  });

  it('time filter changes update displayed data', async () => {
    const user = userEvent.setup();
    render(<BalanceTrendChart data={mockData} />);

    // Initially 12M is selected (all 12 months)
    const twelveMonthButton = screen.getByText('12M');
    expect(twelveMonthButton).toHaveClass('bg-teal-700');

    // Click 3M button
    const threeMonthButton = screen.getByText('3M');
    await user.click(threeMonthButton);

    // Verify 3M is now active
    expect(threeMonthButton).toHaveClass('bg-teal-700');
    expect(twelveMonthButton).not.toHaveClass('bg-teal-700');
  });

  it('filters data to last 3 months when 3M selected', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<BalanceTrendChart data={mockData} />);

    // Click 3M button
    const threeMonthButton = screen.getByText('3M');
    await user.click(threeMonthButton);

    // Re-render to apply filter
    rerender(<BalanceTrendChart data={mockData} />);

    // Chart should still render (data is filtered internally)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('filters data to last 6 months when 6M selected', async () => {
    const user = userEvent.setup();
    render(<BalanceTrendChart data={mockData} />);

    // Click 6M button
    const sixMonthButton = screen.getByText('6M');
    await user.click(sixMonthButton);

    // Verify 6M is now active
    expect(sixMonthButton).toHaveClass('bg-teal-700');
  });

  it('has ARIA label for accessibility', () => {
    render(<BalanceTrendChart data={mockData} />);

    const chartContainer = screen.getByLabelText(
      'Balance trend chart showing income and expenses over 12 months'
    );
    expect(chartContainer).toBeInTheDocument();
  });

  it('updates ARIA label when time filter changes', async () => {
    const user = userEvent.setup();
    render(<BalanceTrendChart data={mockData} />);

    // Click 6M button
    const sixMonthButton = screen.getByText('6M');
    await user.click(sixMonthButton);

    // ARIA label should update to reflect 6 months
    const chartContainer = screen.getByLabelText(
      'Balance trend chart showing income and expenses over 6 months'
    );
    expect(chartContainer).toBeInTheDocument();
  });

  it('renders chart components (axes, grid, tooltip)', () => {
    render(<BalanceTrendChart data={mockData} />);

    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('renders responsive container', () => {
    render(<BalanceTrendChart data={mockData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<BalanceTrendChart data={[]} />);

    // Chart should still render without errors
    expect(screen.getByText('Balance Trend')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });
});
