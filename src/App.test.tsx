import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App Routing', () => {
  it('should render without errors', () => {
    render(<App />);
    // If we get here without throwing, the app rendered successfully
    expect(document.body).toBeTruthy();
  });

  it('should redirect root path to dashboard', async () => {
    render(<App />);
    // The app should redirect to /dashboard and show the Dashboard page
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1, name: 'Dashboard' });
      expect(heading).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('should render sidebar with navigation links', async () => {
    render(<App />);
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Verify all navigation links are present
    expect(screen.getByText('Zorvyn')).toBeTruthy();
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    // Use getAllByText for elements that appear in both Sidebar and BottomTabBar
    expect(screen.getAllByText('Transactions').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Insights').length).toBeGreaterThan(0);
  });

  it('should render TopNav with role switcher', async () => {
    render(<App />);
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Verify TopNav elements are present
    expect(screen.getByText('ANALYST')).toBeTruthy();
    expect(screen.getByLabelText('Toggle dark mode')).toBeTruthy();
  });
});
