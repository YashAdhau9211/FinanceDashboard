import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSwipeToDelete } from '../useSwipeToDelete';

describe('useSwipeToDelete', () => {
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  it('should initialize with translateX of 0 and isDeleting false', () => {
    const { result } = renderHook(() => useSwipeToDelete({ onDelete: mockOnDelete }));

    expect(result.current.translateX).toBe(0);
    expect(result.current.isDeleting).toBe(false);
  });

  it('should return handlers for touch events', () => {
    const { result } = renderHook(() => useSwipeToDelete({ onDelete: mockOnDelete }));

    expect(result.current.handlers).toHaveProperty('onTouchStart');
    expect(result.current.handlers).toHaveProperty('onTouchMove');
    expect(result.current.handlers).toHaveProperty('onTouchEnd');
  });

  it('should calculate swipe distance correctly', () => {
    const { result } = renderHook(() => useSwipeToDelete({ onDelete: mockOnDelete }));

    // Simulate touch start at x=100
    act(() => {
      result.current.handlers.onTouchStart({
        touches: [{ clientX: 100 }],
      } as unknown as React.TouchEvent);
    });

    // Simulate touch move to x=50 (swipe left 50px)
    act(() => {
      result.current.handlers.onTouchMove({
        touches: [{ clientX: 50 }],
      } as unknown as React.TouchEvent);
    });

    expect(result.current.translateX).toBe(-50);
  });

  it('should only allow left swipe (negative distance)', () => {
    const { result } = renderHook(() => useSwipeToDelete({ onDelete: mockOnDelete }));

    // Simulate touch start at x=100
    act(() => {
      result.current.handlers.onTouchStart({
        touches: [{ clientX: 100 }],
      } as unknown as React.TouchEvent);
    });

    // Simulate touch move to x=150 (swipe right 50px)
    act(() => {
      result.current.handlers.onTouchMove({
        touches: [{ clientX: 150 }],
      } as unknown as React.TouchEvent);
    });

    // Should not update translateX for right swipe
    expect(result.current.translateX).toBe(0);
  });

  it('should call onDelete when swipe exceeds threshold', () => {
    const { result } = renderHook(() =>
      useSwipeToDelete({ onDelete: mockOnDelete, threshold: 50 })
    );

    // Simulate swipe left 60px (exceeds threshold)
    act(() => {
      result.current.handlers.onTouchStart({
        touches: [{ clientX: 100 }],
      } as unknown as React.TouchEvent);
    });

    act(() => {
      result.current.handlers.onTouchMove({
        touches: [{ clientX: 40 }],
      } as unknown as React.TouchEvent);
    });

    act(() => {
      result.current.handlers.onTouchEnd();
    });

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(result.current.isDeleting).toBe(true);
  });

  it('should not call onDelete when swipe does not exceed threshold', () => {
    const { result } = renderHook(() =>
      useSwipeToDelete({ onDelete: mockOnDelete, threshold: 50 })
    );

    // Simulate swipe left 30px (does not exceed threshold)
    act(() => {
      result.current.handlers.onTouchStart({
        touches: [{ clientX: 100 }],
      } as unknown as React.TouchEvent);
    });

    act(() => {
      result.current.handlers.onTouchMove({
        touches: [{ clientX: 70 }],
      } as unknown as React.TouchEvent);
    });

    act(() => {
      result.current.handlers.onTouchEnd();
    });

    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
    expect(result.current.translateX).toBe(0); // Should reset
  });

  it('should use default threshold of 50px', () => {
    const { result } = renderHook(() => useSwipeToDelete({ onDelete: mockOnDelete }));

    // Simulate swipe left exactly 50px
    act(() => {
      result.current.handlers.onTouchStart({
        touches: [{ clientX: 100 }],
      } as unknown as React.TouchEvent);
    });

    act(() => {
      result.current.handlers.onTouchMove({
        touches: [{ clientX: 50 }],
      } as unknown as React.TouchEvent);
    });

    act(() => {
      result.current.handlers.onTouchEnd();
    });

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should reset translateX when swipe does not exceed threshold', () => {
    const { result } = renderHook(() =>
      useSwipeToDelete({ onDelete: mockOnDelete, threshold: 50 })
    );

    // Simulate swipe left 30px
    act(() => {
      result.current.handlers.onTouchStart({
        touches: [{ clientX: 100 }],
      } as unknown as React.TouchEvent);
    });

    act(() => {
      result.current.handlers.onTouchMove({
        touches: [{ clientX: 70 }],
      } as unknown as React.TouchEvent);
    });

    expect(result.current.translateX).toBe(-30);

    act(() => {
      result.current.handlers.onTouchEnd();
    });

    // Should reset to 0
    expect(result.current.translateX).toBe(0);
  });
});
