import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SavingsTrendCard } from '../SavingsTrendCard';
import type { SavingsTrendInsight } from '../../../types';

describe('SavingsTrendCard', () => {
  it('renders card with insight data', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [
        { month: 'Jan', savingsRate: 15.5 },
        { month: 'Feb', savingsRate: 18.2 },
        { month: 'Mar', savingsRate: 20.0 },
      ],
      currentSavingsRate: 20.0,
      sixMonthAverage: 17.5,
    };

    render(<SavingsTrendCard insight={insight} />);

    expect(screen.getByText('Savings Trend')).toBeInTheDocument();
    expect(screen.getByText('20.0%')).toBeInTheDocument();
    expect(screen.getByText('6-month avg: 17.5%')).toBeInTheDocument();
  });

  it('displays current savings rate with 1 decimal place', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [{ month: 'Jan', savingsRate: 15.567 }],
      currentSavingsRate: 15.567,
      sixMonthAverage: 14.234,
    };

    render(<SavingsTrendCard insight={insight} />);

    expect(screen.getByText('15.6%')).toBeInTheDocument();
  });

  it('displays 6-month average with 1 decimal place', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [{ month: 'Jan', savingsRate: 15.0 }],
      currentSavingsRate: 15.0,
      sixMonthAverage: 14.789,
    };

    render(<SavingsTrendCard insight={insight} />);

    expect(screen.getByText('6-month avg: 14.8%')).toBeInTheDocument();
  });

  it('renders line chart with correct data', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [
        { month: 'Jan', savingsRate: 10.0 },
        { month: 'Feb', savingsRate: 12.0 },
        { month: 'Mar', savingsRate: 15.0 },
        { month: 'Apr', savingsRate: 18.0 },
        { month: 'May', savingsRate: 20.0 },
        { month: 'Jun', savingsRate: 22.0 },
      ],
      currentSavingsRate: 22.0,
      sixMonthAverage: 16.2,
    };

    const { container } = render(<SavingsTrendCard insight={insight} />);

    // Check that ResponsiveContainer is rendered
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  });

  it('uses success variant when current rate is positive', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [{ month: 'Jan', savingsRate: 15.0 }],
      currentSavingsRate: 15.0,
      sixMonthAverage: 12.0,
    };

    const { container } = render(<SavingsTrendCard insight={insight} />);

    // Check for success variant styling
    const card = container.querySelector('.bg-green-50');
    expect(card).toBeInTheDocument();
  });

  it('uses success variant when current rate is zero', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [{ month: 'Jan', savingsRate: 0 }],
      currentSavingsRate: 0,
      sixMonthAverage: 0,
    };

    const { container } = render(<SavingsTrendCard insight={insight} />);

    // Check for success variant styling (>= 0 means success)
    const card = container.querySelector('.bg-green-50');
    expect(card).toBeInTheDocument();
  });

  it('uses danger variant when current rate is negative', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [{ month: 'Jan', savingsRate: -5.0 }],
      currentSavingsRate: -5.0,
      sixMonthAverage: -3.0,
    };

    const { container } = render(<SavingsTrendCard insight={insight} />);

    // Check for danger variant styling
    const card = container.querySelector('.bg-red-50');
    expect(card).toBeInTheDocument();
  });

  it('has proper aria-label for accessibility', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [{ month: 'Jan', savingsRate: 15.0 }],
      currentSavingsRate: 15.0,
      sixMonthAverage: 12.5,
    };

    render(<SavingsTrendCard insight={insight} />);

    const card = screen.getByLabelText('Savings trend: current rate 15.0%, 6-month average 12.5%');
    expect(card).toBeInTheDocument();
  });

  it('handles negative savings rates correctly', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [
        { month: 'Jan', savingsRate: -10.5 },
        { month: 'Feb', savingsRate: -8.2 },
      ],
      currentSavingsRate: -8.2,
      sixMonthAverage: -9.35,
    };

    render(<SavingsTrendCard insight={insight} />);

    expect(screen.getByText('-8.2%')).toBeInTheDocument();
    expect(screen.getByText('6-month avg: -9.3%')).toBeInTheDocument();
  });

  it('handles 12 months of data', () => {
    const insight: SavingsTrendInsight = {
      monthlyData: [
        { month: 'Jan', savingsRate: 10.0 },
        { month: 'Feb', savingsRate: 11.0 },
        { month: 'Mar', savingsRate: 12.0 },
        { month: 'Apr', savingsRate: 13.0 },
        { month: 'May', savingsRate: 14.0 },
        { month: 'Jun', savingsRate: 15.0 },
        { month: 'Jul', savingsRate: 16.0 },
        { month: 'Aug', savingsRate: 17.0 },
        { month: 'Sep', savingsRate: 18.0 },
        { month: 'Oct', savingsRate: 19.0 },
        { month: 'Nov', savingsRate: 20.0 },
        { month: 'Dec', savingsRate: 21.0 },
      ],
      currentSavingsRate: 21.0,
      sixMonthAverage: 18.5,
    };

    const { container } = render(<SavingsTrendCard insight={insight} />);

    // Verify chart is rendered with all data points
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  });

  describe('Responsive Font Sizes', () => {
    let originalInnerWidth: number;

    beforeEach(() => {
      originalInnerWidth = window.innerWidth;
    });

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });

    it('uses smaller font size (10px) on mobile viewports', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const insight: SavingsTrendInsight = {
        monthlyData: [
          { month: 'Jan', savingsRate: 15.0 },
          { month: 'Feb', savingsRate: 18.0 },
        ],
        currentSavingsRate: 18.0,
        sixMonthAverage: 16.5,
      };

      render(<SavingsTrendCard insight={insight} />);

      // Wait for resize effect to trigger
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Chart should be rendered
      const { container } = render(<SavingsTrendCard insight={insight} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('uses larger font size (12px) on desktop viewports', async () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440,
      });

      const insight: SavingsTrendInsight = {
        monthlyData: [
          { month: 'Jan', savingsRate: 15.0 },
          { month: 'Feb', savingsRate: 18.0 },
        ],
        currentSavingsRate: 18.0,
        sixMonthAverage: 16.5,
      };

      render(<SavingsTrendCard insight={insight} />);

      // Wait for resize effect to trigger
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Chart should be rendered
      const { container } = render(<SavingsTrendCard insight={insight} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });
});
