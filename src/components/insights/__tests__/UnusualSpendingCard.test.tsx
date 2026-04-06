import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UnusualSpendingCard } from '../UnusualSpendingCard';
import type { UnusualSpendingInsight } from '../../../types';

describe('UnusualSpendingCard', () => {
  it('renders card with insight data', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'dining',
          currentAmount: 6000,
          threeMonthAverage: 3000,
          percentageIncrease: 100,
        },
        {
          category: 'entertainment',
          currentAmount: 4500,
          threeMonthAverage: 2500,
          percentageIncrease: 80,
        },
      ],
    };

    render(<UnusualSpendingCard insight={insight} />);

    expect(screen.getByText('Unusual Spending Alert')).toBeInTheDocument();
    expect(screen.getByText('2 Alerts')).toBeInTheDocument();
  });

  it('displays alert count correctly for single alert', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'shopping',
          currentAmount: 5000,
          threeMonthAverage: 2000,
          percentageIncrease: 150,
        },
      ],
    };

    render(<UnusualSpendingCard insight={insight} />);

    expect(screen.getByText('1 Alert')).toBeInTheDocument();
  });

  it('displays "No Alerts" when no unusual spending', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [],
    };

    render(<UnusualSpendingCard insight={insight} />);

    expect(screen.getByText('No Alerts')).toBeInTheDocument();
  });

  it('renders alert list with category names', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'dining',
          currentAmount: 6000,
          threeMonthAverage: 3000,
          percentageIncrease: 100,
        },
        {
          category: 'entertainment',
          currentAmount: 4500,
          threeMonthAverage: 2500,
          percentageIncrease: 80,
        },
      ],
    };

    render(<UnusualSpendingCard insight={insight} />);

    expect(screen.getByText('dining')).toBeInTheDocument();
    expect(screen.getByText('entertainment')).toBeInTheDocument();
  });

  it('formats amounts using formatCurrency', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'shopping',
          currentAmount: 7500,
          threeMonthAverage: 3500,
          percentageIncrease: 114,
        },
      ],
    };

    render(<UnusualSpendingCard insight={insight} />);

    expect(screen.getByText(/₹7,500\.00/)).toBeInTheDocument();
    expect(screen.getByText('vs avg')).toBeInTheDocument();
    expect(screen.getByText(/₹3,500\.00/)).toBeInTheDocument();
  });

  it('formats percentage increase with 0 decimal places', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'transportation',
          currentAmount: 5000,
          threeMonthAverage: 2000,
          percentageIncrease: 150.789,
        },
      ],
    };

    render(<UnusualSpendingCard insight={insight} />);

    expect(screen.getByText('+151%')).toBeInTheDocument();
  });

  it('renders AlertTriangle icon for each alert', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'dining',
          currentAmount: 6000,
          threeMonthAverage: 3000,
          percentageIncrease: 100,
        },
        {
          category: 'shopping',
          currentAmount: 5000,
          threeMonthAverage: 2500,
          percentageIncrease: 100,
        },
      ],
    };

    const { container } = render(<UnusualSpendingCard insight={insight} />);

    // Check for AlertTriangle icons (lucide-react renders as svg)
    const icons = container.querySelectorAll('svg');
    // Should have at least 2 AlertTriangle icons
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it('displays placeholder message when no alerts', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [],
    };

    render(<UnusualSpendingCard insight={insight} />);

    expect(screen.getByText('No unusual spending detected')).toBeInTheDocument();
  });

  it('uses warning variant when alerts exist', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'dining',
          currentAmount: 6000,
          threeMonthAverage: 3000,
          percentageIncrease: 100,
        },
      ],
    };

    const { container } = render(<UnusualSpendingCard insight={insight} />);

    // Check for warning variant styling (amber background)
    const card = container.querySelector('.bg-amber-50');
    expect(card).toBeInTheDocument();
  });

  it('uses default variant when no alerts', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [],
    };

    const { container } = render(<UnusualSpendingCard insight={insight} />);

    // Check for default variant styling (white background)
    const card = container.querySelector('.bg-white');
    expect(card).toBeInTheDocument();
  });

  it('has proper aria-label for accessibility', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'dining',
          currentAmount: 6000,
          threeMonthAverage: 3000,
          percentageIncrease: 100,
        },
        {
          category: 'shopping',
          currentAmount: 5000,
          threeMonthAverage: 2500,
          percentageIncrease: 100,
        },
      ],
    };

    render(<UnusualSpendingCard insight={insight} />);

    const card = screen.getByLabelText('Unusual spending: 2 alerts');
    expect(card).toBeInTheDocument();
  });

  it('has proper aria-label when no alerts', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [],
    };

    render(<UnusualSpendingCard insight={insight} />);

    const card = screen.getByLabelText('Unusual spending: 0 alert');
    expect(card).toBeInTheDocument();
  });

  it('renders multiple alerts in amber background boxes', () => {
    const insight: UnusualSpendingInsight = {
      alerts: [
        {
          category: 'dining',
          currentAmount: 6000,
          threeMonthAverage: 3000,
          percentageIncrease: 100,
        },
        {
          category: 'entertainment',
          currentAmount: 4500,
          threeMonthAverage: 2500,
          percentageIncrease: 80,
        },
        {
          category: 'shopping',
          currentAmount: 5000,
          threeMonthAverage: 2000,
          percentageIncrease: 150,
        },
      ],
    };

    const { container } = render(<UnusualSpendingCard insight={insight} />);

    // Check for amber background boxes (one for each alert)
    const amberBoxes = container.querySelectorAll('.bg-amber-50');
    // Should have 3 amber boxes (one for each alert) plus the card background
    expect(amberBoxes.length).toBeGreaterThanOrEqual(3);
  });
});
