import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorstExpenseMonthCard } from '../WorstExpenseMonthCard';
import type { WorstExpenseMonthInsight } from '../../../types';

describe('WorstExpenseMonthCard', () => {
  it('should render card with insight data', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'October',
      year: 2025,
      amount: 85000,
      hasOverspend: false,
    };

    render(<WorstExpenseMonthCard insight={insight} />);

    expect(screen.getByText('Worst Expense Month')).toBeInTheDocument();
    expect(screen.getByText('October 2025')).toBeInTheDocument();
    expect(screen.getByText('₹85,000.00')).toBeInTheDocument();
  });

  it('should format month and year correctly', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'December',
      year: 2025,
      amount: 95000,
      hasOverspend: true,
    };

    render(<WorstExpenseMonthCard insight={insight} />);

    expect(screen.getByText('December 2025')).toBeInTheDocument();
  });

  it('should format amount using formatCurrency', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'November',
      year: 2025,
      amount: 123456.78,
      hasOverspend: false,
    };

    render(<WorstExpenseMonthCard insight={insight} />);

    expect(screen.getByText('₹1,23,456.78')).toBeInTheDocument();
  });

  it('should display overspend warning badge when hasOverspend is true', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'September',
      year: 2025,
      amount: 100000,
      hasOverspend: true,
    };

    render(<WorstExpenseMonthCard insight={insight} />);

    expect(screen.getByText('Expenses exceeded income')).toBeInTheDocument();
  });

  it('should not display overspend warning badge when hasOverspend is false', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'August',
      year: 2025,
      amount: 75000,
      hasOverspend: false,
    };

    render(<WorstExpenseMonthCard insight={insight} />);

    expect(screen.queryByText('Expenses exceeded income')).not.toBeInTheDocument();
  });

  it('should render AlertTriangle icon when hasOverspend is true', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'July',
      year: 2025,
      amount: 110000,
      hasOverspend: true,
    };

    const { container } = render(<WorstExpenseMonthCard insight={insight} />);

    // Check for AlertTriangle icon by looking for the svg element with white color inside red background
    const icon = container.querySelector('.text-white');
    expect(icon).toBeInTheDocument();
  });

  it('should use danger variant when hasOverspend is true', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'June',
      year: 2025,
      amount: 120000,
      hasOverspend: true,
    };

    const { container } = render(<WorstExpenseMonthCard insight={insight} />);

    // Check for danger variant styling (red background)
    const card = container.querySelector('.bg-red-50');
    expect(card).toBeInTheDocument();
  });

  it('should use warning variant when hasOverspend is false', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'May',
      year: 2025,
      amount: 80000,
      hasOverspend: false,
    };

    const { container } = render(<WorstExpenseMonthCard insight={insight} />);

    // Check for warning variant styling (amber background)
    const card = container.querySelector('.bg-amber-50');
    expect(card).toBeInTheDocument();
  });

  it('should display placeholder message when no data is available', () => {
    const insight: WorstExpenseMonthInsight = {
      month: null,
      year: null,
      amount: 0,
      hasOverspend: false,
    };

    render(<WorstExpenseMonthCard insight={insight} />);

    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('No expense data available')).toBeInTheDocument();
  });

  it('should not display overspend badge when no data is available', () => {
    const insight: WorstExpenseMonthInsight = {
      month: null,
      year: null,
      amount: 0,
      hasOverspend: false,
    };

    render(<WorstExpenseMonthCard insight={insight} />);

    expect(screen.queryByText('Expenses exceeded income')).not.toBeInTheDocument();
  });

  it('should have proper aria-label for accessibility', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'April',
      year: 2025,
      amount: 90000,
      hasOverspend: false,
    };

    const { container } = render(<WorstExpenseMonthCard insight={insight} />);

    const card = container.querySelector('[aria-label]');
    expect(card).toHaveAttribute('aria-label', 'Worst expense month: April 2025, ₹90,000.00');
  });

  it('should have proper aria-label with overspend information', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'March',
      year: 2025,
      amount: 105000,
      hasOverspend: true,
    };

    const { container } = render(<WorstExpenseMonthCard insight={insight} />);

    const card = container.querySelector('[aria-label]');
    expect(card).toHaveAttribute(
      'aria-label',
      'Worst expense month: March 2025, ₹1,05,000.00, expenses exceeded income'
    );
  });

  it('should have proper aria-label when no data is available', () => {
    const insight: WorstExpenseMonthInsight = {
      month: null,
      year: null,
      amount: 0,
      hasOverspend: false,
    };

    const { container } = render(<WorstExpenseMonthCard insight={insight} />);

    const card = container.querySelector('[aria-label]');
    expect(card).toHaveAttribute('aria-label', 'Worst expense month: No data available');
  });

  it('should apply correct badge styling for overspend warning', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'February',
      year: 2025,
      amount: 115000,
      hasOverspend: true,
    };

    const { container } = render(<WorstExpenseMonthCard insight={insight} />);

    // Check for badge styling
    const badge = container.querySelector('.bg-red-50.dark\\:bg-red-900\\/20');
    expect(badge).toBeInTheDocument();
  });

  it('should handle zero amount', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'January',
      year: 2025,
      amount: 0,
      hasOverspend: false,
    };

    render(<WorstExpenseMonthCard insight={insight} />);

    expect(screen.getByText('₹0.00')).toBeInTheDocument();
  });

  it('should handle large amounts', () => {
    const insight: WorstExpenseMonthInsight = {
      month: 'December',
      year: 2024,
      amount: 9876543.21,
      hasOverspend: true,
    };

    render(<WorstExpenseMonthCard insight={insight} />);

    expect(screen.getByText('₹98,76,543.21')).toBeInTheDocument();
  });
});
