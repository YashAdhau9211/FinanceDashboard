import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Routing', () => {
  it('should render without errors', () => {
    render(<App />);
    // If we get here without throwing, the app rendered successfully
    expect(document.body).toBeTruthy();
  });

  it('should redirect root path to dashboard', () => {
    render(<App />);
    // The app should redirect to /dashboard and show the Dashboard page
    // Check for the page heading (h2) specifically
    const heading = screen.getByRole('heading', { level: 2, name: 'Dashboard' });
    expect(heading).toBeTruthy();
  });

  it('should render sidebar with navigation links', () => {
    render(<App />);
    // Verify all navigation links are present
    expect(screen.getByText('Zorvyn')).toBeTruthy();
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getByText('Transactions')).toBeTruthy();
    expect(screen.getByText('Insights')).toBeTruthy();
  });

  it('should render TopNav with role switcher', () => {
    render(<App />);
    // Verify TopNav elements are present
    expect(screen.getByText('ANALYST')).toBeTruthy();
    expect(screen.getByLabelText('Toggle dark mode')).toBeTruthy();
  });
});
