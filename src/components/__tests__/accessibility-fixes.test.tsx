import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BottomTabBar } from '../BottomTabBar';
import { TimeFilterToggle } from '../dashboard/TimeFilterToggle';

describe('Accessibility Fixes - Task 11.3', () => {
  describe('Color Contrast Fix - BottomTabBar', () => {
    it('should use text-teal-800 for active tabs (7.58:1 contrast ratio)', () => {
      // Mock the location to be on dashboard
      window.history.pushState({}, 'Dashboard', '/dashboard');
      
      render(
        <BrowserRouter>
          <BottomTabBar />
        </BrowserRouter>
      );

      // Find the active tab (Dashboard)
      const dashboardLink = screen.getByLabelText('Dashboard');
      
      // Check that it has the correct color class
      expect(dashboardLink.className).toContain('text-teal-800');
      expect(dashboardLink.className).not.toContain('text-teal-700');
    });

    it('should have proper aria-labels for all tabs', () => {
      render(
        <BrowserRouter>
          <BottomTabBar />
        </BrowserRouter>
      );

      expect(screen.getByLabelText('Dashboard')).toBeInTheDocument();
      expect(screen.getByLabelText('Transactions')).toBeInTheDocument();
      expect(screen.getByLabelText('Insights')).toBeInTheDocument();
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });
  });

  describe('Label Content Name Mismatch Fix - TimeFilterToggle', () => {
    it('should have aria-labels that match visible text pattern', () => {
      const mockOnChange = () => {};
      render(<TimeFilterToggle active={12} onChange={mockOnChange} />);

      // Check that aria-labels include the visible text
      const button3M = screen.getByLabelText('3 months');
      const button6M = screen.getByLabelText('6 months');
      const button12M = screen.getByLabelText('12 months');

      expect(button3M).toHaveTextContent('3M');
      expect(button6M).toHaveTextContent('6M');
      expect(button12M).toHaveTextContent('12M');
    });

    it('should have aria-pressed attribute for active button', () => {
      const mockOnChange = () => {};
      render(<TimeFilterToggle active={6} onChange={mockOnChange} />);

      const button6M = screen.getByLabelText('6 months');
      expect(button6M).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
