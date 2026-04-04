export function SkeletonLoader() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading transactions" data-testid="skeleton-loader">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-lg bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700"
        >
          {/* Date column */}
          <div className="h-4 w-24 animate-shimmer rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]" />
          
          {/* Description column */}
          <div className="h-4 flex-1 animate-shimmer rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]" />
          
          {/* Category column */}
          <div className="h-6 w-20 animate-shimmer rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]" />
          
          {/* Type column */}
          <div className="h-6 w-16 animate-shimmer rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]" />
          
          {/* Amount column */}
          <div className="h-4 w-20 animate-shimmer rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]" />
          
          {/* Actions column */}
          <div className="flex gap-2">
            <div className="h-8 w-8 animate-shimmer rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]" />
            <div className="h-8 w-8 animate-shimmer rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading transactions...</span>
    </div>
  );
}
