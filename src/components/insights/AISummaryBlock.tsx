import React from 'react';
import type { AISummary } from '../../types';

interface AISummaryBlockProps {
  summary: AISummary;
}

export const AISummaryBlock: React.FC<AISummaryBlockProps> = React.memo(({ summary }) => {
  return (
    <div
      className="relative bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-md border border-teal-200/50 dark:border-teal-700/50 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:outline-none"
      tabIndex={0}
      role="region"
      aria-label="AI-generated financial insights summary"
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex items-start gap-4">
        {/* Financial insights icon - lightbulb with dollar and magnifying glass */}
        <div className="flex-shrink-0 p-4 bg-teal-500 rounded-xl">
          <svg
            className="w-10 h-10 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Lightbulb */}
            <path d="M9 18h6" />
            <path d="M10 21h4" />
            <path d="M12 3a5 5 0 0 1 5 5c0 2-1 3-2 4v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1c-1-1-2-2-2-4a5 5 0 0 1 5-5z" />
            {/* Dollar sign inside bulb */}
            <path d="M12 6v2m0 2v2" strokeWidth={1.2} />
            <path d="M11 8h2m-2 2h2" strokeWidth={1.2} />
            {/* Magnifying glass */}
            <circle cx="18" cy="18" r="3" strokeWidth={1.5} />
            <path d="M20.5 20.5l1.5 1.5" strokeWidth={1.5} />
            {/* Eye in magnifying glass */}
            <circle cx="18" cy="18" r="0.5" fill="currentColor" />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Financial Insights
            </h3>
            <span className="px-2.5 py-0.5 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold rounded-md">
              AI
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary.text}</p>
        </div>
      </div>
    </div>
  );
});
