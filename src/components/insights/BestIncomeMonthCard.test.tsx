import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BestIncomeMonthCard } from './BestIncomeMonthCard';
import type { BestIncomeMonthInsight } from '../../types';

describe('BestIncomeMonthCard', () => {
  it('should render card with insight data', () => {
    const insight: BestIncomeMonthInsight = {
      month: 'March',
      year: 2026,
      amount: 75000,
      percentageChange: 12.5,
    };

    render(<BestIncomeMonthCard insight={insight} />);

    expect(screen.getByText('Best Income Month')).toBeInTheDocument();
    expect(screen.getByText('March 2026')).toBeInTheDocument();
    expect(screen.getByText('₹75,000.00')).toBeInTheDocument();
  });

  it('should format month and year correctly', () => {
    const insight: BestIncomeMonthInsight = {
      month: 'December',
      year: 2025,
      amount: 100000,
      percentageChange: 5.0,
    };

    render(<BestIncomeMonthCard insight={insight} />);

    expect(screen.getByText('December 2025')).toBeInTheDocument();
  });

  it('should format amount using formatCurrency', () => {
    const insight: BestIncomeMonthInsight = {
      month: 'January',
      year: 2026,
      amount: 123456.78,
      percentageChange: 8.3,
    };

    render(<BestIncomeMonthCard insight={insight} />);

    expect(screen.getByText('₹1,23,456.78')).toBeInTheDocument();
  });

  it('should display percentage change with one decimal place', () => {
    const insight: BestIncomeMonthInsight = {
      month: 'April',
      year: 2026,
      amount: 80000,
      percentageChange: 15.678,
    };

    render(<BestIncomeMonthCard insight={insight} />);

    expect(screen.getByText('vs Previous Month')).toBeInTheDocument();
    expect(screen.getByText('+15.7%', { exact: false })).toBeInTheDocument();
  });

  it('should render TrendingUp icon when data is available', () => {
    const insight: BestIncomeMonthInsight = {
      month: 'May',
      year: 2026,
      amount: 90000,
      percentageChange: 10.0,
    };

    const { container } = render(<BestIncomeMonthCard insight={insight} />);

    // Check for TrendingUp icon by looking for the svg element with white color inside green background
    const icon = container.querySelector('.text-white');
    expect(icon).toBeInTheDocument();
  });

  it('should display placeholder message when no data is available', () => {
    const insight: BestIncomeMonthInsight = {
      month: null,
      year: null,
      amount: 0,
      percentageChange: 0,
    };

    render(<BestIncomeMonthCard insight={insight} />);

    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.queryByText(/vs previous month/)).not.toBeInTheDocument();
  });

  it('should not render TrendingUp icon when no data is available', () => {
    const insight: BestIncomeMonthInsight = {
      month: null,
      year: null,
      amount: 0,
      percentageChange: 0,
    };

    const { container } = render(<BestIncomeMonthCard insight={insight} />);

    const icon = container.querySelector('.text-green-500');
    expect(icon).not.toBeInTheDocument();
  });

  it('should have proper aria-label for accessibility', () => {
    const insight: BestIncomeMonthInsight = {
      month: 'June',
      year: 2026,
      amount: 85000,
      percentageChange: 7.2,
    };

    const { container } = render(<BestIncomeMonthCard insight={insight} />);

    const card = container.querySelector('[aria-label]');
    expect(card).toHaveAttribute('aria-label', 'Best income month: June 2026, ₹85,000.00');
  });

  it('should have proper aria-label when no data is available', () => {
    const insight: BestIncomeMonthInsight = {
      month: null,
      year: null,
      amount: 0,
      percentageChange: 0,
    };

    const { container } = render(<BestIncomeMonthCard insight={insight} />);

    const card = container.querySelector('[aria-label]');
    expect(card).toHaveAttribute('aria-label', 'Best income month: No data available');
  });

  it('should use success variant', () => {
    const insight: BestIncomeMonthInsight = {
      month: 'July',
      year: 2026,
      amount: 95000,
      percentageChange: 11.5,
    };

    const { container } = render(<BestIncomeMonthCard insight={insight} />);

    // Check for success variant styling (green background)
    const card = container.querySelector('.bg-green-50');
    expect(card).toBeInTheDocument();
  });

  it('should handle zero percentage change', () => {
    const insight: BestIncomeMonthInsight = {
      month: 'August',
      year: 2026,
      amount: 70000,
      percentageChange: 0,
    };

    render(<BestIncomeMonthCard insight={insight} />);

    expect(screen.getByText('vs Previous Month')).toBeInTheDocument();
    expect(screen.getByText('+0.0%', { exact: false })).toBeInTheDocument();
  });

  it('should handle large percentage changes', () => {
    const insight: BestIncomeMonthInsight = {
      month: 'September',
      year: 2026,
      amount: 150000,
      percentageChange: 125.8,
    };

    render(<BestIncomeMonthCard insight={insight} />);

    expect(screen.getByText('vs Previous Month')).toBeInTheDocument();
    expect(screen.getByText('+125.8%', { exact: false })).toBeInTheDocument();
  });
});
