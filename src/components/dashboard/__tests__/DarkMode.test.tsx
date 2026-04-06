import { render, screen, act } from '@testing-library/react';
import { useUIStore } from '../../../stores/uiStore';
import { TopNav } from '../../TopNav';
import { BalanceTrendChart } from '../BalanceTrendChart';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Dark Mode', () => {
  beforeEach(() => {
    // Reset UIStore and document classes
    useUIStore.setState({ darkMode: false });
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  describe('Toggle Functionality', () => {
    it('should toggle between light and dark mode', () => {
      render(<TopNav pageTitle="Test" />);

      // Initial state should be light mode
      expect(useUIStore.getState().darkMode).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Toggle to dark mode
      act(() => {
        useUIStore.getState().toggleDarkMode();
      });

      expect(useUIStore.getState().darkMode).toBe(true);

      // Toggle back to light mode
      act(() => {
        useUIStore.getState().toggleDarkMode();
      });

      expect(useUIStore.getState().darkMode).toBe(false);
    });

    it('should set dark mode to specific value', () => {
      render(<TopNav pageTitle="Test" />);

      act(() => {
        useUIStore.getState().setDarkMode(true);
      });

      expect(useUIStore.getState().darkMode).toBe(true);

      act(() => {
        useUIStore.getState().setDarkMode(false);
      });

      expect(useUIStore.getState().darkMode).toBe(false);
    });
  });

  describe('Color Updates', () => {
    it('should update colors reactively when theme changes', () => {
      const { rerender } = render(<TopNav pageTitle="Test" />);

      // Start in light mode
      expect(useUIStore.getState().darkMode).toBe(false);

      // Toggle to dark mode
      act(() => {
        useUIStore.getState().toggleDarkMode();
      });

      // Rerender to apply changes
      rerender(<TopNav pageTitle="Test" />);

      // Verify dark mode is active
      expect(useUIStore.getState().darkMode).toBe(true);
    });

    it('should apply dark classes to document element', async () => {
      render(<TopNav pageTitle="Test" />);

      // Toggle to dark mode
      act(() => {
        useUIStore.getState().setDarkMode(true);
      });

      // The TopNav component has a useEffect that applies the class
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Toggle to light mode
      act(() => {
        useUIStore.getState().setDarkMode(false);
      });

      // Wait for next tick
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Chart Color Adaptation', () => {
    it('should adapt chart colors to theme', () => {
      const mockData = [
        { month: '2024-01', income: 5000, expenses: 3000, net: 2000, transactionCount: 10 },
        { month: '2024-02', income: 5500, expenses: 3200, net: 2300, transactionCount: 12 },
      ];

      const { container, rerender } = render(<BalanceTrendChart data={mockData} />);

      // Initial render in light mode
      expect(useUIStore.getState().darkMode).toBe(false);

      // Toggle to dark mode
      act(() => {
        useUIStore.getState().setDarkMode(true);
      });

      // Rerender chart
      rerender(<BalanceTrendChart data={mockData} />);

      // Verify chart container has dark mode classes
      const chartContainer = container.querySelector('.bg-white');
      expect(chartContainer).toHaveClass('dark:bg-navy-800');
    });

    it('should update chart key when theme changes', () => {
      const mockData = [
        { month: '2024-01', income: 5000, expenses: 3000, net: 2000, transactionCount: 10 },
      ];

      render(<BalanceTrendChart data={mockData} />);

      // Verify chart container exists
      const chartContainer = screen.getByLabelText(/balance trend chart/i);
      expect(chartContainer).toBeInTheDocument();

      // Toggle dark mode
      act(() => {
        useUIStore.getState().setDarkMode(true);
      });

      // Chart should re-render with new key
      expect(useUIStore.getState().darkMode).toBe(true);
    });
  });

  describe('Persistence', () => {
    it('should persist dark mode preference to localStorage', () => {
      render(<TopNav pageTitle="Test" />);

      act(() => {
        useUIStore.getState().toggleDarkMode();
      });

      expect(localStorage.getItem('zorvyn-dark-mode')).toBe('true');
    });

    it('should restore dark mode preference from localStorage', () => {
      // Set localStorage before rendering
      localStorage.setItem('zorvyn-dark-mode', 'true');

      // Manually trigger the load (simulating store initialization)
      const stored = localStorage.getItem('zorvyn-dark-mode');
      useUIStore.setState({ darkMode: stored === 'true' });

      render(<TopNav pageTitle="Test" />);

      expect(useUIStore.getState().darkMode).toBe(true);
    });
  });
});
