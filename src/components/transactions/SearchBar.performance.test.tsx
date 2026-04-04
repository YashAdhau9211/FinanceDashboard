import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { useFiltersStore } from '../../stores/filtersStore';

describe('SearchBar Performance - Debounce', () => {
  beforeEach(() => {
    // Reset the store before each test
    useFiltersStore.setState({
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
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should debounce search input by 300ms', async () => {
    vi.useFakeTimers();
    const setSearchQuery = vi.fn();
    
    useFiltersStore.setState({ setSearchQuery });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search transactions...');

    // Type text
    fireEvent.change(input, { target: { value: 'test' } });

    // setSearchQuery should not be called immediately
    expect(setSearchQuery).not.toHaveBeenCalled();

    // Fast-forward time by 299ms (just before debounce)
    vi.advanceTimersByTime(299);
    expect(setSearchQuery).not.toHaveBeenCalled();

    // Fast-forward time by 1ms more (total 300ms)
    vi.advanceTimersByTime(1);
    
    // Now setSearchQuery should be called once with the final value
    expect(setSearchQuery).toHaveBeenCalledTimes(1);
    expect(setSearchQuery).toHaveBeenCalledWith('test');
    
    vi.useRealTimers();
  });

  it('should reset debounce timer on each keystroke', async () => {
    vi.useFakeTimers();
    const setSearchQuery = vi.fn();
    
    useFiltersStore.setState({ setSearchQuery });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search transactions...');

    // Type first character
    fireEvent.change(input, { target: { value: 't' } });
    
    // Wait 200ms
    vi.advanceTimersByTime(200);
    expect(setSearchQuery).not.toHaveBeenCalled();

    // Type second character (resets timer)
    fireEvent.change(input, { target: { value: 'te' } });
    
    // Wait another 200ms (total 400ms from first character, but only 200ms from second)
    vi.advanceTimersByTime(200);
    expect(setSearchQuery).not.toHaveBeenCalled();

    // Wait final 100ms (300ms from second character)
    vi.advanceTimersByTime(100);
    
    // Now setSearchQuery should be called
    expect(setSearchQuery).toHaveBeenCalledTimes(1);
    
    vi.useRealTimers();
  });

  it('should not call setSearchQuery excessively during rapid typing', async () => {
    vi.useFakeTimers();
    const setSearchQuery = vi.fn();
    
    useFiltersStore.setState({ setSearchQuery });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search transactions...');

    // Simulate rapid typing of a long search query
    const searchText = 'grocery shopping at big bazaar';
    
    // Simulate typing each character with 50ms between each
    for (let i = 1; i <= searchText.length; i++) {
      fireEvent.change(input, { target: { value: searchText.substring(0, i) } });
      vi.advanceTimersByTime(50);
    }

    // Should not have been called yet (still within debounce window)
    expect(setSearchQuery).not.toHaveBeenCalled();

    // Wait for debounce to complete
    vi.advanceTimersByTime(300);

    // Should only be called once with the final value
    expect(setSearchQuery).toHaveBeenCalledTimes(1);
    expect(setSearchQuery).toHaveBeenCalledWith(searchText);
    
    vi.useRealTimers();
  });

  it('should cleanup debounce timer on unmount', async () => {
    vi.useFakeTimers();
    const setSearchQuery = vi.fn();
    
    useFiltersStore.setState({ setSearchQuery });

    const { unmount } = render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search transactions...');

    // Type something
    fireEvent.change(input, { target: { value: 'test' } });

    // Unmount before debounce completes
    unmount();

    // Wait for what would have been the debounce time
    vi.advanceTimersByTime(300);

    // setSearchQuery should not be called after unmount
    expect(setSearchQuery).not.toHaveBeenCalled();
    
    vi.useRealTimers();
  });
});
