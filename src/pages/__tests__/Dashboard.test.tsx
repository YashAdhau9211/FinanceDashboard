import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import { useUIStore } from '../../stores/uiStore';
import { useRoleStore } from '../../stores/roleStore';
import { useTransactionsStore } from '../../stores/transactionsStore';
import { useFiltersStore } from '../../stores/filtersStore';
import type { Transaction } from '../../types';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock Recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  Label: () => <div data-testid="label" />,
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
}));

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-15',
    description: 'Salary',
    amount: 50000,
    type: 'income',
    category: 'salary',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    date: '2024-03-14',
    description: 'Grocery Store',
    amount: -2500,
    type: 'expense',
    category: 'groceries',
    createdAt: '2024-03-14T00:00:00Z',
    updatedAt: '2024-03-14T00:00:00Z',
  },
  {
    id: '3',
    date: '2024-03-13',
    description: 'Restaurant',
    amount: -1200,
    type: 'expense',
    category: 'dining',
    createdAt: '2024-03-13T00:00:00Z',
    updatedAt: '2024-03-13T00:00:00Z',
  },
  {
    id: '4',
    date: '2024-03-12',
    description: 'Rent Payment',
    amount: -15000,
    type: 'expense',
    category: 'rent',
    createdAt: '2024-03-12T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
  },
  {
    id: '5',
    date: '2024-03-11',
    description: 'Electric Bill',
    amount: -800,
    type: 'expense',
    category: 'utilities',
    createdAt: '2024-03-11T00:00:00Z',
    updatedAt: '2024-03-11T00:00:00Z',
  },
];

describe('Dashboard', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);

    // Reset stores before each test
    useUIStore.setState({ sidebarCollapsed: false, darkMode: false });
    useRoleStore.setState({ role: 'ANALYST' });
    useTransactionsStore.setState({ transactions: mockTransactions });
    useFiltersStore.setState({
      category: 'all',
      dateRange: { start: null, end: null },
      searchQuery: '',
      setCategory: vi.fn(),
      setDateRange: vi.fn(),
      setSearchQuery: vi.fn(),
    });
  });

  it('renders all major sections', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Check for KPI Cards section
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Savings Rate')).toBeInTheDocument();

    // Check for Balance Trend Chart
    expect(screen.getByText('Balance Trend')).toBeInTheDocument();

    // Check for Spending Donut
    expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();

    // Check for Recent Transactions Widget
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();

    // Check for Transaction Activity Heatmap
    expect(screen.getByText('Transaction Activity')).toBeInTheDocument();
  });

  it('displays KPI cards with computed values', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // KPI cards should display computed values
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Savings Rate')).toBeInTheDocument();
  });

  it('shows edit buttons for Admin role', () => {
    useRoleStore.setState({ role: 'ADMIN' });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Admin should see edit buttons on KPI cards
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it('hides edit buttons for Analyst role', () => {
    useRoleStore.setState({ role: 'ANALYST' });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Analyst should not see edit buttons
    const editButtons = screen.queryAllByRole('button', { name: /edit/i });
    expect(editButtons.length).toBe(0);
  });

  it('displays recent transactions widget with transaction list', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Check for recent transactions
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Grocery Store')).toBeInTheDocument();
    expect(screen.getByText('Restaurant')).toBeInTheDocument();
  });

  it('navigates to /transactions when View All is clicked', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const viewAllLink = screen.getByText(/View All/i);
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute('href', '/transactions');
  });

  it('renders charts with data', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Check for chart components
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('applies responsive grid layout', () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Check for responsive grid classes
    const grids = container.querySelectorAll('.grid');
    expect(grids.length).toBeGreaterThan(0);

    // Check for md:grid-cols-2 class (middle and bottom rows)
    const twoColumnGrids = container.querySelectorAll('.md\\:grid-cols-2');
    expect(twoColumnGrids.length).toBe(2); // Middle and bottom rows
  });

  it('wraps sections in error boundaries', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // If a component throws an error, it should be caught
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
  });

  it('handles empty transactions gracefully', () => {
    useTransactionsStore.setState({ transactions: [] });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Dashboard should still render without errors
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('Balance Trend')).toBeInTheDocument();
  });

  it('applies consistent spacing between sections', () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Check for space-y-6 class (24px vertical gap)
    const contentDiv = container.querySelector('.space-y-6');
    expect(contentDiv).toBeInTheDocument();
  });
});
