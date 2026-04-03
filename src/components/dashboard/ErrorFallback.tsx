import { AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
  sectionName: string;
  error: Error;
  onRetry: () => void;
}

export function ErrorFallback({ sectionName, error, onRetry }: ErrorFallbackProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
            Error in {sectionName}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400 mb-3">
            {error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
