import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InsightCard } from '../InsightCard';

describe('InsightCard', () => {
  it('renders title, value, and description', () => {
    render(<InsightCard title="Test Title" value="$1,000" description="Test description" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders value as ReactNode', () => {
    render(
      <InsightCard
        title="Test Title"
        value={<span data-testid="custom-value">Custom Value</span>}
      />
    );

    expect(screen.getByTestId('custom-value')).toBeInTheDocument();
    expect(screen.getByText('Custom Value')).toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    render(<InsightCard title="Test Title" value="$1,000" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('renders children for embedded charts', () => {
    render(
      <InsightCard title="Test Title" value="$1,000">
        <div data-testid="chart">Chart Component</div>
      </InsightCard>
    );

    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByText('Chart Component')).toBeInTheDocument();
  });

  it('applies default variant styling', () => {
    const { container } = render(
      <InsightCard title="Test Title" value="$1,000" variant="default" />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('dark:bg-navy-800');
    expect(card).toHaveClass('border-gray-200');
  });

  it('applies success variant styling', () => {
    const { container } = render(
      <InsightCard title="Test Title" value="$1,000" variant="success" />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-green-50');
    expect(card).toHaveClass('dark:bg-green-900/20');
    expect(card).toHaveClass('border-green-200');
  });

  it('applies warning variant styling', () => {
    const { container } = render(
      <InsightCard title="Test Title" value="$1,000" variant="warning" />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-amber-50');
    expect(card).toHaveClass('dark:bg-amber-900/20');
    expect(card).toHaveClass('border-amber-200');
  });

  it('applies danger variant styling', () => {
    const { container } = render(
      <InsightCard title="Test Title" value="$1,000" variant="danger" />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-red-50');
    expect(card).toHaveClass('dark:bg-red-900/20');
    expect(card).toHaveClass('border-red-200');
  });

  it('applies hover effect classes', () => {
    const { container } = render(<InsightCard title="Test Title" value="$1,000" />);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('hover:-translate-y-0.5');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('duration-150');
    expect(card).toHaveClass('ease-out');
  });

  it('applies base styling classes', () => {
    const { container } = render(<InsightCard title="Test Title" value="$1,000" />);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('p-6');
    expect(card).toHaveClass('shadow-sm');
  });

  it('adds aria-label for accessibility', () => {
    render(
      <InsightCard
        title="Test Title"
        value="$1,000"
        ariaLabel="Test insight card with value $1,000"
      />
    );

    const card = screen.getByLabelText('Test insight card with value $1,000');
    expect(card).toBeInTheDocument();
  });

  it('works without aria-label', () => {
    const { container } = render(<InsightCard title="Test Title" value="$1,000" />);

    const card = container.firstChild as HTMLElement;
    expect(card).toBeInTheDocument();
  });

  it('applies dark mode classes', () => {
    const { container } = render(<InsightCard title="Test Title" value="$1,000" />);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('dark:bg-navy-800');

    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('dark:text-gray-400');

    const value = screen.getByText('$1,000');
    expect(value).toHaveClass('dark:text-gray-100');
  });

  it('applies insight-card class for animations', () => {
    const { container } = render(<InsightCard title="Test Title" value="$1,000" />);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('insight-card');
  });
});
