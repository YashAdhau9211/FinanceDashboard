import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AISummaryBlock } from './AISummaryBlock';
import type { AISummary } from '../../types';

describe('AISummaryBlock', () => {
  const mockSummary: AISummary = {
    text: 'Your best income month was March 2026 with $5,000 (20% increase). Your top spending category is Housing. Your current savings rate is 25%, above your 6-month average of 20%.',
  };

  it('renders summary text', () => {
    render(<AISummaryBlock summary={mockSummary} />);

    expect(screen.getByText(mockSummary.text)).toBeInTheDocument();
  });

  it('renders Financial Insights heading', () => {
    render(<AISummaryBlock summary={mockSummary} />);

    expect(screen.getByText('Financial Insights')).toBeInTheDocument();
  });

  it('applies gradient background styling', () => {
    const { container } = render(<AISummaryBlock summary={mockSummary} />);

    const block = container.firstChild as HTMLElement;
    expect(block).toHaveClass('bg-gradient-to-br');
    expect(block).toHaveClass('from-teal-50');
    expect(block).toHaveClass('via-blue-50');
    expect(block).toHaveClass('to-indigo-50');
    expect(block).toHaveClass('dark:from-teal-900/20');
    expect(block).toHaveClass('dark:via-blue-900/20');
    expect(block).toHaveClass('dark:to-indigo-900/20');
  });

  it('applies left border accent in teal', () => {
    const { container } = render(<AISummaryBlock summary={mockSummary} />);

    const block = container.firstChild as HTMLElement;
    expect(block).toHaveClass('border');
    expect(block).toHaveClass('border-teal-200/50');
    expect(block).toHaveClass('dark:border-teal-700/50');
  });

  it('applies consistent padding and border radius', () => {
    const { container } = render(<AISummaryBlock summary={mockSummary} />);

    const block = container.firstChild as HTMLElement;
    expect(block).toHaveClass('p-6');
    expect(block).toHaveClass('rounded-xl');
  });

  it('applies shadow styling', () => {
    const { container } = render(<AISummaryBlock summary={mockSummary} />);

    const block = container.firstChild as HTMLElement;
    expect(block).toHaveClass('shadow-md');
  });

  it('renders Sparkles icon', () => {
    const { container } = render(<AISummaryBlock summary={mockSummary} />);

    // Check for the icon container with teal background (the actual icon container, not the decorative background)
    const iconContainers = container.querySelectorAll('.bg-teal-500');
    // Filter to find the one with p-4 class (the icon container)
    const iconContainer = Array.from(iconContainers).find((el) => el.classList.contains('p-4'));
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('rounded-xl');

    // Check for the custom SVG icon with white color
    const icon = container.querySelector('.text-white');
    expect(icon).toBeInTheDocument();
  });

  it('uses semantic HTML paragraph tag for summary text', () => {
    const { container } = render(<AISummaryBlock summary={mockSummary} />);

    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(mockSummary.text);
  });

  it('applies correct typography to heading', () => {
    render(<AISummaryBlock summary={mockSummary} />);

    const heading = screen.getByText('Financial Insights');
    expect(heading.tagName).toBe('H3');
    expect(heading).toHaveClass('text-lg');
    expect(heading).toHaveClass('font-bold');
    expect(heading).toHaveClass('text-gray-900');
    expect(heading).toHaveClass('dark:text-gray-100');
  });

  it('applies correct typography to summary text', () => {
    const { container } = render(<AISummaryBlock summary={mockSummary} />);

    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveClass('text-sm');
    expect(paragraph).toHaveClass('text-gray-700');
    expect(paragraph).toHaveClass('dark:text-gray-300');
    expect(paragraph).toHaveClass('leading-relaxed');
  });

  it('renders with empty summary text', () => {
    const emptySummary: AISummary = { text: '' };
    const { container } = render(<AISummaryBlock summary={emptySummary} />);

    expect(screen.getByText('Financial Insights')).toBeInTheDocument();
    const paragraph = container.querySelector('p.text-sm.text-gray-700');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('');
  });

  it('renders with long summary text', () => {
    const longSummary: AISummary = {
      text: 'This is a very long summary text that contains multiple sentences and provides detailed financial insights about income, expenses, savings rates, and spending patterns across multiple categories and time periods.',
    };
    render(<AISummaryBlock summary={longSummary} />);

    expect(screen.getByText(longSummary.text)).toBeInTheDocument();
  });

  it('applies dark mode classes', () => {
    const { container } = render(<AISummaryBlock summary={mockSummary} />);

    const block = container.firstChild as HTMLElement;
    expect(block).toHaveClass('dark:from-teal-900/20');
    expect(block).toHaveClass('dark:via-blue-900/20');
    expect(block).toHaveClass('dark:to-indigo-900/20');

    const heading = screen.getByText('Financial Insights');
    expect(heading).toHaveClass('dark:text-gray-100');

    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveClass('dark:text-gray-300');
  });

  it('maintains flex layout structure', () => {
    const { container } = render(<AISummaryBlock summary={mockSummary} />);

    const flexContainer = container.querySelector('.flex.items-start.gap-4');
    expect(flexContainer).toBeInTheDocument();
  });
});
