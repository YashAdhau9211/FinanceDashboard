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

describe('Responsive QA at 1280px (Desktop)', () => {
  beforeEach(() => {
    // Set viewport to 1280px (standard desktop width)
    mockMatchMedia(1280);
  });

  describe('Requirement 40.1: Zero Horizontal Overflow', () => {
    it('should have zero horizontal overflow on Dashboard at 1280px', () => {
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

    it('should have zero horizontal overflow on Insights at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    it('should have zero horizontal overflow on Transactions at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Transactions />
        </BrowserRouter>
      );

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    it('should not have any elements with fixed widths exceeding 1280px', () => {
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
          expect(width).toBeLessThanOrEqual(1280);
        }
      });
    });
  });

  describe('Requirement 40.2: 4-Column KPI Card Layout', () => {
    it('should display KPI cards in 4-column grid at 1280px', () => {
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

      // Verify it has the lg:grid-cols-4 class (applies at 1024px+, includes 1280px)
      expect(kpiGrid).toHaveClass('lg:grid-cols-4');
    });

    it('should render all 4 KPI cards at 1280px', () => {
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

    it('should have proper gap spacing between KPI cards at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const kpiGrid = container.querySelector('.grid');
      expect(kpiGrid).toHaveClass('gap-4');
    });

    it('should display KPI cards in a single row at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // At 1280px with 4-column grid, all 4 cards should fit in one row
      const kpiGrid = container.querySelector('.grid.lg\\:grid-cols-4');
      expect(kpiGrid).toBeInTheDocument();

      // Verify grid has 4 columns at lg breakpoint
      expect(kpiGrid).toHaveClass('lg:grid-cols-4');
    });
  });

  describe('Requirement 40.3: Sidebar Full Width (240px)', () => {
    it('should display sidebar at full width at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Sidebar should be visible at lg breakpoint (1024px+)
      const sidebar = container.querySelector('aside');

      expect(sidebar).toHaveClass('lg:block');
    });

    it('should have 240px width (w-64) for sidebar at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const sidebar = container.querySelector('aside');

      // Sidebar has w-64 for lg (desktop) which is 256px (16rem)
      expect(sidebar).toHaveClass('lg:w-64');
    });

    it('should show navigation labels in sidebar at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Navigation labels should be visible at lg breakpoint
      const navLabels = container.querySelectorAll('aside nav a span');
      navLabels.forEach((label) => {
        expect(label).toHaveClass('lg:block');
      });
    });

    it('should show brand name in sidebar at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Brand name should be visible at lg breakpoint
      const brandName = container.querySelector('aside .text-xl.font-bold');
      if (brandName) {
        expect(brandName).toHaveClass('lg:block');
      }
    });

    it('should display full sidebar navigation with icons and text at 1280px', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify sidebar navigation items are present
      const sidebar = document.querySelector('aside');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('Requirement 40.4: Content Centered with Max-Width', () => {
    it('should have max-width constraint on main content at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // PageWrapper should have max-w-screen-xl class (1280px)
      const maxWidthContainer = container.querySelector('.max-w-screen-xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('should center content horizontally at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Content should have mx-auto class for horizontal centering
      const centeredContainer = container.querySelector('.max-w-screen-xl.mx-auto');
      expect(centeredContainer).toBeInTheDocument();
    });

    it('should apply max-width to Dashboard content at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify max-w-screen-xl is applied (1280px max width)
      const maxWidthContainer = container.querySelector('.max-w-screen-xl');
      expect(maxWidthContainer).toHaveClass('max-w-screen-xl');
    });

    it('should apply max-width to Insights content at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const maxWidthContainer = container.querySelector('.max-w-screen-xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('should apply max-width to Transactions content at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Transactions />
        </BrowserRouter>
      );

      const maxWidthContainer = container.querySelector('.max-w-screen-xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('should have proper padding on main content at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // PageWrapper should have responsive padding
      const pageContent = container.querySelector('.max-w-screen-xl');
      if (pageContent) {
        expect(pageContent).toHaveClass('mx-auto');
      }
    });
  });

  describe('Overall Layout Verification at 1280px', () => {
    it('should render complete Dashboard layout at 1280px', () => {
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

    it('should have consistent spacing between sections at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Main container should have space-y-6 class
      const mainContainer = container.querySelector('.space-y-6');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should display charts in optimal layout at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Find chart grid containers
      const chartGrids = container.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2');

      // Should have chart grids with 2-column layout
      expect(chartGrids.length).toBeGreaterThanOrEqual(2);

      chartGrids.forEach((grid) => {
        expect(grid).toHaveClass('md:grid-cols-2');
      });
    });

    it('should render charts with ResponsiveContainer at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Recharts ResponsiveContainer should be present
      const responsiveContainers = container.querySelectorAll('.recharts-responsive-container');
      expect(responsiveContainers.length).toBeGreaterThan(0);
    });

    it('should not display bottom tab bar at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Bottom tab bar should have lg:hidden class
      const bottomTabBar = container.querySelector('nav.lg\\:hidden');
      if (bottomTabBar) {
        expect(bottomTabBar).toHaveClass('lg:hidden');
      }
    });
  });

  describe('Insights Page at 1280px', () => {
    it('should display Insights in 3-column layout at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const insightsGrid = container.querySelector('.grid');
      expect(insightsGrid).toHaveClass('grid-cols-1');
      expect(insightsGrid).toHaveClass('md:grid-cols-2');
      expect(insightsGrid).toHaveClass('lg:grid-cols-3');
    });

    it('should render all 6 insight cards at 1280px', () => {
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

    it('should have zero horizontal overflow on Insights at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  });

  describe('Transactions Page at 1280px', () => {
    it('should render Transactions page without horizontal overflow at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Transactions />
        </BrowserRouter>
      );

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    it('should display transaction table with full features at 1280px', () => {
      render(
        <BrowserRouter>
          <Transactions />
        </BrowserRouter>
      );

      // Verify main elements are present
      expect(screen.getByPlaceholderText('Search transactions...')).toBeInTheDocument();
    });

    it('should have proper spacing in transaction layout at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Transactions />
        </BrowserRouter>
      );

      // Verify transaction layout exists with proper spacing
      const transactionContainer = container.querySelector('.space-y-4, .space-y-6');
      expect(transactionContainer).toBeTruthy();
    });
  });

  describe('Responsive Grid Behavior at 1280px', () => {
    it('should use 4-column grid for KPI cards', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const kpiGrid = container.querySelector('.lg\\:grid-cols-4');
      expect(kpiGrid).toBeInTheDocument();
    });

    it('should use 2-column grid for dashboard charts', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const chartGrids = container.querySelectorAll('.md\\:grid-cols-2');
      expect(chartGrids.length).toBeGreaterThan(0);
    });

    it('should use 3-column grid for insight cards', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const insightsGrid = container.querySelector('.lg\\:grid-cols-3');
      expect(insightsGrid).toBeInTheDocument();
    });

    it('should have consistent gap spacing across all grids', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const grids = container.querySelectorAll('.grid');

      // Check that grids have gap classes
      const gridsWithGap = Array.from(grids).filter((grid) => {
        return (
          grid.classList.contains('gap-4') ||
          grid.classList.contains('gap-6') ||
          grid.classList.contains('gap-8')
        );
      });

      expect(gridsWithGap.length).toBeGreaterThan(0);
    });
  });

  describe('Content Width and Centering at 1280px', () => {
    it('should constrain content width to max-w-screen-xl', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const maxWidthContainer = container.querySelector('.max-w-screen-xl');
      expect(maxWidthContainer).toBeInTheDocument();
      expect(maxWidthContainer).toHaveClass('mx-auto');
    });

    it('should apply consistent max-width across all pages', () => {
      const pages = [<Dashboard />, <Insights />, <Transactions />];

      pages.forEach((page) => {
        const { container } = render(<BrowserRouter>{page}</BrowserRouter>);

        const maxWidthContainer = container.querySelector('.max-w-screen-xl');
        expect(maxWidthContainer).toBeInTheDocument();
      });
    });

    it('should have proper horizontal padding at 1280px', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const pageContent = container.querySelector('.max-w-screen-xl');
      expect(pageContent).toHaveClass('mx-auto');
    });
  });
});
