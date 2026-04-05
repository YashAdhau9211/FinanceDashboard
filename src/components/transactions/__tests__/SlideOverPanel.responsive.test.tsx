import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SlideOverPanel } from './SlideOverPanel';

describe('SlideOverPanel - Responsive Design', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should render when isOpen is true', () => {
    render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    expect(screen.getByText('Test Panel')).toBeInTheDocument();
    expect(screen.getByText('Panel Content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <SlideOverPanel isOpen={false} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    expect(screen.queryByText('Test Panel')).not.toBeInTheDocument();
  });

  it('should have full-screen width on mobile', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    // Panel should have w-screen class
    const panel = container.querySelector('[role="dialog"]')?.firstChild;
    expect(panel?.className).toContain('w-screen');
  });

  it('should have max-width constraint on desktop', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    // Panel should have md:max-w-[480px] class
    const panel = container.querySelector('[role="dialog"]')?.firstChild;
    expect(panel?.className).toContain('md:max-w-[480px]');
  });

  it('should have slide-in animation class', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    // Panel should have animate-slide-in class
    const panel = container.querySelector('[role="dialog"]')?.firstChild;
    expect(panel?.className).toContain('animate-slide-in');
  });

  it('should have correct animation timing', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    // Panel should have duration-300 class
    const panel = container.querySelector('[role="dialog"]')?.firstChild;
    expect(panel?.className).toContain('duration-300');
  });

  it('should have cubic-bezier easing function', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    // Panel should have ease-[cubic-bezier(0.16,1,0.3,1)] class
    const panel = container.querySelector('[role="dialog"]')?.firstChild;
    expect(panel?.className).toContain('ease-[cubic-bezier(0.16,1,0.3,1)]');
  });

  it('should have backdrop with 50% opacity', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    // Backdrop should have bg-black/50 class
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop?.className).toContain('bg-black/50');
  });

  it('should have backdrop fade-in animation', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    // Backdrop should have animate-backdrop-in class
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop?.className).toContain('animate-backdrop-in');
  });

  it('should close when backdrop is clicked', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    const backdrop = container.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should close when Escape key is pressed', () => {
    render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should have proper ARIA attributes', () => {
    render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'slide-over-title');
  });

  it('should position panel on the right side', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    const panelContainer = container.querySelector('[role="dialog"]');
    expect(panelContainer?.className).toContain('right-0');
    expect(panelContainer?.className).toContain('inset-y-0');
  });

  it('should have scrollable content area', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    const contentArea = screen.getByText('Panel Content').parentElement;
    expect(contentArea?.className).toContain('overflow-y-auto');
  });

  it('should have proper dark mode support', () => {
    const { container } = render(
      <SlideOverPanel isOpen={true} onClose={mockOnClose} title="Test Panel">
        <div>Panel Content</div>
      </SlideOverPanel>
    );

    // Check for dark mode classes
    const panelContent = container.querySelector('.bg-white');
    expect(panelContent?.className).toContain('dark:bg-gray-800');
  });
});
