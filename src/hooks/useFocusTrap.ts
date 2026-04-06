import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * useFocusTrap Hook
 * 
 * Traps focus within a container element (e.g., modal, slide-over panel).
 * Handles Tab/Shift+Tab cycling and Escape key to close.
 * 
 * Validates: Requirements 26.4, 26.7
 */

interface UseFocusTrapOptions {
  isActive: boolean;
  onEscape?: () => void;
}

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions
): void {
  const { isActive, onEscape } = options;

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const container = ref.current;
    const previousFocus = document.activeElement instanceof HTMLElement 
      ? document.activeElement 
      : null;

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      return container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    };

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];

    // Focus the first element
    firstElement?.focus();

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      // Handle Tab key for focus cycling
      if (e.key === 'Tab') {
        const currentFocusableElements = getFocusableElements();
        const currentFirst = currentFocusableElements[0];
        const currentLast = currentFocusableElements[currentFocusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: cycle backwards
          if (document.activeElement === currentFirst) {
            e.preventDefault();
            currentLast?.focus();
          }
        } else {
          // Tab: cycle forwards
          if (document.activeElement === currentLast) {
            e.preventDefault();
            currentFirst?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: restore focus to previous element
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isActive, ref, onEscape]);
}
