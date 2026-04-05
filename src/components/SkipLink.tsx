/**
 * SkipLink Component
 * 
 * Provides a "Skip to main content" link as the first focusable element
 * for keyboard users to bypass navigation and jump directly to main content.
 * 
 * Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5
 */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-500 focus:text-white focus:rounded-lg focus:shadow-lg focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
