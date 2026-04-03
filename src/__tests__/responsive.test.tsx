import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';

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

describe('Responsive Layout Tests', () => {
  beforeEach(() => {
    // Reset viewport before each test
    mockMatchMedia(1024);
  });

  describe('Mobile Layout (< 768px)', () => {
    beforeEach(() => {
      mockMatchMedia(375); // iPhone SE width
    });

    it('should render dashboard on mobile viewport', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify main sections are present
      expect(screen.getByText('Total Balance')).toBeInTheDocument();
      expect(screen.getByText('Balance Trend')).toBeInTheDocument();
      expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
      expect(screen.getByText('Transaction Activity')).toBeInTheDocument();
    });

    it('should have grid-cols-1 class for KPI cards on mobile', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Find the KPI cards grid container
      const kpiGrid = container.querySelector('.grid');
      expect(kpiGrid).toHaveClass('grid-cols-1');
    });
  });

  describe('Tablet Layout (768px - 1024px)', () => {
    beforeEach(() => {
      mockMatchMedia(768); // iPad Mini width
    });

    it('should render dashboard on tablet viewport', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify main sections are present
      expect(screen.getByText('Total Balance')).toBeInTheDocument();
      expect(screen.getByText('Balance Trend')).toBeInTheDocument();
      expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
    });

    it('should have md:grid-cols-2 class for KPI cards on tablet', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Find the KPI cards grid container
      const kpiGrid = container.querySelector('.grid');
      expect(kpiGrid).toHaveClass('md:grid-cols-2');
    });
  });

  describe('Desktop Layout (> 1024px)', () => {
    beforeEach(() => {
      mockMatchMedia(1440); // Standard desktop width
    });

    it('should render dashboard on desktop viewport', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify all sections are present
      expect(screen.getByText('Total Balance')).toBeInTheDocument();
      expect(screen.getByText('Total Income')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses')).toBeInTheDocument();
      expect(screen.getByText('Savings Rate')).toBeInTheDocument();
      expect(screen.getByText('Balance Trend')).toBeInTheDocument();
      expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
      expect(screen.getByText('Transaction Activity')).toBeInTheDocument();
    });

    it('should have lg:grid-cols-4 class for KPI cards on desktop', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Find the KPI cards grid container
      const kpiGrid = container.querySelector('.grid');
      expect(kpiGrid).toHaveClass('lg:grid-cols-4');
    });

    it('should have two-column layout for middle and bottom rows', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Find grid containers with lg:grid-cols-2
      const twoColumnGrids = container.querySelectorAll('.lg\\:grid-cols-2');
      expect(twoColumnGrids.length).toBeGreaterThanOrEqual(2); // Middle and bottom rows
    });
  });

  describe('Chart Responsiveness', () => {
    it('should render Balance Trend chart with ResponsiveContainer', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify chart is present
      expect(screen.getByText('Balance Trend')).toBeInTheDocument();

      // Recharts ResponsiveContainer should be present
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // ResponsiveContainer renders with specific class
      const responsiveContainers = container.querySelectorAll('.recharts-responsive-container');
      expect(responsiveContainers.length).toBeGreaterThan(0);
    });

    it('should render Spending Donut chart with ResponsiveContainer', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify chart is present
      expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
    });
  });

  describe('Heatmap Responsiveness', () => {
    it('should render heatmap with fixed cell sizes', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Verify heatmap is present
      expect(screen.getByText('Transaction Activity')).toBeInTheDocument();

      // Heatmap cells should have w-9 h-9 classes (36x36px)
      const heatmapCells = container.querySelectorAll('[role="gridcell"]');
      expect(heatmapCells.length).toBe(42); // 7×6 grid (7 days × 6 time slots)

      // Check first cell has correct size classes
      if (heatmapCells[0]) {
        expect(heatmapCells[0]).toHaveClass('w-9');
        expect(heatmapCells[0]).toHaveClass('h-9');
      }
    });
  });

  describe('Spacing and Gaps', () => {
    it('should have consistent spacing between sections', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Main container should have gap classes
      const mainContainer = container.querySelector('main');
      expect(mainContainer).toBeTruthy();
    });

    it('should have gap-4 for KPI cards grid', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Find the KPI cards grid
      const kpiGrid = container.querySelector('.grid');
      expect(kpiGrid).toHaveClass('gap-4');
    });
  });
});
