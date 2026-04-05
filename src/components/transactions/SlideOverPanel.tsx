import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface SlideOverPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function SlideOverPanel({ isOpen, onClose, title, children }: SlideOverPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useUIStore((state) => state.prefersReducedMotion);

  // Use focus trap hook
  useFocusTrap(panelRef, {
    isActive: isOpen,
    onEscape: onClose,
  });

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with 50% opacity and fade animation */}
      <div
        className={`fixed inset-0 bg-black/50 ${!prefersReducedMotion ? 'animate-backdrop-in' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel sliding in from right */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slide-over-title"
        className="fixed inset-y-0 right-0 flex max-w-full"
      >
        <div className={`w-screen md:max-w-[480px] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${!prefersReducedMotion ? 'animate-slide-in' : ''}`}>
          <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2
                id="slide-over-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Close panel"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
