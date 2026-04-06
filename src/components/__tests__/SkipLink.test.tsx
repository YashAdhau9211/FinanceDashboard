import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkipLink } from '../SkipLink';

describe('SkipLink', () => {
  it('should render skip link with correct text', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link).toBeInTheDocument();
  });

  it('should have href pointing to #main-content', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should be visually hidden by default (sr-only class)', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveClass('sr-only');
  });

  it('should become visible on focus (focus:not-sr-only class)', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link.className).toContain('focus:not-sr-only');
  });

  it('should have proper focus styles', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link.className).toContain('focus:absolute');
    expect(link.className).toContain('focus:z-50');
    expect(link.className).toContain('focus:bg-teal-500');
    expect(link.className).toContain('focus:text-white');
  });

  it('should have focus-visible ring styles', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link.className).toContain('focus-visible:ring-2');
    expect(link.className).toContain('focus-visible:ring-teal-500');
  });
});
