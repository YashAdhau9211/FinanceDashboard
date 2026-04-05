import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Dashboard } from '../Dashboard';
import { BrowserRouter } from 'react-router-dom';

expect.extend(toHaveNoViolations);

describe('Dashboard Accessibility', () => {
  it('should pass axe accessibility checks', async () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 10000); // Increase timeout to 10 seconds

  it('should have no color contrast failures', async () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    const colorContrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast'
    );
    expect(colorContrastViolations).toHaveLength(0);
  }, 10000); // Increase timeout to 10 seconds

  it('should have no missing alt text failures', async () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        'image-alt': { enabled: true },
      },
    });

    const imageAltViolations = results.violations.filter((v) => v.id === 'image-alt');
    expect(imageAltViolations).toHaveLength(0);
  });

  it('should have no ARIA usage failures', async () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        'aria-valid-attr': { enabled: true },
        'aria-valid-attr-value': { enabled: true },
        'aria-allowed-attr': { enabled: true },
      },
    });

    const ariaViolations = results.violations.filter(
      (v) =>
        v.id === 'aria-valid-attr' ||
        v.id === 'aria-valid-attr-value' ||
        v.id === 'aria-allowed-attr'
    );
    expect(ariaViolations).toHaveLength(0);
  });

  it('should have proper heading hierarchy', async () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        'heading-order': { enabled: true },
      },
    });

    const headingViolations = results.violations.filter((v) => v.id === 'heading-order');
    expect(headingViolations).toHaveLength(0);
  });

  it('should have proper landmark regions', async () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        region: { enabled: true },
      },
    });

    const regionViolations = results.violations.filter((v) => v.id === 'region');
    expect(regionViolations).toHaveLength(0);
  });
});
