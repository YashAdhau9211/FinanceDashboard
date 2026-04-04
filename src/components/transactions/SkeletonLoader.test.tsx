import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonLoader } from './SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders 5 skeleton rows', () => {
    const { container } = render(<SkeletonLoader />);
    const skeletonRows = container.querySelectorAll('.space-y-3 > div');
    expect(skeletonRows).toHaveLength(5);
  });

  it('has loading status role', () => {
    render(<SkeletonLoader />);
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<SkeletonLoader />);
    const loadingElement = screen.getByRole('status', { name: /loading transactions/i });
    expect(loadingElement).toBeInTheDocument();
  });

  it('has screen reader text', () => {
    render(<SkeletonLoader />);
    const srText = screen.getByText(/loading transactions\.\.\./i);
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass('sr-only');
  });

  it('renders placeholder elements for each column', () => {
    const { container } = render(<SkeletonLoader />);
    const firstRow = container.querySelector('.space-y-3 > div:first-child');
    
    // Should have multiple placeholder divs (date, description, category, type, amount, actions)
    const placeholders = firstRow?.querySelectorAll('.animate-shimmer');
    expect(placeholders).toBeDefined();
    expect(placeholders!.length).toBeGreaterThan(0);
  });

  it('applies shimmer animation class', () => {
    const { container } = render(<SkeletonLoader />);
    const shimmerElements = container.querySelectorAll('.animate-shimmer');
    
    expect(shimmerElements.length).toBeGreaterThan(0);
    shimmerElements.forEach((element) => {
      expect(element).toHaveClass('animate-shimmer');
    });
  });
});
