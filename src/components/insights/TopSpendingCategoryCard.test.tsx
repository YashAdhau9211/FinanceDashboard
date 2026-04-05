import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopSpendingCategoryCard } from './TopSpendingCategoryCard';
import type { TopSpendingCategoryInsight } from '../../types';

describe('TopSpendingCategoryCard', () => {
  it('renders card with insight data', () => {
    const insight: TopSpendingCategoryInsight = {
      category: 'groceries',
      amount: 5000,
      percentage: 35.5,
      chartData: [
        { category: 'groceries', amount: 5000, color: '#84CC16' },
        { category: 'dining', amount: 3000, color: '#EC4899' },
      ],
    };

    render(<TopSpendingCategoryCard insight={insight} />);

    expect(screen.getByText('Top Spending Category')).toBeInTheDocument();
    expect(screen.getAllByText('groceries').length).toBeGreaterThan(0);
    expect(screen.getByText('₹5,000.00 (35.5%)')).toBeInTheDocument();
  });

  it('renders N/A when category is null', () => {
    const insight: TopSpendingCategoryInsight = {
      category: null,
      amount: 0,
      percentage: 0,
      chartData: [],
    };

    render(<TopSpendingCategoryCard insight={insight} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('displays placeholder message when no expense data', () => {
    const insight: TopSpendingCategoryInsight = {
      category: null,
      amount: 0,
      percentage: 0,
      chartData: [],
    };

    render(<TopSpendingCategoryCard insight={insight} />);

    expect(screen.getByText('No expense data available')).toBeInTheDocument();
  });

  it('renders donut chart with correct data', () => {
    const insight: TopSpendingCategoryInsight = {
      category: 'groceries',
      amount: 5000,
      percentage: 35.5,
      chartData: [
        { category: 'groceries', amount: 5000, color: '#84CC16' },
        { category: 'dining', amount: 3000, color: '#EC4899' },
        { category: 'transportation', amount: 2000, color: '#06B6D4' },
      ],
    };

    const { container } = render(<TopSpendingCategoryCard insight={insight} />);

    // Check that ResponsiveContainer is rendered (Recharts may not fully render in test environment)
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();

    // Verify no placeholder message is shown
    expect(screen.queryByText('No expense data available')).not.toBeInTheDocument();
  });

  it('has proper aria-label for accessibility', () => {
    const insight: TopSpendingCategoryInsight = {
      category: 'groceries',
      amount: 5000,
      percentage: 35.5,
      chartData: [{ category: 'groceries', amount: 5000, color: '#84CC16' }],
    };

    render(<TopSpendingCategoryCard insight={insight} />);

    const card = screen.getByLabelText('Top spending category: groceries, ₹5,000.00');
    expect(card).toBeInTheDocument();
  });

  it('has proper aria-label when no data', () => {
    const insight: TopSpendingCategoryInsight = {
      category: null,
      amount: 0,
      percentage: 0,
      chartData: [],
    };

    render(<TopSpendingCategoryCard insight={insight} />);

    const card = screen.getByLabelText('Top spending category: No expense data available');
    expect(card).toBeInTheDocument();
  });

  it('formats amount with currency formatter', () => {
    const insight: TopSpendingCategoryInsight = {
      category: 'rent',
      amount: 15000,
      percentage: 50.0,
      chartData: [{ category: 'rent', amount: 15000, color: '#EF4444' }],
    };

    render(<TopSpendingCategoryCard insight={insight} />);

    // Check that amount is formatted correctly
    expect(screen.getByText('₹15,000.00 (50.0%)')).toBeInTheDocument();
  });

  it('formats percentage with 1 decimal place', () => {
    const insight: TopSpendingCategoryInsight = {
      category: 'utilities',
      amount: 2500,
      percentage: 12.345,
      chartData: [{ category: 'utilities', amount: 2500, color: '#F59E0B' }],
    };

    render(<TopSpendingCategoryCard insight={insight} />);

    // Check that percentage is formatted with 1 decimal place
    expect(screen.getByText('₹2,500.00 (12.3%)')).toBeInTheDocument();
  });
});
