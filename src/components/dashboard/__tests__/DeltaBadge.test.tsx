import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeltaBadge } from './DeltaBadge';

describe('DeltaBadge', () => {
  it('should display positive delta with green color and TrendingUp icon', () => {
    const { container } = render(<DeltaBadge delta={5.2} />);

    // Check for green color classes
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-green-100');
    expect(badge?.className).toContain('text-green-700');

    // Check for percentage text
    expect(screen.getByText('5.2%')).toBeInTheDocument();
  });

  it('should display negative delta with red color and TrendingDown icon', () => {
    const { container } = render(<DeltaBadge delta={-3.7} />);

    // Check for red color classes
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-red-100');
    expect(badge?.className).toContain('text-red-700');

    // Check for percentage text (absolute value)
    expect(screen.getByText('3.7%')).toBeInTheDocument();
  });

  it('should display zero delta with green color', () => {
    const { container } = render(<DeltaBadge delta={0} />);

    // Check for green color classes (zero is treated as positive)
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-green-100');
    expect(badge?.className).toContain('text-green-700');

    // Check for percentage text
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('should format delta with 1 decimal place', () => {
    render(<DeltaBadge delta={12.456} />);
    expect(screen.getByText('12.5%')).toBeInTheDocument();
  });
});
