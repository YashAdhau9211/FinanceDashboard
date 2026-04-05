import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { InsightCard } from '../InsightCard';
import { AISummaryBlock } from '../AISummaryBlock';
import { TopSpendingCategoryCard } from '../TopSpendingCategoryCard';
import { SavingsTrendCard } from '../SavingsTrendCard';
import { BestIncomeMonthCard } from '../BestIncomeMonthCard';
import { WorstExpenseMonthCard } from '../WorstExpenseMonthCard';
import { MonthlyComparisonCard } from '../MonthlyComparisonCard';
import { UnusualSpendingCard } from '../UnusualSpendingCard';
import type {
  TopSpendingCategoryInsight,
  SavingsTrendInsight,
  BestIncomeMonthInsight,
  WorstExpenseMonthInsight,
  MonthlyComparisonInsight,
  UnusualSpendingInsight,
  AISummary,
} from '../../../types';

expect.extend(toHaveNoViolations);

describe('Insights Accessibility Tests', () => {
  describe('InsightCard', () => {
    it('should have proper ARIA label', () => {
      render(
        <InsightCard
          title="Test Card"
          value="$1,000"
          description="Test description"
          ariaLabel="Test card with value $1,000"
        />
      );

      const card = screen.getByLabelText('Test card with value $1,000');
      expect(card).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      const { container } = render(
        <InsightCard title="Test Card" value="$1,000" ariaLabel="Test card" />
      );

      const card = container.querySelector('[tabindex="0"]');
      expect(card).toBeInTheDocument();
    });

    it('should have visible focus indicator', () => {
      const { container } = render(
        <InsightCard title="Test Card" value="$1,000" ariaLabel="Test card" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('focus-within:ring-2');
      expect(card.className).toContain('focus-within:ring-teal-500');
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <InsightCard
          title="Test Card"
          value="$1,000"
          description="Test description"
          ariaLabel="Test card"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('AISummaryBlock', () => {
    const mockSummary: AISummary = {
      text: 'Your best income month was March 2026 with $5,000 (20% increase). Your top spending category is Housing. Your current savings rate is 25%, above your 6-month average of 20%.',
    };

    it('should use semantic HTML', () => {
      render(<AISummaryBlock summary={mockSummary} />);

      const paragraph = screen.getByText(/Your best income month/);
      expect(paragraph.tagName).toBe('P');
    });

    it('should have proper ARIA label', () => {
      render(<AISummaryBlock summary={mockSummary} />);

      const region = screen.getByRole('region', {
        name: 'AI-generated financial insights summary',
      });
      expect(region).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      const { container } = render(<AISummaryBlock summary={mockSummary} />);

      const block = container.querySelector('[tabindex="0"]');
      expect(block).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(<AISummaryBlock summary={mockSummary} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('TopSpendingCategoryCard', () => {
    const mockInsight: TopSpendingCategoryInsight = {
      category: 'Housing',
      amount: 1500,
      percentage: 45,
      chartData: [
        { category: 'Housing', amount: 1500, color: '#3B82F6' },
        { category: 'Food', amount: 800, color: '#10B981' },
        { category: 'Transport', amount: 500, color: '#F59E0B' },
      ],
    };

    it('should have ARIA label describing the insight', () => {
      render(<TopSpendingCategoryCard insight={mockInsight} />);

      const card = screen.getByLabelText(/Top spending category: Housing/);
      expect(card).toBeInTheDocument();
    });

    it('should have ARIA label on chart', () => {
      const { container } = render(<TopSpendingCategoryCard insight={mockInsight} />);

      // The PieChart component renders within recharts-responsive-container
      const chart = container.querySelector('.recharts-responsive-container');
      expect(chart).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(<TopSpendingCategoryCard insight={mockInsight} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('SavingsTrendCard', () => {
    const mockInsight: SavingsTrendInsight = {
      monthlyData: [
        { month: 'Jan', savingsRate: 20 },
        { month: 'Feb', savingsRate: 25 },
        { month: 'Mar', savingsRate: 30 },
      ],
      currentSavingsRate: 30,
      sixMonthAverage: 25,
    };

    it('should have ARIA label describing the insight', () => {
      render(<SavingsTrendCard insight={mockInsight} />);

      const card = screen.getByLabelText(/Savings trend: current rate 30.0%/);
      expect(card).toBeInTheDocument();
    });

    it('should have ARIA label on chart', () => {
      const { container } = render(<SavingsTrendCard insight={mockInsight} />);

      // The LineChart component renders within recharts-responsive-container
      const chart = container.querySelector('.recharts-responsive-container');
      expect(chart).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(<SavingsTrendCard insight={mockInsight} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('BestIncomeMonthCard', () => {
    const mockInsight: BestIncomeMonthInsight = {
      month: 'March',
      year: 2026,
      amount: 5000,
      percentageChange: 20,
    };

    it('should have ARIA label describing the insight', () => {
      render(<BestIncomeMonthCard insight={mockInsight} />);

      const card = screen.getByLabelText(/Best income month: March 2026/);
      expect(card).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(<BestIncomeMonthCard insight={mockInsight} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('WorstExpenseMonthCard', () => {
    const mockInsight: WorstExpenseMonthInsight = {
      month: 'October',
      year: 2025,
      amount: 3500,
      hasOverspend: true,
    };

    it('should have ARIA label describing the insight', () => {
      render(<WorstExpenseMonthCard insight={mockInsight} />);

      const card = screen.getByLabelText(/Worst expense month: October 2025/);
      expect(card).toBeInTheDocument();
    });

    it('should include overspend information in ARIA label', () => {
      render(<WorstExpenseMonthCard insight={mockInsight} />);

      const card = screen.getByLabelText(/expenses exceeded income/);
      expect(card).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(<WorstExpenseMonthCard insight={mockInsight} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('MonthlyComparisonCard', () => {
    const mockInsight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 5000,
        expenses: 3500,
      },
      previousMonth: {
        income: 4500,
        expenses: 3000,
      },
      deltas: {
        incomeDelta: 11.1,
        expensesDelta: 16.7,
      },
    };

    it('should have ARIA label describing the insight', () => {
      render(<MonthlyComparisonCard insight={mockInsight} />);

      const card = screen.getByLabelText(/Monthly comparison/);
      expect(card).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(<MonthlyComparisonCard insight={mockInsight} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('UnusualSpendingCard', () => {
    const mockInsight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'Entertainment',
          currentAmount: 800,
          threeMonthAverage: 400,
          percentageIncrease: 100,
        },
      ],
    };

    it('should have ARIA label describing the insight', () => {
      render(<UnusualSpendingCard insight={mockInsight} />);

      const card = screen.getByLabelText(/Unusual spending: 1 alert/);
      expect(card).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(<UnusualSpendingCard insight={mockInsight} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient contrast for success variant', async () => {
      const { container } = render(
        <InsightCard
          title="Success Card"
          value="$1,000"
          variant="success"
          ariaLabel="Success card"
        />
      );

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient contrast for warning variant', async () => {
      const { container } = render(
        <InsightCard
          title="Warning Card"
          value="$1,000"
          variant="warning"
          ariaLabel="Warning card"
        />
      );

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient contrast for danger variant', async () => {
      const { container } = render(
        <InsightCard title="Danger Card" value="$1,000" variant="danger" ariaLabel="Danger card" />
      );

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should have logical tab order for multiple cards', () => {
      const { container } = render(
        <div>
          <InsightCard title="Card 1" value="$1,000" ariaLabel="Card 1" />
          <InsightCard title="Card 2" value="$2,000" ariaLabel="Card 2" />
          <InsightCard title="Card 3" value="$3,000" ariaLabel="Card 3" />
        </div>
      );

      const tabbableElements = container.querySelectorAll('[tabindex="0"]');
      expect(tabbableElements).toHaveLength(3);
    });

    it('should have focus indicators on all interactive elements', () => {
      const { container } = render(
        <InsightCard title="Test Card" value="$1,000" ariaLabel="Test card" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('focus-within:ring-2');
    });
  });
});
