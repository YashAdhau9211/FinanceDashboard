import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Insights } from '../Insights';
import { useTransactionsStore } from '../../stores/transactionsStore';
import type { Transaction } from '../../types';

// Mock PageWrapper
vi.mock('../components/PageWrapper', () => ({
  PageWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

interface InsightCardProps {
  insight: {
    category?: string | null;
    month?: string | null;
    currentMonth?: { income: number; expenses: number };
    currentSavingsRate?: number;
    alerts?: unknown[];
  };
}

// Mock insight components
vi.mock('../components/insights', () => ({
  AISummaryBlock: ({ summary }: { summary: { text: string } }) => (
    <div data-testid="ai-summary-block">{summary.text}</div>
  ),
  TopSpendingCategoryCard: ({ insight }: InsightCardProps) => (
    <div data-testid="top-spending-card">{insight.category || 'No data'}</div>
  ),
  BestIncomeMonthCard: ({ insight }: InsightCardProps) => (
    <div data-testid="best-income-card">{insight.month || 'No data'}</div>
  ),
  WorstExpenseMonthCard: ({ insight }: InsightCardProps) => (
    <div data-testid="worst-expense-card">{insight.month || 'No data'}</div>
  ),
  MonthlyComparisonCard: ({ insight }: InsightCardProps) => (
    <div data-testid="monthly-comparison-card">Income: {insight.currentMonth?.income}</div>
  ),
  SavingsTrendCard: ({ insight }: InsightCardProps) => (
    <div data-testid="savings-trend-card">Rate: {insight.currentSavingsRate?.toFixed(1)}%</div>
  ),
  UnusualSpendingCard: ({ insight }: InsightCardProps) => (
    <div data-testid="unusual-spending-card">Alerts: {insight.alerts?.length}</div>
  ),
}));

// Mock insight computation functions
vi.mock('../utils/insights', () => ({
  getTopSpendingCategory: vi.fn(() => ({
    category: 'groceries',
    amount: 5000,
    percentage: 40,
    chartData: [],
  })),
  getBestIncomeMonth: vi.fn(() => ({
    month: 'March',
    year: 2026,
    amount: 50000,
    percentageChange: 10,
  })),
  getWorstExpenseMonth: vi.fn(() => ({
    month: 'October',
    year: 2025,
    amount: 30000,
    hasOverspend: false,
  })),
  getMonthlyComparison: vi.fn(() => ({
    currentMonth: { income: 50000, expenses: 30000 },
    previousMonth: { income: 45000, expenses: 28000 },
    deltas: { incomeDelta: 11.1, expensesDelta: 7.1 },
  })),
  getSavingsTrend: vi.fn(() => ({
    monthlyData: [],
    currentSavingsRate: 40,
    sixMonthAverage: 35,
  })),
  getUnusualSpending: vi.fn(() => ({
    alerts: [],
  })),
  generateAISummary: vi.fn(() => ({
    text: 'Your best income month was March 2026 with ₹50,000 (10.0% increase). Your top spending category is groceries. Your current savings rate is 40.0%, above your 6-month average of 35.0%.',
  })),
}));

describe('Insights Page', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTransactionsStore.setState({
      transactions: [
        {
          id: '1',
          type: 'income',
          category: 'salary',
          amount: 50000,
          date: '2026-04-01',
          description: 'Monthly salary',
          createdAt: '2026-04-01T00:00:00Z',
          updatedAt: '2026-04-01T00:00:00Z',
        },
        {
          id: '2',
          type: 'expense',
          category: 'groceries',
          amount: 5000,
          date: '2026-04-02',
          description: 'Grocery shopping',
          createdAt: '2026-04-02T00:00:00Z',
          updatedAt: '2026-04-02T00:00:00Z',
        },
      ] as Transaction[],
    });

    // Mock timers for animations
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Page Rendering', () => {
    it('renders all 6 insight cards', () => {
      render(<Insights />);

      expect(screen.getByTestId('top-spending-card')).toBeInTheDocument();
      expect(screen.getByTestId('best-income-card')).toBeInTheDocument();
      expect(screen.getByTestId('worst-expense-card')).toBeInTheDocument();
      expect(screen.getByTestId('monthly-comparison-card')).toBeInTheDocument();
      expect(screen.getByTestId('savings-trend-card')).toBeInTheDocument();
      expect(screen.getByTestId('unusual-spending-card')).toBeInTheDocument();
    });

    it('renders AI summary block', () => {
      render(<Insights />);

      const summaryBlock = screen.getByTestId('ai-summary-block');
      expect(summaryBlock).toBeInTheDocument();
      expect(summaryBlock).toHaveTextContent('Your best income month was March 2026');
    });

    it('displays computed insight data in cards', () => {
      render(<Insights />);

      expect(screen.getByTestId('top-spending-card')).toHaveTextContent('groceries');
      expect(screen.getByTestId('best-income-card')).toHaveTextContent('March');
      expect(screen.getByTestId('worst-expense-card')).toHaveTextContent('October');
      expect(screen.getByTestId('monthly-comparison-card')).toHaveTextContent('Income: 50000');
      expect(screen.getByTestId('savings-trend-card')).toHaveTextContent('Rate: 40.0%');
      expect(screen.getByTestId('unusual-spending-card')).toHaveTextContent('Alerts: 0');
    });
  });

  describe('Responsive Grid Layout', () => {
    it('applies responsive grid classes', () => {
      const { container } = render(<Insights />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
      expect(grid).toHaveClass('gap-6');
    });

    it('applies max-width container classes', () => {
      const { container } = render(<Insights />);

      const pageContainer = container.querySelector('.max-w-7xl');
      expect(pageContainer).toBeInTheDocument();
      expect(pageContainer).toHaveClass('mx-auto');
      expect(pageContainer).toHaveClass('px-4');
      expect(pageContainer).toHaveClass('sm:px-6');
      expect(pageContainer).toHaveClass('lg:px-8');
      expect(pageContainer).toHaveClass('py-8');
    });

    it('applies mb-8 spacing to AI summary block', () => {
      const { container } = render(<Insights />);

      const summaryContainer = container.querySelector('.mb-8');
      expect(summaryContainer).toBeInTheDocument();
    });
  });

  describe('Staggered Animation', () => {
    it('applies initial animation classes to cards', () => {
      const { container } = render(<Insights />);

      const cards = container.querySelectorAll('.insight-card');
      expect(cards).toHaveLength(6);

      cards.forEach((card) => {
        expect(card).toHaveClass('transition-all');
        expect(card).toHaveClass('duration-300');
        expect(card).toHaveClass('ease-out');
      });
    });

    it('animates cards with staggered delays (100ms increments)', async () => {
      const { container } = render(<Insights />);

      const cards = container.querySelectorAll('.insight-card');

      // Fast-forward through all animations
      act(() => {
        vi.advanceTimersByTime(600);
      });

      // After all animations complete, all cards should be visible
      cards.forEach((card) => {
        expect(card).toHaveClass('opacity-100');
        expect(card).toHaveClass('translate-y-0');
      });
    });
  });

  describe('Real-Time Insight Updates', () => {
    it('recomputes insights when transactions change', async () => {
      const { rerender } = render(<Insights />);

      // Initial state
      expect(screen.getByTestId('top-spending-card')).toHaveTextContent('groceries');

      // Add a new transaction
      act(() => {
        useTransactionsStore.setState({
          transactions: [
            ...useTransactionsStore.getState().transactions,
            {
              id: '3',
              type: 'expense',
              category: 'dining',
              amount: 10000,
              date: '2026-04-03',
              description: 'Restaurant',
              createdAt: '2026-04-03T00:00:00Z',
              updatedAt: '2026-04-03T00:00:00Z',
            } as Transaction,
          ],
        });
      });

      // Rerender to trigger update
      rerender(<Insights />);

      // Insights should still render (mocked functions return same data)
      expect(screen.getByTestId('top-spending-card')).toBeInTheDocument();
    });

    it('applies fade transition when transactions update', async () => {
      const { container, rerender } = render(<Insights />);

      // Complete initial animation
      act(() => {
        vi.advanceTimersByTime(600);
      });

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('opacity-100');

      // Update transactions
      act(() => {
        useTransactionsStore.setState({
          transactions: [
            {
              id: '4',
              type: 'income',
              category: 'salary',
              amount: 60000,
              date: '2026-04-01',
              description: 'Salary',
              createdAt: '2026-04-01T00:00:00Z',
              updatedAt: '2026-04-01T00:00:00Z',
            } as Transaction,
          ],
        });
      });

      rerender(<Insights />);

      // Should apply opacity-50 during update
      expect(grid).toHaveClass('opacity-50');

      // Fast-forward 150ms - should return to opacity-100
      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(grid).toHaveClass('opacity-100');
    });

    it('applies fade transition to AI summary block on update', async () => {
      const { container, rerender } = render(<Insights />);

      // Complete initial animation
      act(() => {
        vi.advanceTimersByTime(600);
      });

      const summaryContainer = container.querySelector('.mb-8');
      expect(summaryContainer).toHaveClass('opacity-100');

      // Update transactions
      act(() => {
        useTransactionsStore.setState({
          transactions: [
            {
              id: '5',
              type: 'expense',
              category: 'utilities',
              amount: 2000,
              date: '2026-04-04',
              description: 'Electric bill',
              createdAt: '2026-04-04T00:00:00Z',
              updatedAt: '2026-04-04T00:00:00Z',
            } as Transaction,
          ],
        });
      });

      rerender(<Insights />);

      // Should apply opacity-50 during update
      expect(summaryContainer).toHaveClass('opacity-50');

      // Fast-forward 150ms - should return to opacity-100
      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(summaryContainer).toHaveClass('opacity-100');
    });
  });

  describe('useMemo Optimization', () => {
    it('memoizes insights computation', async () => {
      const { rerender } = render(<Insights />);

      // Get initial call count
      const insightsModule = await import('../../utils/insights');
      const { getTopSpendingCategory } = vi.mocked(insightsModule);
      const initialCallCount = getTopSpendingCategory.mock.calls.length;

      // Rerender without changing transactions
      rerender(<Insights />);

      // Call count should not increase (memoized)
      expect(getTopSpendingCategory.mock.calls.length).toBe(initialCallCount);
    });

    it('recomputes insights when transactions change', async () => {
      const { rerender } = render(<Insights />);

      const insightsModule = await import('../../utils/insights');
      const { getTopSpendingCategory } = vi.mocked(insightsModule);
      const initialCallCount = getTopSpendingCategory.mock.calls.length;

      // Change transactions
      act(() => {
        useTransactionsStore.setState({
          transactions: [
            {
              id: '6',
              type: 'income',
              category: 'freelance',
              amount: 15000,
              date: '2026-04-05',
              description: 'Freelance work',
              createdAt: '2026-04-05T00:00:00Z',
              updatedAt: '2026-04-05T00:00:00Z',
            } as Transaction,
          ],
        });
      });

      rerender(<Insights />);

      // Call count should increase (recomputed)
      expect(getTopSpendingCategory.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty transactions array', () => {
      act(() => {
        useTransactionsStore.setState({ transactions: [] });
      });

      render(<Insights />);

      // Should still render all cards without errors
      expect(screen.getByTestId('top-spending-card')).toBeInTheDocument();
      expect(screen.getByTestId('best-income-card')).toBeInTheDocument();
      expect(screen.getByTestId('worst-expense-card')).toBeInTheDocument();
      expect(screen.getByTestId('monthly-comparison-card')).toBeInTheDocument();
      expect(screen.getByTestId('savings-trend-card')).toBeInTheDocument();
      expect(screen.getByTestId('unusual-spending-card')).toBeInTheDocument();
      expect(screen.getByTestId('ai-summary-block')).toBeInTheDocument();
    });

    it('handles single transaction', () => {
      act(() => {
        useTransactionsStore.setState({
          transactions: [
            {
              id: '1',
              type: 'income',
              category: 'salary',
              amount: 50000,
              date: '2026-04-01',
              description: 'Salary',
              createdAt: '2026-04-01T00:00:00Z',
              updatedAt: '2026-04-01T00:00:00Z',
            } as Transaction,
          ],
        });
      });

      render(<Insights />);

      // Should render without errors
      expect(screen.getByTestId('ai-summary-block')).toBeInTheDocument();
    });
  });
});
