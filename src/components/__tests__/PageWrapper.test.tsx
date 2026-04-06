import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PageWrapper } from '../PageWrapper';
import { useUIStore } from '../../stores/uiStore';
import { useRoleStore } from '../../stores/roleStore';

describe('PageWrapper', () => {
  beforeEach(() => {
    // Reset stores before each test
    useUIStore.setState({ sidebarCollapsed: false, darkMode: false });
    useRoleStore.setState({ role: 'ANALYST' });
  });

  it('renders children content', () => {
    render(
      <BrowserRouter>
        <PageWrapper pageTitle="Test Page">
          <div>Test Content</div>
        </PageWrapper>
      </BrowserRouter>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders Sidebar component', () => {
    render(
      <BrowserRouter>
        <PageWrapper pageTitle="Test Page">
          <div>Content</div>
        </PageWrapper>
      </BrowserRouter>
    );

    // Check for Sidebar by looking for navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });

  it('renders TopNav component with correct page title', () => {
    render(
      <BrowserRouter>
        <PageWrapper pageTitle="My Custom Page">
          <div>Content</div>
        </PageWrapper>
      </BrowserRouter>
    );

    expect(screen.getByText('My Custom Page')).toBeInTheDocument();
  });

  it('applies correct layout structure', () => {
    render(
      <BrowserRouter>
        <PageWrapper pageTitle="Test Page">
          <div>Content</div>
        </PageWrapper>
      </BrowserRouter>
    );

    // Check for flex container with h-screen by finding the main element
    const main = screen.getByRole('main');
    expect(main.parentElement).toHaveClass('flex', 'h-screen');
  });

  it('applies correct main content area styling', () => {
    render(
      <BrowserRouter>
        <PageWrapper pageTitle="Test Page">
          <div>Content</div>
        </PageWrapper>
      </BrowserRouter>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1', 'lg:ml-64');
  });

  it('applies padding to content area', () => {
    render(
      <BrowserRouter>
        <PageWrapper pageTitle="Test Page">
          <div data-testid="content">Content</div>
        </PageWrapper>
      </BrowserRouter>
    );

    const content = screen.getByTestId('content');
    const mainContentDiv = content.parentElement?.parentElement; // Navigate up to #main-content div
    expect(mainContentDiv).toHaveClass('p-6');
    
    // Check for max-width container
    const maxWidthContainer = content.parentElement;
    expect(maxWidthContainer).toHaveClass('max-w-screen-xl', 'mx-auto');
  });

  it('renders multiple children correctly', () => {
    render(
      <BrowserRouter>
        <PageWrapper pageTitle="Test Page">
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </PageWrapper>
      </BrowserRouter>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });

  it('passes page title to TopNav', () => {
    render(
      <BrowserRouter>
        <PageWrapper pageTitle="Dashboard">
          <div>Content</div>
        </PageWrapper>
      </BrowserRouter>
    );

    // TopNav should display the page title in an h1
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });
});
