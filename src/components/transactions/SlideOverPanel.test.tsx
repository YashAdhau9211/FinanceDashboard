import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SlideOverPanel } from './SlideOverPanel';

describe('SlideOverPanel', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <SlideOverPanel isOpen={false} onClose={vi.fn()} title="Test Panel">
        <div>Content</div>
      </SlideOverPanel>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <SlideOverPanel isOpen={true} onClose={vi.fn()} title="Test Panel">
        <div>Content</div>
      </SlideOverPanel>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should have correct ARIA attributes', () => {
    render(
      <SlideOverPanel isOpen={true} onClose={vi.fn()} title="Test Panel">
        <div>Content</div>
      </SlideOverPanel>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'slide-over-title');
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <SlideOverPanel isOpen={true} onClose={onClose} title="Test Panel">
        <div>Content</div>
      </SlideOverPanel>
    );
    
    const backdrop = document.querySelector('.bg-black\\/50');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <SlideOverPanel isOpen={true} onClose={onClose} title="Test Panel">
        <div>Content</div>
      </SlideOverPanel>
    );
    
    const closeButton = screen.getByLabelText('Close panel');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <SlideOverPanel isOpen={true} onClose={onClose} title="Test Panel">
        <div>Content</div>
      </SlideOverPanel>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when other keys are pressed', () => {
    const onClose = vi.fn();
    render(
      <SlideOverPanel isOpen={true} onClose={onClose} title="Test Panel">
        <div>Content</div>
      </SlideOverPanel>
    );
    
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should trap focus within the panel', () => {
    render(
      <SlideOverPanel isOpen={true} onClose={vi.fn()} title="Test Panel">
        <button>Button 1</button>
        <button>Button 2</button>
      </SlideOverPanel>
    );
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // First focusable element should be focused
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('should have slide-in animation class', () => {
    render(
      <SlideOverPanel isOpen={true} onClose={vi.fn()} title="Test Panel">
        <div>Content</div>
      </SlideOverPanel>
    );
    
    const panel = document.querySelector('.animate-slide-in');
    expect(panel).toBeInTheDocument();
  });

  it('should prevent body scroll when open', () => {
    const { unmount } = render(
      <SlideOverPanel isOpen={true} onClose={vi.fn()} title="Test Panel">
        <div>Content</div>
      </SlideOverPanel>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
