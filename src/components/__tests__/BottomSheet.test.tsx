import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomSheet } from '../BottomSheet';

describe('BottomSheet', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <BottomSheet isOpen={false} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    expect(screen.getByText('Test Sheet')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should have lg:hidden class to show only on mobile', () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    const wrapper = container.querySelector('.fixed.inset-0.z-50');
    expect(wrapper).toHaveClass('lg:hidden');
  });

  it('should have fixed positioning at bottom', () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    const sheet = container.querySelector('.rounded-t-2xl');
    expect(sheet).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
  });

  it('should have max-height of 80vh', () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    const sheet = container.querySelector('.rounded-t-2xl');
    expect(sheet).toHaveClass('max-h-[80vh]');
  });

  it('should have slide-up animation', () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    const sheet = container.querySelector('.rounded-t-2xl');
    expect(sheet).toHaveClass('animate-slide-up');
  });

  it('should call onClose when backdrop is clicked', () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    const backdrop = container.querySelector('.bg-black\\/50');
    fireEvent.click(backdrop!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Escape key is pressed', () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should have overflow-y-auto for scrollable content', () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    const content = container.querySelector('.overflow-y-auto');
    expect(content).toBeInTheDocument();
  });

  it('should have minimum 44x44px touch target for close button', () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Sheet">
        <div>Content</div>
      </BottomSheet>
    );

    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
  });
});
