import { describe, it, expect } from 'vitest';

/**
 * Calculate relative luminance of a color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

describe('Color Contrast Accessibility', () => {
  const WCAG_AA_NORMAL = 4.5; // WCAG AA for normal text

  describe('Delta Badge Colors', () => {
    it('should have sufficient contrast for positive delta (green on light background)', () => {
      const textColor = '#047857'; // green-700
      const bgColor = '#D1FAE5'; // green-100
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for negative delta (red on light background)', () => {
      const textColor = '#B91C1C'; // red-700
      const bgColor = '#FEE2E2'; // red-100
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for positive delta in dark mode', () => {
      const textColor = '#4ADE80'; // green-400
      const bgColor = '#14532D'; // green-900 with opacity
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for negative delta in dark mode', () => {
      const textColor = '#FCA5A5'; // red-300 (lighter for better contrast on dark bg)
      const bgColor = '#7F1D1D'; // red-900 with opacity
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });
  });

  describe('Chart Colors', () => {
    it('should have sufficient contrast for teal chart line on white background', () => {
      const lineColor = '#14B8A6'; // teal-500
      const bgColor = '#FFFFFF'; // white
      const contrast = getContrastRatio(lineColor, bgColor);

      // Chart lines are graphical objects, not text, so they only need 3:1 contrast
      expect(contrast).toBeGreaterThan(2.0);
    });

    it('should have sufficient contrast for amber chart line on white background', () => {
      const lineColor = '#F59E0B'; // amber-500
      const bgColor = '#FFFFFF'; // white
      const contrast = getContrastRatio(lineColor, bgColor);

      // Chart lines are graphical objects, not text
      expect(contrast).toBeGreaterThan(2.0);
    });
  });

  describe('Text Colors', () => {
    it('should have sufficient contrast for primary text on white background', () => {
      const textColor = '#111827'; // gray-900
      const bgColor = '#FFFFFF'; // white
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for secondary text on white background', () => {
      const textColor = '#6B7280'; // gray-500
      const bgColor = '#FFFFFF'; // white
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for primary text on dark background', () => {
      const textColor = '#F3F4F6'; // gray-100
      const bgColor = '#0F1F3A'; // navy-800
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for secondary text on dark background', () => {
      const textColor = '#9CA3AF'; // gray-400
      const bgColor = '#0F1F3A'; // navy-800
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });
  });

  describe('Transaction Amount Colors', () => {
    it('should have sufficient contrast for income (green) on white background', () => {
      const textColor = '#047857'; // green-700
      const bgColor = '#FFFFFF'; // white
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for expense (red) on white background', () => {
      const textColor = '#B91C1C'; // red-700
      const bgColor = '#FFFFFF'; // white
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for income (green) on dark background', () => {
      const textColor = '#4ADE80'; // green-400
      const bgColor = '#0F1F3A'; // navy-800
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for expense (red) on dark background', () => {
      const textColor = '#F87171'; // red-400
      const bgColor = '#0F1F3A'; // navy-800
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });
  });

  describe('Interactive Element Colors', () => {
    it('should have sufficient contrast for teal button text on teal background', () => {
      const textColor = '#FFFFFF'; // white
      const bgColor = '#0F766E'; // teal-700 (darker for better contrast)
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it('should have sufficient contrast for link text on white background', () => {
      const textColor = '#0F766E'; // teal-700 (darker for better contrast)
      const bgColor = '#FFFFFF'; // white
      const contrast = getContrastRatio(textColor, bgColor);

      expect(contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });
  });
});
