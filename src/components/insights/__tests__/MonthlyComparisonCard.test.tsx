import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonthlyComparisonCard } from './MonthlyComparisonCard';
import type { MonthlyComparisonInsight } from '../../types';

describe('MonthlyComparisonCard', () => {
  it('should render card with insight data', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 75000,
        expenses: 45000,
      },
      previousMonth: {
        income: 70000,
        expenses: 50000,
      },
      deltas: {
        incomeDelta: 7.1,
        expensesDelta: -10.0,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    expect(screen.getByText('Monthly Comparison')).toBeInTheDocument();
    expect(screen.getByText('Current vs Previous')).toBeInTheDocument();
  });

  it('should display income and expenses labels', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 40000,
      },
      previousMonth: {
        income: 75000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: -11.1,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
  });

  it('should format current month income correctly', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 123456.78,
        expenses: 50000,
      },
      previousMonth: {
        income: 100000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 23.5,
        expensesDelta: 11.1,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    expect(screen.getByText('₹1,23,456.78')).toBeInTheDocument();
  });

  it('should format current month expenses correctly', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 67890.12,
      },
      previousMonth: {
        income: 75000,
        expenses: 60000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: 13.2,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    expect(screen.getByText('₹67,890.12')).toBeInTheDocument();
  });

  it('should format income delta as percentage with 1 decimal place', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 85000,
        expenses: 40000,
      },
      previousMonth: {
        income: 75000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 13.333,
        expensesDelta: -11.111,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    expect(screen.getByText('13.3%')).toBeInTheDocument();
  });

  it('should format expenses delta as percentage with 1 decimal place', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 48000,
      },
      previousMonth: {
        income: 75000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: 6.666,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    // Check for the expenses delta specifically (6.666 rounds to 6.7)
    const percentages = screen.getAllByText('6.7%');
    expect(percentages.length).toBe(2); // Both income and expenses have 6.7%
  });

  it('should use green color for positive income delta', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 90000,
        expenses: 40000,
      },
      previousMonth: {
        income: 80000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 12.5,
        expensesDelta: -11.1,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    // Find the income delta element (uses text-green-700 in light mode)
    const greenElements = container.querySelectorAll('.text-green-700');
    expect(greenElements.length).toBeGreaterThan(0);
  });

  it('should use red color for negative income delta', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 70000,
        expenses: 40000,
      },
      previousMonth: {
        income: 80000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: -12.5,
        expensesDelta: -11.1,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    // Find the income delta element (should have text-red-700)
    const redElements = container.querySelectorAll('.text-red-700');
    expect(redElements.length).toBeGreaterThan(0);
  });

  it('should use green color for negative expense delta (expense decrease)', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 40000,
      },
      previousMonth: {
        income: 75000,
        expenses: 50000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: -20.0,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    // Both income increase and expense decrease should be green (text-green-700)
    const greenElements = container.querySelectorAll('.text-green-700');
    expect(greenElements.length).toBe(2);
  });

  it('should use red color for positive expense delta (expense increase)', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 55000,
      },
      previousMonth: {
        income: 75000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: 22.2,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    // Expense increase should be red (text-red-700)
    const redElements = container.querySelectorAll('.text-red-700');
    expect(redElements.length).toBeGreaterThan(0);
  });

  it('should render TrendingUp icon for positive income delta', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 85000,
        expenses: 40000,
      },
      previousMonth: {
        income: 75000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 13.3,
        expensesDelta: -11.1,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    // Check for TrendingUp icon (svg elements)
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should render TrendingDown icon for negative income delta', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 65000,
        expenses: 40000,
      },
      previousMonth: {
        income: 75000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: -13.3,
        expensesDelta: -11.1,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    // Check for svg elements (TrendingDown)
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should render TrendingUp icon for positive expense delta', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 50000,
      },
      previousMonth: {
        income: 75000,
        expenses: 40000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: 25.0,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    // Check for svg elements
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should render TrendingDown icon for negative expense delta', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 35000,
      },
      previousMonth: {
        income: 75000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: -22.2,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    // Check for svg elements
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should have proper aria-label for accessibility', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 45000,
      },
      previousMonth: {
        income: 75000,
        expenses: 50000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: -10.0,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    const card = container.querySelector('[aria-label]');
    expect(card).toHaveAttribute(
      'aria-label',
      'Monthly comparison: Current month income ₹80,000.00, expenses ₹45,000.00'
    );
  });

  it('should handle zero deltas', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 75000,
        expenses: 45000,
      },
      previousMonth: {
        income: 75000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 0,
        expensesDelta: 0,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    // Should display 0.0% for both
    const percentages = screen.getAllByText('0.0%');
    expect(percentages.length).toBe(2);
  });

  it('should handle zero income', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 0,
        expenses: 45000,
      },
      previousMonth: {
        income: 75000,
        expenses: 50000,
      },
      deltas: {
        incomeDelta: -100.0,
        expensesDelta: -10.0,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    expect(screen.getByText('₹0.00')).toBeInTheDocument();
  });

  it('should handle zero expenses', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 0,
      },
      previousMonth: {
        income: 75000,
        expenses: 45000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: -100.0,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    expect(screen.getByText('₹0.00')).toBeInTheDocument();
  });

  it('should handle large amounts', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 9876543.21,
        expenses: 1234567.89,
      },
      previousMonth: {
        income: 8000000,
        expenses: 1000000,
      },
      deltas: {
        incomeDelta: 23.5,
        expensesDelta: 23.5,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    expect(screen.getByText('₹98,76,543.21')).toBeInTheDocument();
    expect(screen.getByText('₹12,34,567.89')).toBeInTheDocument();
  });

  it('should use default variant', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 80000,
        expenses: 45000,
      },
      previousMonth: {
        income: 75000,
        expenses: 50000,
      },
      deltas: {
        incomeDelta: 6.7,
        expensesDelta: -10.0,
      },
    };

    const { container } = render(<MonthlyComparisonCard insight={insight} />);

    // Check for default variant styling (white background)
    const card = container.querySelector('.bg-white');
    expect(card).toBeInTheDocument();
  });

  it('should display absolute values for negative deltas', () => {
    const insight: MonthlyComparisonInsight = {
      currentMonth: {
        income: 65000,
        expenses: 40000,
      },
      previousMonth: {
        income: 80000,
        expenses: 50000,
      },
      deltas: {
        incomeDelta: -18.75,
        expensesDelta: -20.0,
      },
    };

    render(<MonthlyComparisonCard insight={insight} />);

    // Should display absolute values
    expect(screen.getByText('18.8%')).toBeInTheDocument();
    expect(screen.getByText('20.0%')).toBeInTheDocument();
  });
});
