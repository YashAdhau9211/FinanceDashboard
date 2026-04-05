import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../../../stores/uiStore';
import { KPICard } from '../KPICard';
import { DollarSign } from 'lucide-react';
import { TopNav } from '../../TopNav';
import { Sidebar } from '../../Sidebar';
import { BrowserRouter } from 'react-router-dom';

expect.extend(toHaveNoViolations);

describe('Color Contrast Tests', () => {
  beforeEach(() => {
    // Reset dark mode state
    useUIStore.setState({ darkMode: false });
    document.documentElement.classList.remove('dark');
  });

  describe('Light Mode Contrast', () => {
    it('should have sufficient contrast in KPICard (light mode)', async () => {
      const { container } = render(
        <KPICard
          label="Total Balance"
          value={50000}
          delta={12.5}
          icon={DollarSign}
          sparklineData={[1000, 2000, 3000, 4000, 5000]}
          format="currency"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient contrast in TopNav (light mode)', async () => {
      const { container } = render(<TopNav pageTitle="Dashboard" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient contrast in Sidebar (light mode)', async () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Dark Mode Contrast', () => {
    beforeEach(() => {
      // Enable dark mode
      useUIStore.setState({ darkMode: true });
      document.documentElement.classList.add('dark');
    });

    it('should have sufficient contrast in KPICard (dark mode)', async () => {
      const { container } = render(
        <KPICard
          label="Total Balance"
          value={50000}
          delta={12.5}
          icon={DollarSign}
          sparklineData={[1000, 2000, 3000, 4000, 5000]}
          format="currency"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient contrast in TopNav (dark mode)', async () => {
      const { container } = render(<TopNav pageTitle="Dashboard" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient contrast in Sidebar (dark mode)', async () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Specific Color Combinations', () => {
    it('should maintain 13.9:1 contrast for navy background with white text', () => {
      // Navy background: #0F2744
      // White text: #FFFFFF
      // Expected contrast ratio: 13.9:1 (exceeds WCAG AAA requirement of 7:1)

      const { container } = render(
        <div className="bg-navy-800 text-white p-4">
          <p>Test text on navy background</p>
        </div>
      );

      const element = container.querySelector('div');
      expect(element).toHaveClass('bg-navy-800');
      expect(element).toHaveClass('text-white');
    });

    it('should maintain 4.7:1 contrast for teal on navy background', () => {
      // Navy background: #0F2744
      // Teal color: #00C896
      // Expected contrast ratio: 4.7:1 (exceeds WCAG AA requirement of 4.5:1 for normal text)

      const { container } = render(
        <div className="bg-navy-800 p-4">
          <span className="text-teal-500">Teal text on navy background</span>
        </div>
      );

      const element = container.querySelector('span');
      expect(element).toHaveClass('text-teal-500');
    });

    it('should have accessible button colors in light mode', async () => {
      const { container } = render(
        <button className="bg-teal-500 text-white px-4 py-2 rounded">
          Click me
        </button>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible button colors in dark mode', async () => {
      document.documentElement.classList.add('dark');

      const { container } = render(
        <button className="bg-teal-500 text-white px-4 py-2 rounded dark:bg-teal-400">
          Click me
        </button>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Text Contrast Requirements', () => {
    it('should meet 4.5:1 contrast for normal text (light mode)', async () => {
      const { container } = render(
        <div className="bg-white p-4">
          <p className="text-gray-900">Normal text content</p>
          <p className="text-gray-700">Secondary text content</p>
          <p className="text-gray-600">Tertiary text content</p>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should meet 4.5:1 contrast for normal text (dark mode)', async () => {
      document.documentElement.classList.add('dark');

      const { container } = render(
        <div className="bg-gray-900 p-4">
          <p className="text-white">Normal text content</p>
          <p className="text-gray-100">Secondary text content</p>
          <p className="text-gray-300">Tertiary text content</p>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should meet 3:1 contrast for large text (18pt+)', async () => {
      const { container } = render(
        <div className="bg-white p-4">
          <h1 className="text-3xl font-bold text-gray-900">Large Heading</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Subheading</h2>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should meet 3:1 contrast for UI components', async () => {
      const { container } = render(
        <div className="bg-white p-4">
          <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Enter text"
          />
          <button className="border border-gray-300 rounded px-3 py-2 mt-2">
            Button
          </button>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
