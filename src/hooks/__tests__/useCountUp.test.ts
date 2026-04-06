import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCountUp } from '../useCountUp';

describe('useCountUp', () => {
  it('should start from 0', () => {
    const { result } = renderHook(() => useCountUp(100, 800));
    expect(result.current).toBe(0);
  });

  it('should animate to target value', async () => {
    const { result } = renderHook(() => useCountUp(100, 100));

    // Initial value should be 0
    expect(result.current).toBe(0);

    // Wait for animation to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    // Should be at or near target
    expect(result.current).toBeGreaterThanOrEqual(99);
    expect(result.current).toBeLessThanOrEqual(100);
  });

  it('should use default duration of 800ms', () => {
    const { result } = renderHook(() => useCountUp(100));
    expect(result.current).toBe(0);
  });

  it('should restart animation when target value changes', async () => {
    const { result, rerender } = renderHook(({ target }) => useCountUp(target, 100), {
      initialProps: { target: 100 },
    });

    // Wait for initial animation
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    const firstValue = result.current;
    expect(firstValue).toBeGreaterThan(90);

    // Change target value
    rerender({ target: 200 });

    // Should restart from 0
    expect(result.current).toBe(0);

    // Wait for new animation
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    // Should be animating to new target
    expect(result.current).toBeGreaterThan(150);
  });

  it('should handle zero target value', () => {
    const { result } = renderHook(() => useCountUp(0, 800));
    expect(result.current).toBe(0);
  });

  it('should handle negative target values', async () => {
    const { result } = renderHook(() => useCountUp(-100, 100));

    expect(result.current).toBe(0);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current).toBeLessThanOrEqual(-99);
  });
});
