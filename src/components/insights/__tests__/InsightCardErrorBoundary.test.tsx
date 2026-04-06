import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InsightCardErrorBoundary from '../InsightCardErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal content</div>;
};

describe('InsightCardErrorBoundary', () => {
  // Suppress console.error for these tests
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it('should render children when no error occurs', () => {
    render(
      <InsightCardErrorBoundary cardTitle="Test Card">
        <div>Test content</div>
      </InsightCardErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch rendering errors and display fallback UI', () => {
    render(
      <InsightCardErrorBoundary cardTitle="Test Card">
        <ThrowError shouldThrow={true} />
      </InsightCardErrorBoundary>
    );

    expect(screen.getByText(/Unable to Load Test Card/i)).toBeInTheDocument();
    expect(
      screen.getByText(/An error occurred while loading this insight card/i)
    ).toBeInTheDocument();
  });

  it('should display card title in error message', () => {
    render(
      <InsightCardErrorBoundary cardTitle="Top Spending Category">
        <ThrowError shouldThrow={true} />
      </InsightCardErrorBoundary>
    );

    expect(screen.getByText(/Unable to Load Top Spending Category/i)).toBeInTheDocument();
  });

  it('should display default title when cardTitle is not provided', () => {
    render(
      <InsightCardErrorBoundary>
        <ThrowError shouldThrow={true} />
      </InsightCardErrorBoundary>
    );

    expect(screen.getByText(/Unable to Load Insight/i)).toBeInTheDocument();
  });

  it('should display retry button and verify it is functional', () => {
    render(
      <InsightCardErrorBoundary cardTitle="Test Card">
        <ThrowError shouldThrow={true} />
      </InsightCardErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /Retry loading insight/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).not.toBeDisabled();

    // Verify clicking doesn't crash
    fireEvent.click(retryButton);
  });

  it('should apply correct styling to error fallback', () => {
    const { container } = render(
      <InsightCardErrorBoundary cardTitle="Test Card">
        <ThrowError shouldThrow={true} />
      </InsightCardErrorBoundary>
    );

    // Find the outer container div with bg-white class
    const outerDiv = container.querySelector('.bg-white');
    expect(outerDiv).toBeTruthy();
  });
});
