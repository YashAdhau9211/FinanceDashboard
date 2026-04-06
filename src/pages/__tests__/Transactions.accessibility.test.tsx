import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Transactions } from '../Transactions';
import { BrowserRouter } from 'react-router-dom';

expect.extend(toHaveNoViolations);

describe('Transactions Page Accessibility', () => {
  it('should pass axe accessibility checks', async () => {
    const { container } = render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 10000); // Increase timeout to 10 seconds

  it('should have no color contrast failures', async () => {
    const { container } = render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    const colorContrastViolations = results.violations.filter((v) => v.id === 'color-contrast');
    expect(colorContrastViolations).toHaveLength(0);
  });

  it('should have no missing alt text failures', async () => {
    const { container } = render(
      <BrowserRouter>
        <Transactions />
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
        <Transactions />
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

  it('should have proper form labels', async () => {
    const { container } = render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        label: { enabled: true },
      },
    });

    const labelViolations = results.violations.filter((v) => v.id === 'label');
    expect(labelViolations).toHaveLength(0);
  });

  it('should have proper button names', async () => {
    const { container } = render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    const results = await axe(container, {
      rules: {
        'button-name': { enabled: true },
      },
    });

    const buttonNameViolations = results.violations.filter((v) => v.id === 'button-name');
    expect(buttonNameViolations).toHaveLength(0);
  });
});
