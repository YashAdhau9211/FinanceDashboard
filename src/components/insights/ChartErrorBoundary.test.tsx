import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChartErrorBoundary from './ChartErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Chart rendering error');
  }
  return <div>Chart content</div>;
};

describe('ChartErrorBoundary', () => {
  // Suppress console.error for these tests
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it('should render children when no error occurs', () => {
    render(
      <ChartErrorBoundary>
        <div>Chart renders successfully</div>
      </ChartErrorBoundary>
    );

    expect(screen.getByText('Chart renders successfully')).toBeInTheDocument();
  });

  it('should catch chart rendering errors and display fallback message', () => {
    render(
      <ChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChartErrorBoundary>
    );

    expect(screen.getByText('Unable to load chart')).toBeInTheDocument();
  });

  it('should display error icon in fallback UI', () => {
    render(
      <ChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChartErrorBoundary>
    );

    // Check for AlertTriangle icon (lucide-react renders as svg)
    const svg = screen.getByText('Unable to load chart').parentElement?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should log error to console', () => {
    render(
      <ChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChartErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Chart rendering error:',
      expect.any(Error),
      expect.anything()
    );
  });

  it('should apply correct styling to error fallback', () => {
    render(
      <ChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChartErrorBoundary>
    );

    const errorContainer = screen.getByText('Unable to load chart').closest('div');
    expect(errorContainer).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'py-8',
      'text-center'
    );
  });

  it('should handle multiple chart errors independently', () => {
    render(
      <div>
        <ChartErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <div>Working chart</div>
        </ChartErrorBoundary>
      </div>
    );

    // First chart should show error
    expect(screen.getByText('Unable to load chart')).toBeInTheDocument();

    // Second chart should render normally
    expect(screen.getByText('Working chart')).toBeInTheDocument();
  });

  it('should not display retry button (chart errors are passive)', () => {
    render(
      <ChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChartErrorBoundary>
    );

    const retryButton = screen.queryByRole('button');
    expect(retryButton).not.toBeInTheDocument();
  });
});
