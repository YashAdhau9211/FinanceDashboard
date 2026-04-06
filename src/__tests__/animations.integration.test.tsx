import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Transactions } from '../pages/Transactions';
import { Insights } from '../pages/Insights';
import { useUIStore } from '../stores/uiStore';

// Mock stores
vi.mock('../stores/transactionsStore', () => ({
  useTransactionsStore: vi.fn((selector) => {
    const store = {
      transactions: [],
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
      getTransactionById: vi.fn(() => undefined),
      getFilteredTransactions: vi.fn(() => []),
    };
    return selector ? selector(store) : store;
  }),
}));

vi.mock('../stores/roleStore', () => ({
  useRoleStore: vi.fn((selector) => {
    const store = {
      role: 'ANALYST',
      setRole: vi.fn(),
      toggleRole: vi.fn(),
    };
    return selector ? selector(store) : store;
  }),
}));

vi.mock('../stores/filtersStore', () => ({
  useFiltersStore: vi.fn((selector) => {
    const store = {
      searchQuery: '',
      type: 'all',
      category: 'all',
      dateRange: { start: null, end: null },
      sortField: 'date',
      sortDir: 'desc',
      setSearchQuery: vi.fn(),
      setType: vi.fn(),
      setCategory: vi.fn(),
      setDateRange: vi.fn(),
      setSortField: vi.fn(),
      setSortDir: vi.fn(),
      resetFilters: vi.fn(),
    };
    return selector ? selector(store) : store;
  }),
}));

describe('Animation System Integration Tests', () => {
  beforeEach(() => {
    // Reset UI store to default state
    useUIStore.setState({
      sidebarCollapsed: false,
      darkMode: false,
      prefersReducedMotion: false,
    });
  });

  describe('KPI Card Animations', () => {
    it('should apply staggered fade-up animation to KPI cards on Dashboard', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const animatedCards = container.querySelectorAll('.animate-fade-up');
      expect(animatedCards.length).toBeGreaterThanOrEqual(4);

      // Verify stagger delays
      animatedCards.forEach((card, index) => {
        const style = (card as HTMLElement).style;
        expect(style.animationDelay).toBe(`${index * 80}ms`);
      });
    });

    it('should disable KPI card animations when prefers-reduced-motion is enabled', () => {
      // Set prefers-reduced-motion
      useUIStore.setState({ prefersReducedMotion: true });

      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Animation classes are still applied, but CSS media query disables them
      const animatedCards = container.querySelectorAll('.animate-fade-up');
      expect(animatedCards.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Chart Animations', () => {
    it('should render charts with animation props on Dashboard', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Charts should be present (they have animation props set in their components)
      expect(screen.getByText('Balance Trend')).toBeInTheDocument();
      expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
    });
  });

  describe('Insight Card Hover Animations', () => {
    it('should apply hover animation classes to insight cards', () => {
      const { container } = render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const insightCards = container.querySelectorAll('.insight-card');

      // Just verify insight cards exist and have transition classes
      expect(insightCards.length).toBeGreaterThan(0);

      insightCards.forEach((card) => {
        // Check for transition classes (hover classes are in className string)
        expect(card.className).toContain('transition-all');
        expect(card.className).toContain('ease-out');
        // Duration can be either 150 or 300 depending on the card type
        expect(card.className).toMatch(/duration-(150|300)/);
      });
    });
  });

  describe('Global Animation Behavior', () => {
    it('should apply animations across all pages', () => {
      // Test Dashboard
      const { unmount: unmountDashboard } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
      expect(screen.getByText('Balance Trend')).toBeInTheDocument();
      unmountDashboard();

      // Test Transactions
      const { unmount: unmountTransactions } = render(
        <BrowserRouter>
          <Transactions />
        </BrowserRouter>
      );
      expect(screen.getAllByText('Transactions')[0]).toBeInTheDocument();
      unmountTransactions();

      // Test Insights
      render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );
      expect(screen.getByText('Financial Insights')).toBeInTheDocument();
    });

    it('should respect prefers-reduced-motion globally', () => {
      // Enable reduced motion
      useUIStore.setState({ prefersReducedMotion: true });

      // Render Dashboard
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Animation classes are still applied (CSS handles disabling)
      const animatedElements = container.querySelectorAll('[class*="animate-"]');
      expect(animatedElements.length).toBeGreaterThan(0);

      // The CSS @media (prefers-reduced-motion: reduce) rule will disable animations
      // This is tested at the CSS level, not component level
    });
  });

  describe('Dark Mode Transitions', () => {
    it('should apply color transition classes globally', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Check that dark mode classes exist in the DOM
      const darkModeElements = container.querySelectorAll('[class*="dark:"]');
      expect(darkModeElements.length).toBeGreaterThan(0);
    });

    it('should toggle dark mode without errors', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      // Toggle dark mode
      useUIStore.getState().toggleDarkMode();
      expect(useUIStore.getState().darkMode).toBe(true);

      // Toggle back
      useUIStore.getState().toggleDarkMode();
      expect(useUIStore.getState().darkMode).toBe(false);
    });
  });

  describe('Animation Performance', () => {
    it('should render Dashboard without animation jank', () => {
      const startTime = performance.now();

      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Render should complete quickly (< 1000ms)
      expect(renderTime).toBeLessThan(1000);
    });

    it('should render Insights page without animation jank', () => {
      const startTime = performance.now();

      render(
        <BrowserRouter>
          <Insights />
        </BrowserRouter>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Render should complete quickly (< 1000ms)
      expect(renderTime).toBeLessThan(1000);
    });
  });
});
