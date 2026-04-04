import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';
import { useFiltersStore } from '../../stores/filtersStore';

describe('SearchBar', () => {
  beforeEach(() => {
    // Reset store before each test
    useFiltersStore.getState().resetFilters();
  });

  it('renders search input with label and placeholder', () => {
    render(<SearchBar />);
    
    expect(screen.getByLabelText(/search transactions/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search transactions\.\.\./i)).toBeInTheDocument();
  });

  it('displays search icon', () => {
    render(<SearchBar />);
    
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('updates local state immediately when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const input = screen.getByLabelText(/search transactions/i);
    await user.type(input, 'test');
    
    expect(input).toHaveValue('test');
  });

  it('debounces store update by 300ms', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const input = screen.getByLabelText(/search transactions/i);
    await user.type(input, 'test');
    
    // Store should not be updated immediately
    expect(useFiltersStore.getState().searchQuery).toBe('');
    
    // Wait for debounce
    await waitFor(
      () => {
        expect(useFiltersStore.getState().searchQuery).toBe('test');
      },
      { timeout: 400 }
    );
  });

  it('shows clear button when query is not empty', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const input = screen.getByLabelText(/search transactions/i);
    
    // Clear button should not be visible initially
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
    
    // Type something
    await user.type(input, 'test');
    
    // Clear button should now be visible
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const input = screen.getByLabelText(/search transactions/i);
    await user.type(input, 'test');
    
    const clearButton = screen.getByLabelText(/clear search/i);
    await user.click(clearButton);
    
    expect(input).toHaveValue('');
  });

  it('updates store when input is cleared', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const input = screen.getByLabelText(/search transactions/i);
    await user.type(input, 'test');
    
    // Wait for debounce
    await waitFor(
      () => {
        expect(useFiltersStore.getState().searchQuery).toBe('test');
      },
      { timeout: 400 }
    );
    
    const clearButton = screen.getByLabelText(/clear search/i);
    await user.click(clearButton);
    
    // Wait for debounce after clearing
    await waitFor(
      () => {
        expect(useFiltersStore.getState().searchQuery).toBe('');
      },
      { timeout: 400 }
    );
  });

  it('has proper label association with input', () => {
    render(<SearchBar />);
    
    const label = screen.getByText(/search transactions/i);
    const input = screen.getByLabelText(/search transactions/i);
    
    expect(label).toHaveAttribute('for', 'search-transactions');
    expect(input).toHaveAttribute('id', 'search-transactions');
  });
});
