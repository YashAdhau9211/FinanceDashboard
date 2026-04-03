import type { Transaction } from '../../types';

export interface HeatmapCell {
  day: string;
  timeSlot: string;
  count: number;
}

export function computeHeatmapData(transactions: Transaction[]): HeatmapCell[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['12am-4am', '4am-8am', '8am-12pm', '12pm-4pm', '4pm-8pm', '8pm-12am'];

  // Create a map to count transactions for each day-time combination
  const countMap = new Map<string, number>();

  // Initialize all cells with 0 count
  days.forEach((day) => {
    timeSlots.forEach((timeSlot) => {
      const key = `${day}-${timeSlot}`;
      countMap.set(key, 0);
    });
  });

  // Count transactions for each day-time combination
  transactions.forEach((t) => {
    try {
      const date = new Date(t.date);

      // Skip invalid dates
      if (isNaN(date.getTime())) {
        return;
      }

      // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const dayIndex = date.getDay();
      // Convert to Monday-first indexing
      const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1];

      // Get hour (0-23)
      const hour = date.getHours();

      // Map hour to time slot
      let timeSlot = '';
      if (hour >= 0 && hour < 4) timeSlot = '12am-4am';
      else if (hour >= 4 && hour < 8) timeSlot = '4am-8am';
      else if (hour >= 8 && hour < 12) timeSlot = '8am-12pm';
      else if (hour >= 12 && hour < 16) timeSlot = '12pm-4pm';
      else if (hour >= 16 && hour < 20) timeSlot = '4pm-8pm';
      else timeSlot = '8pm-12am';

      // Increment count for this day-time combination
      const key = `${dayName}-${timeSlot}`;
      const currentCount = countMap.get(key) || 0;
      countMap.set(key, currentCount + 1);
    } catch (error) {
      // Skip transactions with invalid dates
      console.warn('Invalid transaction date:', t.date, error);
    }
  });

  // Convert map to array of HeatmapCell objects
  const grid: HeatmapCell[] = [];
  days.forEach((day) => {
    timeSlots.forEach((timeSlot) => {
      const key = `${day}-${timeSlot}`;
      const count = countMap.get(key) || 0;
      grid.push({ day, timeSlot, count });
    });
  });

  return grid;
}
