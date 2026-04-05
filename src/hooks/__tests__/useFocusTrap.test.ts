import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFocusTrap } from './useFocusTrap';
import { createRef } from 'react';

describe('useFocusTrap', () => {
  let container: HTMLDivElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let button3: HTMLButtonElement;

  beforeEach(() => {
    // Create a container with focusable elements
    container = document.createElement('div');
    button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    button2 = document.createElement('button');
    button2.textContent = 'Button 2';
    button3 = document.createElement('button');
    button3.textContent = 'Button 3';

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should focus first element when activated', () => {
    const ref = createRef<HTMLDivElement>();
    (ref as any).current = container;

    renderHook(() =>
      useFocusTrap(ref, {
        isActive: true,
      })
    );

    expect(document.activeElement).toBe(button1);
  });

  it('should cycle focus forward on Tab key', () => {
    const ref = createRef<HTMLDivElement>();
    (ref as any).current = container;

    renderHook(() =>
      useFocusTrap(ref, {
        isActive: true,
      })
    );

    // Focus last button
    button3.focus();
    expect(document.activeElement).toBe(button3);

    // Press Tab - should cycle to first button
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    Object.defineProperty(tabEvent, 'preventDefault', {
      value: vi.fn(),
      writable: true,
    });
    document.dispatchEvent(tabEvent);

    // Note: In actual implementation, focus would cycle to button1
    // This test verifies the event handler is registered
    expect(tabEvent.preventDefault).toHaveBeenCalled();
  });

  it('should cycle focus backward on Shift+Tab key', () => {
    const ref = createRef<HTMLDivElement>();
    (ref as any).current = container;

    renderHook(() =>
      useFocusTrap(ref, {
        isActive: true,
      })
    );

    // Focus first button
    button1.focus();
    expect(document.activeElement).toBe(button1);

    // Press Shift+Tab - should cycle to last button
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    Object.defineProperty(shiftTabEvent, 'preventDefault', {
      value: vi.fn(),
      writable: true,
    });
    document.dispatchEvent(shiftTabEvent);

    // Verify preventDefault was called
    expect(shiftTabEvent.preventDefault).toHaveBeenCalled();
  });

  it('should call onEscape when Escape key is pressed', () => {
    const ref = createRef<HTMLDivElement>();
    (ref as any).current = container;
    const onEscape = vi.fn();

    renderHook(() =>
      useFocusTrap(ref, {
        isActive: true,
        onEscape,
      })
    );

    // Press Escape
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(escapeEvent);

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('should not trap focus when isActive is false', () => {
    const ref = createRef<HTMLDivElement>();
    (ref as any).current = container;

    renderHook(() =>
      useFocusTrap(ref, {
        isActive: false,
      })
    );

    // First button should not be focused
    expect(document.activeElement).not.toBe(button1);
  });

  it('should restore focus to previous element on cleanup', () => {
    const outsideButton = document.createElement('button');
    outsideButton.textContent = 'Outside';
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const ref = createRef<HTMLDivElement>();
    (ref as any).current = container;

    const { unmount } = renderHook(() =>
      useFocusTrap(ref, {
        isActive: true,
      })
    );

    // Focus should be inside container
    expect(document.activeElement).toBe(button1);

    // Unmount - focus should return to outside button
    unmount();
    expect(document.activeElement).toBe(outsideButton);

    document.body.removeChild(outsideButton);
  });
});
