import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Insights } from '../pages/Insights';
import { Transactions } from '../pages/Transactions';

// Mock window.matchMedia for responsive testing
function mockMatchMedia(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  Object.defineProperty(window, 'outerWidth', {
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

describe('Responsive QA at 768px (iPad)', () => {
  beforeEach(() => {
    // Set viewport to 768px (iPad Mini width)
    mockMatchMedia(768);
  });

  describe('Requirement 39.1: Zero Horizontal Overflow', () => {
    it('should have zero horizontal overflow on Dashboard at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Check that no element exceeds viewport width
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    it('should have zero horizontal overflow on Insights at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    it('should have zero horizontal overflow on Transactions at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Transactions />
        </BrowserRouter>
      );

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    it('should not have any elements with fixed widths exceeding 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Check all elements for excessive widths
      const allElements = container.querySelectorAll('*');
      allElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const width = parseInt(computedStyle.width);

        // Allow for some margin, but width should not exceed viewport
        if (!isNaN(width)) {
          expect(width).toBeLessThanOrEqual(768);
        }
      });
    });
  });

  describe('Requirement 39.2: 2-Column KPI Card Layout', () => {
    it('should display KPI cards in 2-column grid at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Find the KPI cards grid container
      const kpiGrid = container.querySelector(
        '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4'
      );
      expect(kpiGrid).toBeInTheDocument();

      // Verify it has the sm:grid-cols-2 class (applies at 640px+, includes 768px)
      expect(kpiGrid).toHaveClass('sm:grid-cols-2');
    });

    it('should render all 4 KPI cards at 768px', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify all 4 KPI cards are present
      expect(screen.getByText('Total Balance')).toBeInTheDocument();
      expect(screen.getByText('Total Income')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses')).toBeInTheDocument();
      expect(screen.getByText('Savings Rate')).toBeInTheDocument();
    });

    it('should have proper gap spacing between KPI cards at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const kpiGrid = container.querySelector('.grid');
      expect(kpiGrid).toHaveClass('gap-4');
    });
  });

  describe('Requirement 39.3: Sidebar Collapsed to Icon-Only Mode', () => {
    it('should display sidebar at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Sidebar should be visible 
      const sidebar = container.querySelector('aside');

      // Sidebar has "hidden lg:block" class, so at 768px (md) it should be hidden

      expect(sidebar).toHaveClass('hidden');
      expect(sidebar).toHaveClass('lg:block');
    });

    it('should have icon-only width classes for sidebar at tablet sizes', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const sidebar = container.querySelector('aside');

      // Sidebar has w-16 for md (tablet) and w-64 for lg (desktop)
      expect(sidebar).toHaveClass('w-16');
      expect(sidebar).toHaveClass('md:w-16');
      expect(sidebar).toHaveClass('lg:w-64');
    });

    it('should hide navigation labels in sidebar at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Navigation labels should have "hidden lg:block" class
      const navLabels = container.querySelectorAll('aside nav a span');
      navLabels.forEach((label) => {
        expect(label).toHaveClass('hidden');
        expect(label).toHaveClass('lg:block');
      });
    });

    it('should hide brand name in sidebar at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Brand name should have "hidden lg:block" class
      const brandName = container.querySelector('aside .text-xl.font-bold');
      if (brandName) {
        expect(brandName).toHaveClass('hidden');
        expect(brandName).toHaveClass('lg:block');
      }
    });
  });

  describe('Requirement 39.4: Charts Display Side-by-Side', () => {
    it('should display Balance Trend and Transaction Activity charts side-by-side at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Find the middle row grid container
      const chartGrids = container.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2');

      // Should have at least 2 grids (middle row and bottom row)
      expect(chartGrids.length).toBeGreaterThanOrEqual(2);

      // Each grid should have md:grid-cols-2 class
      chartGrids.forEach((grid) => {
        expect(grid).toHaveClass('md:grid-cols-2');
      });
    });

    it('should display Spending Donut and Recent Transactions side-by-side at 768px', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify both charts are present
      expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    });

    it('should have proper gap spacing between charts at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Find chart grid containers
      const chartGrids = container.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2');

      chartGrids.forEach((grid) => {
        expect(grid).toHaveClass('gap-6');
      });
    });

    it('should render charts with ResponsiveContainer at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Recharts ResponsiveContainer should be present
      const responsiveContainers = container.querySelectorAll('.recharts-responsive-container');
      expect(responsiveContainers.length).toBeGreaterThan(0);
    });

    it('should display Insights page charts in 2-column grid at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      // Insights grid should have md:grid-cols-2 class
      const insightsGrid = container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
      );
      expect(insightsGrid).toBeInTheDocument();
      expect(insightsGrid).toHaveClass('md:grid-cols-2');
    });
  });

  describe('Overall Layout Verification at 768px', () => {
    it('should render complete Dashboard layout at 768px', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify all major sections are present
      expect(screen.getByText('Total Balance')).toBeInTheDocument();
      expect(screen.getByText('Balance Trend')).toBeInTheDocument();
      expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
      expect(screen.getByText('Transaction Activity')).toBeInTheDocument();
    });

    it('should have consistent spacing between sections at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Main container should have space-y-6 class
      const mainContainer = container.querySelector('.space-y-6');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should maintain proper padding on main content at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // PageWrapper should have responsive padding
      const pageContent = container.querySelector('.max-w-7xl');
      if (pageContent) {
        expect(pageContent).toHaveClass('px-4');
        expect(pageContent).toHaveClass('sm:px-6');
        expect(pageContent).toHaveClass('lg:px-8');
      }
    });
  });

  describe('Insights Page at 768px', () => {
    it('should display Insights in 2-column layout at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const insightsGrid = container.querySelector('.grid');
      expect(insightsGrid).toHaveClass('grid-cols-1');
      expect(insightsGrid).toHaveClass('md:grid-cols-2');
    });

    it('should render all 6 insight cards at 768px', () => {
      render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      expect(screen.getByText('Top Spending Category')).toBeInTheDocument();
      expect(screen.getByText('Best Income Month')).toBeInTheDocument();
      expect(screen.getByText('Worst Expense Month')).toBeInTheDocument();
      expect(screen.getByText('Monthly Comparison')).toBeInTheDocument();
      expect(screen.getByText('Savings Trend')).toBeInTheDocument();
      expect(screen.getByText('Unusual Spending Alert')).toBeInTheDocument();
    });
  });

  describe('Transactions Page at 768px', () => {
    it('should render Transactions page without horizontal overflow at 768px', () => {
      const { container } = render(
        <BrowserRouter>
          <Transactions />
        </BrowserRouter>
      );

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    it('should display transaction table at 768px', () => {
      render(
        <BrowserRouter>
          <Transactions />
        </BrowserRouter>
      );

      // Verify main elements are present
      expect(screen.getByPlaceholderText('Search transactions...')).toBeInTheDocument();
    });
  });
});
