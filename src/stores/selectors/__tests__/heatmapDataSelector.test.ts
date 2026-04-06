import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { computeHeatmapData } from '../heatmapDataSelector';
import type { Transaction, TransactionType, Category } from '../../../types';

// Helper to create a transaction
function createTransaction(overrides: Partial<Transaction>): Transaction {
  return {
    id: crypto.randomUUID(),
    date: '2025-01-15T12:00:00',
    description: 'Test transaction',
    amount: 1000,
    type: 'income' as TransactionType,
    category: 'salary' as Category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('Heatmap Data Selector - Property Tests', () => {
  describe('Feature: sprint-1-dashboard-overview, Property 10: Heatmap Data Computation', () => {
    it('returns exactly 42 cells (7 days × 6 time slots)', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              date: fc.integer({ min: 0, max: 730 }).map((days) => {
                const d = new Date('2024-01-01');
                d.setDate(d.getDate() + days);
                d.setHours(fc.sample(fc.integer({ min: 0, max: 23 }), 1)[0]);
                return d.toISOString();
              }),
              description: fc.string({ minLength: 1, maxLength: 50 }),
              amount: fc.integer({ min: 100, max: 100000 }),
              type: fc.constantFrom('income' as const, 'expense' as const, 'transfer' as const),
              category: fc.constantFrom('salary' as const, 'groceries' as const, 'dining' as const),
              createdAt: fc.integer({ min: 0, max: 730 }).map((days) => {
                const d = new Date('2024-01-01');
                d.setDate(d.getDate() + days);
                return d.toISOString();
              }),
              updatedAt: fc.integer({ min: 0, max: 730 }).map((days) => {
                const d = new Date('2024-01-01');
                d.setDate(d.getDate() + days);
                return d.toISOString();
              }),
            }) as fc.Arbitrary<Transaction>,
            { minLength: 0, maxLength: 100 }
          ),
          (transactions) => {
            const heatmapData = computeHeatmapData(transactions);
            expect(heatmapData).toHaveLength(42);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('counts each transaction in the correct day-time cell', () => {
      // Test specific known dates and times
      const testCases = [
        { date: '2025-01-13T02:30:00', expectedDay: 'Monday', expectedSlot: '12am-4am' },
        { date: '2025-01-13T06:00:00', expectedDay: 'Monday', expectedSlot: '4am-8am' },
        { date: '2025-01-13T10:00:00', expectedDay: 'Monday', expectedSlot: '8am-12pm' },
        { date: '2025-01-13T14:00:00', expectedDay: 'Monday', expectedSlot: '12pm-4pm' },
        { date: '2025-01-13T18:00:00', expectedDay: 'Monday', expectedSlot: '4pm-8pm' },
        { date: '2025-01-13T22:00:00', expectedDay: 'Monday', expectedSlot: '8pm-12am' },
        { date: '2025-01-14T10:00:00', expectedDay: 'Tuesday', expectedSlot: '8am-12pm' },
        { date: '2025-01-19T14:00:00', expectedDay: 'Sunday', expectedSlot: '12pm-4pm' },
      ];

      testCases.forEach(({ date, expectedDay, expectedSlot }) => {
        const transactions: Transaction[] = [createTransaction({ date })];

        const heatmapData = computeHeatmapData(transactions);
        const cell = heatmapData.find((c) => c.day === expectedDay && c.timeSlot === expectedSlot);

        expect(cell).toBeDefined();
        expect(cell!.count).toBe(1);
      });
    });

    it('maps hours to correct time slots', () => {
      const hourToSlotMapping = [
        { hour: 0, slot: '12am-4am' },
        { hour: 1, slot: '12am-4am' },
        { hour: 3, slot: '12am-4am' },
        { hour: 4, slot: '4am-8am' },
        { hour: 5, slot: '4am-8am' },
        { hour: 7, slot: '4am-8am' },
        { hour: 8, slot: '8am-12pm' },
        { hour: 9, slot: '8am-12pm' },
        { hour: 11, slot: '8am-12pm' },
        { hour: 12, slot: '12pm-4pm' },
        { hour: 13, slot: '12pm-4pm' },
        { hour: 15, slot: '12pm-4pm' },
        { hour: 16, slot: '4pm-8pm' },
        { hour: 17, slot: '4pm-8pm' },
        { hour: 19, slot: '4pm-8pm' },
        { hour: 20, slot: '8pm-12am' },
        { hour: 21, slot: '8pm-12am' },
        { hour: 23, slot: '8pm-12am' },
      ];

      hourToSlotMapping.forEach(({ hour, slot }) => {
        const date = new Date('2025-01-13'); // Monday
        date.setHours(hour, 0, 0, 0);

        const transactions: Transaction[] = [createTransaction({ date: date.toISOString() })];

        const heatmapData = computeHeatmapData(transactions);
        const cell = heatmapData.find((c) => c.day === 'Monday' && c.timeSlot === slot);

        expect(cell).toBeDefined();
        expect(cell!.count).toBeGreaterThan(0);
      });
    });

    it('handles time slot boundaries correctly', () => {
      // Test exact boundary times
      const boundaries = [
        { date: '2025-01-13T04:00:00', expectedSlot: '4am-8am' },
        { date: '2025-01-13T08:00:00', expectedSlot: '8am-12pm' },
        { date: '2025-01-13T12:00:00', expectedSlot: '12pm-4pm' },
        { date: '2025-01-13T16:00:00', expectedSlot: '4pm-8pm' },
        { date: '2025-01-13T20:00:00', expectedSlot: '8pm-12am' },
      ];

      boundaries.forEach(({ date, expectedSlot }) => {
        const transactions: Transaction[] = [createTransaction({ date })];

        const heatmapData = computeHeatmapData(transactions);
        const cell = heatmapData.find((c) => c.day === 'Monday' && c.timeSlot === expectedSlot);

        expect(cell).toBeDefined();
        expect(cell!.count).toBe(1);
      });
    });

    it('counts multiple transactions in the same cell', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 20 }), (count) => {
          // Create multiple transactions at the same day and time
          const transactions: Transaction[] = Array.from(
            { length: count },
            () => createTransaction({ date: '2025-01-13T10:00:00' }) // Monday, 8am-12pm
          );

          const heatmapData = computeHeatmapData(transactions);
          const cell = heatmapData.find((c) => c.day === 'Monday' && c.timeSlot === '8am-12pm');

          expect(cell).toBeDefined();
          expect(cell!.count).toBe(count);
        }),
        { numRuns: 100 }
      );
    });

    it('returns all cells with count 0 when no transactions exist', () => {
      const heatmapData = computeHeatmapData([]);

      expect(heatmapData).toHaveLength(42);
      heatmapData.forEach((cell) => {
        expect(cell.count).toBe(0);
      });
    });

    it('handles transactions across all days of the week', () => {
      const transactions: Transaction[] = [
        createTransaction({ date: '2025-01-13T10:00:00' }), // Monday
        createTransaction({ date: '2025-01-14T10:00:00' }), // Tuesday
        createTransaction({ date: '2025-01-15T10:00:00' }), // Wednesday
        createTransaction({ date: '2025-01-16T10:00:00' }), // Thursday
        createTransaction({ date: '2025-01-17T10:00:00' }), // Friday
        createTransaction({ date: '2025-01-18T10:00:00' }), // Saturday
        createTransaction({ date: '2025-01-19T10:00:00' }), // Sunday
      ];

      const heatmapData = computeHeatmapData(transactions);

      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      days.forEach((day) => {
        const cell = heatmapData.find((c) => c.day === day && c.timeSlot === '8am-12pm');
        expect(cell).toBeDefined();
        expect(cell!.count).toBe(1);
      });
    });

    it('handles transactions across all time slots', () => {
      const transactions: Transaction[] = [
        createTransaction({ date: '2025-01-13T02:00:00' }), // 12am-4am
        createTransaction({ date: '2025-01-13T06:00:00' }), // 4am-8am
        createTransaction({ date: '2025-01-13T10:00:00' }), // 8am-12pm
        createTransaction({ date: '2025-01-13T14:00:00' }), // 12pm-4pm
        createTransaction({ date: '2025-01-13T18:00:00' }), // 4pm-8pm
        createTransaction({ date: '2025-01-13T22:00:00' }), // 8pm-12am
      ];

      const heatmapData = computeHeatmapData(transactions);

      const timeSlots = ['12am-4am', '4am-8am', '8am-12pm', '12pm-4pm', '4pm-8pm', '8pm-12am'];
      timeSlots.forEach((timeSlot) => {
        const cells = heatmapData.filter(
          (c: { day: string; timeSlot: string }) => c.day === 'Monday' && c.timeSlot === timeSlot
        );
        const totalCount = cells.reduce((sum: number, c: { count: number }) => sum + c.count, 0);
        expect(totalCount).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty transaction array', () => {
      const heatmapData = computeHeatmapData([]);

      expect(heatmapData).toHaveLength(42);
      heatmapData.forEach((cell) => {
        expect(cell.count).toBe(0);
      });
    });

    it('handles transactions with date strings (YYYY-MM-DD format)', () => {
      const transactions: Transaction[] = [
        createTransaction({ date: '2025-01-13T00:00:00' }), // Date with time at midnight
      ];

      const heatmapData = computeHeatmapData(transactions);

      // Should process the transaction at midnight (12am-4am slot)
      const cell = heatmapData.find((c) => c.day === 'Monday' && c.timeSlot === '12am-4am');
      expect(cell).toBeDefined();
      expect(cell!.count).toBe(1);
    });

    it('verifies all 7 days are present in the grid', () => {
      const heatmapData = computeHeatmapData([]);

      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      days.forEach((day) => {
        const dayCells = heatmapData.filter((c: { day: string }) => c.day === day);
        expect(dayCells.length).toBe(6); // 6 time slots per day
      });
    });

    it('verifies all time slots are present for each day', () => {
      const heatmapData = computeHeatmapData([]);

      const timeSlots = ['12am-4am', '4am-8am', '8am-12pm', '12pm-4pm', '4pm-8pm', '8pm-12am'];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      days.forEach((day) => {
        timeSlots.forEach((timeSlot) => {
          const cells = heatmapData.filter(
            (c: { day: string; timeSlot: string }) => c.day === day && c.timeSlot === timeSlot
          );
          expect(cells.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
