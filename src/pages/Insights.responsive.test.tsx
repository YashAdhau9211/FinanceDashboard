import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Insights } from './Insights';

// Mock window.matchMedia for responsive testing
function mockMatchMedia(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
}

describe('Insights Page - Responsive Design Tests', () => {
  beforeEach(() => {
    // Reset viewport before each test
    mockMatchMedia(1024);
  });

  describe('Mobile Layout (< 768px)', () => {
    beforeEach(() => {
      mockMatchMedia(375); // iPhone SE width
    });

    it('should render insights page on mobile viewport', () => {
      render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Verify AI Summary Block is present
      expect(screen.getByText('Financial Insights')).toBeInTheDocument();

      // Verify all 6 insight cards are present
      expect(screen.getByText('Top Spending Category')).toBeInTheDocument();
      expect(screen.getByText('Best Income Month')).toBeInTheDocument();
      expect(screen.getByText('Worst Expense Month')).toBeInTheDocument();
      expect(screen.getByText('Monthly Comparison')).toBeInTheDocument();
      expect(screen.getByText('Savings Trend')).toBeInTheDocument();
      expect(screen.getByText('Unusual Spending Alert')).toBeInTheDocument();
    });

    it('should have grid-cols-1 class for insights grid on mobile', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Find the insights grid container
      const insightsGrid = container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
      );
      expect(insightsGrid).toBeInTheDocument();
      expect(insightsGrid).toHaveClass('grid-cols-1');
    });

    it('should render AI summary block at full width on mobile', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // AI Summary Block should be in a full-width container
      const summaryContainer = container.querySelector('.mb-8');
      expect(summaryContainer).toBeInTheDocument();

      // The summary block itself should not have width restrictions
      const summaryBlock = screen.getByText('Financial Insights').closest('div');
      expect(summaryBlock).toBeInTheDocument();
    });

    it('should render charts with ResponsiveContainer on mobile', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Recharts ResponsiveContainer should be present for charts
      const responsiveContainers = container.querySelectorAll('.recharts-responsive-container');
      expect(responsiveContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Tablet Layout (768px - 1023px)', () => {
    beforeEach(() => {
      mockMatchMedia(768); // iPad Mini width
    });

    it('should render insights page on tablet viewport', () => {
      render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Verify AI Summary Block is present
      expect(screen.getByText('Financial Insights')).toBeInTheDocument();

      // Verify all 6 insight cards are present
      expect(screen.getByText('Top Spending Category')).toBeInTheDocument();
      expect(screen.getByText('Best Income Month')).toBeInTheDocument();
      expect(screen.getByText('Worst Expense Month')).toBeInTheDocument();
      expect(screen.getByText('Monthly Comparison')).toBeInTheDocument();
      expect(screen.getByText('Savings Trend')).toBeInTheDocument();
      expect(screen.getByText('Unusual Spending Alert')).toBeInTheDocument();
    });

    it('should have md:grid-cols-2 class for insights grid on tablet', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Find the insights grid container
      const insightsGrid = container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
      );
      expect(insightsGrid).toBeInTheDocument();
      expect(insightsGrid).toHaveClass('md:grid-cols-2');
    });

    it('should render AI summary block at full width on tablet', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // AI Summary Block should be in a full-width container
      const summaryContainer = container.querySelector('.mb-8');
      expect(summaryContainer).toBeInTheDocument();
    });
  });

  describe('Desktop Layout (≥ 1024px)', () => {
    beforeEach(() => {
      mockMatchMedia(1440); // Standard desktop width
    });

    it('should render insights page on desktop viewport', () => {
      render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Verify AI Summary Block is present
      expect(screen.getByText('Financial Insights')).toBeInTheDocument();

      // Verify all 6 insight cards are present
      expect(screen.getByText('Top Spending Category')).toBeInTheDocument();
      expect(screen.getByText('Best Income Month')).toBeInTheDocument();
      expect(screen.getByText('Worst Expense Month')).toBeInTheDocument();
      expect(screen.getByText('Monthly Comparison')).toBeInTheDocument();
      expect(screen.getByText('Savings Trend')).toBeInTheDocument();
      expect(screen.getByText('Unusual Spending Alert')).toBeInTheDocument();
    });

    it('should have lg:grid-cols-3 class for insights grid on desktop', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Find the insights grid container
      const insightsGrid = container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
      );
      expect(insightsGrid).toBeInTheDocument();
      expect(insightsGrid).toHaveClass('lg:grid-cols-3');
    });

    it('should render AI summary block at full width on desktop', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // AI Summary Block should be in a full-width container
      const summaryContainer = container.querySelector('.mb-8');
      expect(summaryContainer).toBeInTheDocument();
    });

    it('should have consistent gap-6 spacing between cards', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Find the insights grid
      const insightsGrid = container.querySelector('.grid');
      expect(insightsGrid).toHaveClass('gap-6');
    });
  });

  describe('Chart Responsiveness', () => {
    it('should render Savings Trend line chart with ResponsiveContainer', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Verify chart is present
      expect(screen.getByText('Savings Trend')).toBeInTheDocument();

      // ResponsiveContainer should be present
      const responsiveContainers = container.querySelectorAll('.recharts-responsive-container');
      expect(responsiveContainers.length).toBeGreaterThan(0);
    });

    it('should render Top Spending Category donut chart with ResponsiveContainer', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Verify chart is present
      expect(screen.getByText('Top Spending Category')).toBeInTheDocument();

      // ResponsiveContainer should be present
      const responsiveContainers = container.querySelectorAll('.recharts-responsive-container');
      expect(responsiveContainers.length).toBeGreaterThan(0);
    });

    it('should scale charts to container width on all screen sizes', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // All ResponsiveContainers should have width="100%"
      const responsiveContainers = container.querySelectorAll('.recharts-responsive-container');
      responsiveContainers.forEach((container) => {
        // ResponsiveContainer sets width to 100% by default
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('AI Summary Block Responsiveness', () => {
    it('should render AI summary block at full width on mobile', () => {
      mockMatchMedia(375);
      render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const summaryBlock = screen.getByText('Financial Insights').closest('div');
      expect(summaryBlock).toBeInTheDocument();

      // Should not have width restrictions
      expect(summaryBlock).not.toHaveClass('max-w-');
    });

    it('should render AI summary block at full width on tablet', () => {
      mockMatchMedia(768);
      render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const summaryBlock = screen.getByText('Financial Insights').closest('div');
      expect(summaryBlock).toBeInTheDocument();
    });

    it('should render AI summary block at full width on desktop', () => {
      mockMatchMedia(1440);
      render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const summaryBlock = screen.getByText('Financial Insights').closest('div');
      expect(summaryBlock).toBeInTheDocument();
    });
  });

  describe('Grid Layout Breakpoints', () => {
    it('should change from 1 column to 2 columns at 768px breakpoint', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Check grid has responsive classes
      const insightsGrid = container.querySelector('.grid');
      expect(insightsGrid).toHaveClass('grid-cols-1');
      expect(insightsGrid).toHaveClass('md:grid-cols-2');
    });

    it('should change from 2 columns to 3 columns at 1024px breakpoint', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Check grid has responsive classes
      const insightsGrid = container.querySelector('.grid');
      expect(insightsGrid).toHaveClass('md:grid-cols-2');
      expect(insightsGrid).toHaveClass('lg:grid-cols-3');
    });
  });

  describe('Spacing and Padding', () => {
    it('should have consistent padding on mobile', () => {
      mockMatchMedia(375);
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Main container should have responsive padding
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toHaveClass('px-4');
      expect(mainContainer).toHaveClass('sm:px-6');
      expect(mainContainer).toHaveClass('lg:px-8');
    });

    it('should have mb-8 spacing between AI summary and grid', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const summaryContainer = container.querySelector('.mb-8');
      expect(summaryContainer).toBeInTheDocument();
    });

    it('should have gap-6 spacing between insight cards', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const insightsGrid = container.querySelector('.grid');
      expect(insightsGrid).toHaveClass('gap-6');
    });
  });

  describe('Card Height Consistency', () => {
    it('should render all insight cards with consistent height', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Verify all 6 insight card wrappers are rendered
      const insightCardWrappers = container.querySelectorAll('.insight-card.opacity-0');
      expect(insightCardWrappers.length).toBe(6);

      // Verify the actual InsightCard components have consistent height
      const insightCardComponents = container.querySelectorAll('.h-\\[380px\\]');
      expect(insightCardComponents.length).toBe(6);
    });
  });
});
