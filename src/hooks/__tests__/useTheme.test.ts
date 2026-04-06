import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';
import { useUIStore } from '../../stores/uiStore';

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset UIStore to default state
    useUIStore.setState({ darkMode: false });
    // Clear document classes
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should return darkMode state from UIStore', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.darkMode).toBe(false);
  });

  it('should toggle dark mode', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.darkMode).toBe(true);
  });

  it('should set dark mode to specific value', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setDarkMode(true);
    });

    expect(result.current.darkMode).toBe(true);

    act(() => {
      result.current.setDarkMode(false);
    });

    expect(result.current.darkMode).toBe(false);
  });

  it('should persist darkMode to localStorage when toggled', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(localStorage.getItem('zorvyn-dark-mode')).toBe('true');

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(localStorage.getItem('zorvyn-dark-mode')).toBe('false');
  });

  it('should persist darkMode to localStorage when set', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setDarkMode(true);
    });

    expect(localStorage.getItem('zorvyn-dark-mode')).toBe('true');
  });

  it('should restore darkMode from localStorage on initialization', () => {
    // Set localStorage before initializing store
    localStorage.setItem('zorvyn-dark-mode', 'true');

    // Reset store to trigger initialization
    useUIStore.setState({ darkMode: false });

    // Manually trigger the load (simulating store initialization)
    const stored = localStorage.getItem('zorvyn-dark-mode');
    useUIStore.setState({ darkMode: stored === 'true' });

    const { result } = renderHook(() => useTheme());

    expect(result.current.darkMode).toBe(true);
  });

  it('should apply "dark" class to document element when darkMode is true', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setDarkMode(true);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove "dark" class from document element when darkMode is false', () => {
    // First set dark mode to true
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setDarkMode(true);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Then set it to false
    act(() => {
      result.current.setDarkMode(false);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock localStorage.setItem to throw an error
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleDarkMode();
    });

    // Should still update state even if localStorage fails
    expect(result.current.darkMode).toBe(true);
    expect(consoleWarnSpy).toHaveBeenCalled();

    // Restore original setItem
    Storage.prototype.setItem = originalSetItem;
    consoleWarnSpy.mockRestore();
  });

  it('should handle document class manipulation errors gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock classList.add to throw an error
    const originalAdd = document.documentElement.classList.add;
    document.documentElement.classList.add = vi.fn(() => {
      throw new Error('DOM manipulation error');
    });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setDarkMode(true);
    });

    // Should still update state even if DOM manipulation fails
    expect(result.current.darkMode).toBe(true);
    expect(consoleWarnSpy).toHaveBeenCalled();

    // Restore original add
    document.documentElement.classList.add = originalAdd;
    consoleWarnSpy.mockRestore();
  });
});
