import React, { useMemo } from 'react';
import { useTransactionsStore } from '../../stores/transactionsStore';
import { computeHeatmapData } from '../../stores/selectors/heatmapDataSelector';
import { getHeatmapColor } from '../../utils/colorUtils';

/**
 * Transaction Activity Heatmap Component
 */
export const TransactionActivityHeatmap: React.FC = React.memo(() => {
  const transactions = useTransactionsStore((state) => state.transactions);

  // Compute heatmap data using selector
  const heatmapData = useMemo(() => computeHeatmapData(transactions), [transactions]);

  // Define day labels (Mon-Sun)
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Define time slot labels with clearer formatting (6 time slots covering 24 hours)
  const timeSlotLabels = ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'];

  // Format tooltip text
  const getTooltipText = (day: string, timeSlot: string, count: number): string => {
    return `${day} ${timeSlot}: ${count} transaction${count !== 1 ? 's' : ''}`;
  };

  // Group heatmap data by day for rendering
  const heatmapGrid = useMemo(() => {
    const grid: Array<Array<{ day: string; timeSlot: string; count: number }>> = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach((day) => {
      const dayData = heatmapData.filter((cell) => cell.day === day);
      grid.push(dayData);
    });

    return grid;
  }, [heatmapData]);

  // Calculate activity summary stats
  const activityStats = useMemo(() => {
    const totalTransactions = heatmapData.reduce((sum, cell) => sum + cell.count, 0);

    // Find most active day
    const dayTotals = new Map<string, number>();
    heatmapData.forEach((cell) => {
      const current = dayTotals.get(cell.day) || 0;
      dayTotals.set(cell.day, current + cell.count);
    });
    const mostActiveDay = Array.from(dayTotals.entries()).reduce(
      (max, [day, count]) => (count > max.count ? { day, count } : max),
      { day: 'N/A', count: 0 }
    );

    // Find most active time slot
    const timeSlotTotals = new Map<string, number>();
    heatmapData.forEach((cell) => {
      const current = timeSlotTotals.get(cell.timeSlot) || 0;
      timeSlotTotals.set(cell.timeSlot, current + cell.count);
    });
    const mostActiveTimeSlot = Array.from(timeSlotTotals.entries()).reduce(
      (max, [slot, count]) => (count > max.count ? { slot, count } : max),
      { slot: 'N/A', count: 0 }
    );

    // Find peak activity hour (single cell with most transactions)
    const peakCell = heatmapData.reduce((max, cell) => (cell.count > max.count ? cell : max), {
      day: 'N/A',
      timeSlot: 'N/A',
      count: 0,
    });

    // Calculate daily breakdown for bar chart
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dailyBreakdown = days.map((day) => ({
      day,
      count: dayTotals.get(day) || 0,
    }));
    const maxDailyCount = Math.max(...dailyBreakdown.map((d) => d.count), 1);

    return {
      totalTransactions,
      mostActiveDay,
      mostActiveTimeSlot,
      peakCell,
      dailyBreakdown,
      maxDailyCount,
    };
  }, [heatmapData]);

  return (
    <div className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Transaction Activity
      </h3>

      <div className="flex gap-8">
        {/* Heatmap Section */}
        <div className="flex gap-2">
          {/* Y-axis: Day labels */}
          <div className="flex flex-col gap-1" style={{ paddingTop: 'calc(1rem + 0.5rem)' }}>
            {dayLabels.map((label) => (
              <div
                key={label}
                className="h-9 flex items-center justify-end pr-2 text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Heatmap grid container */}
          <div className="flex-1">
            {/* X-axis: Time slot labels */}
            <div className="flex gap-1 mb-2 pl-0">
              {timeSlotLabels.map((label, index) => (
                <div
                  key={`${label}-${index}`}
                  className="w-9 text-center text-[10px] font-semibold text-gray-700 dark:text-gray-300"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Heatmap cells (7×7 grid) */}
            <div className="flex flex-col gap-1">
              {heatmapGrid.map((dayData, dayIndex) => (
                <div key={dayLabels[dayIndex]} className="flex gap-1">
                  {dayData.map((cell, cellIndex) => (
                    <div
                      key={`${cell.day}-${cell.timeSlot}-${cellIndex}`}
                      className={`
                      w-9 h-9 rounded-md transition-all duration-200 hover:scale-110 cursor-default
                      focus:scale-110 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                      ${getHeatmapColor(cell.count)}
                    `}
                      title={getTooltipText(cell.day, cell.timeSlot, cell.count)}
                      aria-label={getTooltipText(cell.day, cell.timeSlot, cell.count)}
                      role="gridcell"
                      tabIndex={0}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Summary Stats */}
        <div className="flex flex-col gap-4 min-w-[200px]">
          <div className="space-y-3">
            {/* Total Transactions */}
            <div className="bg-gray-50 dark:bg-navy-700 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total This Week</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activityStats.totalTransactions}
              </div>
            </div>

            {/* Most Active Day */}
            <div className="bg-gray-50 dark:bg-navy-700 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Most Active Day</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {activityStats.mostActiveDay.day.slice(0, 3)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {activityStats.mostActiveDay.count} transactions
              </div>
            </div>

            {/* Most Active Time Slot */}
            <div className="bg-gray-50 dark:bg-navy-700 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Peak Time Slot</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {activityStats.mostActiveTimeSlot.slot}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {activityStats.mostActiveTimeSlot.count} transactions
              </div>
            </div>

            {/* Peak Activity Hour */}
            <div className="bg-gray-50 dark:bg-navy-700 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Peak Activity</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {activityStats.peakCell.day.slice(0, 3)} {activityStats.peakCell.timeSlot}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {activityStats.peakCell.count} transactions
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown Chart */}
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div className="bg-gray-50 dark:bg-navy-700 rounded-lg p-4 h-full flex flex-col">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">Daily Breakdown</div>
            <div className="space-y-2 flex-1 flex flex-col justify-around">
              {activityStats.dailyBreakdown.map((dayData) => {
                const barWidth = (dayData.count / activityStats.maxDailyCount) * 100;
                return (
                  <div key={dayData.day} className="flex items-center gap-2">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8">
                      {dayData.day.slice(0, 3)}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-navy-600 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-teal-500 dark:bg-teal-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 w-6 text-right">
                      {dayData.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700/50" />
          <div className="w-4 h-4 rounded bg-teal-200 dark:bg-teal-600/60" />
          <div className="w-4 h-4 rounded bg-teal-400 dark:bg-teal-500/80" />
          <div className="w-4 h-4 rounded bg-teal-600 dark:bg-teal-400" />
          <div className="w-4 h-4 rounded bg-teal-800 dark:bg-teal-300" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
});

TransactionActivityHeatmap.displayName = 'TransactionActivityHeatmap';
