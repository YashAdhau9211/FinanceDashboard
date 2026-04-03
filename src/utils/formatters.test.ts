import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatCurrency, formatDate, formatShortAmount } from './formatters';

describe('formatCurrency', () => {
  it('should format positive numbers with INR symbol and 2 decimal places', () => {
    expect(formatCurrency(1234.56)).toBe('₹1,234.56');
    expect(formatCurrency(100000)).toBe('₹1,00,000.00');
  });

  it('should format negative numbers with negative sign', () => {
    expect(formatCurrency(-500)).toBe('-₹500.00');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('₹0.00');
  });

  it('Property 1: Currency Formatting Consistency - should format any number with INR pattern', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1e10, max: 1e10, noNaN: true }),
        (amount) => {
          const result = formatCurrency(amount);
          
          // Verify output matches INR currency format pattern
          const pattern = /^-?₹[\d,]+\.\d{2}$/;
          expect(result).toMatch(pattern);
          
          // Verify exactly 2 decimal places
          const decimalPart = result.split('.')[1];
          expect(decimalPart).toHaveLength(2);
          
          // Verify negative numbers have negative sign before rupee symbol
          if (amount < 0 || Object.is(amount, -0)) {
            expect(result).toMatch(/^-₹/);
          } else {
            expect(result).toMatch(/^₹/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('formatDate', () => {
  it('should format ISO 8601 date strings to MMM DD, YYYY format', () => {
    expect(formatDate('2025-01-15')).toBe('Jan 15, 2025');
    expect(formatDate('2026-03-30')).toBe('Mar 30, 2026');
  });

  it('Property 2: Date Formatting Consistency - should format any valid ISO date', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31') }),
        (date) => {
          // Skip invalid dates
          fc.pre(!isNaN(date.getTime()));
          
          const isoString = date.toISOString().split('T')[0];
          const result = formatDate(isoString);
          
          // Verify output matches "MMM DD, YYYY" pattern
          const pattern = /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/;
          expect(result).toMatch(pattern);
          
          // Verify month is abbreviated to 3 letters
          const month = result.split(' ')[0];
          expect(month).toHaveLength(3);
          
          // Verify year is 4 digits
          const year = result.split(', ')[1];
          expect(year).toHaveLength(4);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('formatShortAmount', () => {
  it('should format numbers less than 1000 with ₹ symbol only', () => {
    expect(formatShortAmount(500)).toBe('₹500');
    expect(formatShortAmount(999)).toBe('₹999');
  });

  it('should format thousands with K suffix', () => {
    expect(formatShortAmount(1500)).toBe('₹1.5K');
    expect(formatShortAmount(50000)).toBe('₹50.0K');
  });

  it('should format lakhs with L suffix', () => {
    expect(formatShortAmount(250000)).toBe('₹2.5L');
    expect(formatShortAmount(5000000)).toBe('₹50.0L');
  });

  it('should format crores with Cr suffix', () => {
    expect(formatShortAmount(15000000)).toBe('₹1.5Cr');
    expect(formatShortAmount(100000000)).toBe('₹10.0Cr');
  });

  it('should handle negative numbers correctly', () => {
    expect(formatShortAmount(-1500)).toBe('-₹1.5K');
    expect(formatShortAmount(-250000)).toBe('-₹2.5L');
  });

  it('Property 3: Short Amount Formatting Rules - should apply correct suffix based on Indian numbering', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1e10, max: 1e10, noNaN: true }),
        (amount) => {
          const result = formatShortAmount(amount);
          const absAmount = Math.abs(amount);
          
          // Verify all outputs include ₹ symbol
          expect(result).toContain('₹');
          
          // Verify negative numbers preserve sign
          if (amount < 0) {
            expect(result).toMatch(/^-₹/);
          }
          
          // Verify correct suffix based on range
          if (absAmount < 1000) {
            // No suffix, just ₹ symbol
            expect(result).not.toContain('K');
            expect(result).not.toContain('L');
            expect(result).not.toContain('Cr');
          } else if (absAmount >= 1000 && absAmount < 100000) {
            // K suffix for thousands
            expect(result).toContain('K');
          } else if (absAmount >= 100000 && absAmount < 10000000) {
            // L suffix for lakhs
            expect(result).toContain('L');
          } else if (absAmount >= 10000000) {
            // Cr suffix for crores
            expect(result).toContain('Cr');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
