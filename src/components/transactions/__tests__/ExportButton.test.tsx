import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Papa from 'papaparse';

import { ExportButton } from '../ExportButton';
import { useRoleStore } from '../../../stores/roleStore';
import { useToastStore } from '../../../stores/toastStore';
import type { Transaction } from '../../../types';

describe('ExportButton', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Salary',
      amount: 5000,
      type: 'income',
      category: 'salary',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      date: '2024-01-16',
      description: 'Groceries',
      amount: 150,
      type: 'expense',
      category: 'groceries',
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T10:00:00Z',
    },
  ];

  it('should render export button for ADMIN role', () => {
    useRoleStore.setState({ role: 'ADMIN' });

    render(<ExportButton transactions={mockTransactions} />);

    const button = screen.getByLabelText('Export transactions to CSV');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Export CSV');
  });

  it('should not render export button for ANALYST role', () => {
    useRoleStore.setState({ role: 'ANALYST' });

    render(<ExportButton transactions={mockTransactions} />);

    const button = screen.queryByLabelText('Export transactions to CSV');
    expect(button).not.toBeInTheDocument();
  });

  it('should have Download icon', () => {
    useRoleStore.setState({ role: 'ADMIN' });

    const { container } = render(<ExportButton transactions={mockTransactions} />);

    // Check for the Download icon (lucide-react renders as svg)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have correct aria-label', () => {
    useRoleStore.setState({ role: 'ADMIN' });

    render(<ExportButton transactions={mockTransactions} />);

    const button = screen.getByRole('button', {
      name: 'Export transactions to CSV',
    });
    expect(button).toBeInTheDocument();
  });

  describe('CSV Export Functionality', () => {
    let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      useRoleStore.setState({ role: 'ADMIN' });

      // Mock URL methods
      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    afterEach(() => {
      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
    });

    it('should generate CSV with correct columns', () => {
      // Mock anchor element click
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Verify Papa.unparse was called with correct data structure
      expect(createObjectURLSpy).toHaveBeenCalled();
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
      expect(blobArg.type).toBe('text/csv;charset=utf-8;');
      expect(mockClick).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it('should format dates as YYYY-MM-DD', async () => {
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Read the blob content
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
      const text = await blobArg.text();

      // Verify date format in CSV
      expect(text).toContain('2024-01-15');
      expect(text).toContain('2024-01-16');

      vi.restoreAllMocks();
    });

    it('should format amounts as numeric values', async () => {
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Read the blob content
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
      const text = await blobArg.text();

      // Verify amounts are numeric (no currency symbols)
      expect(text).toContain('5000');
      expect(text).toContain('150');
      expect(text).not.toContain('$');

      vi.restoreAllMocks();
    });

    it('should include correct CSV columns', async () => {
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Read the blob content
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
      const text = await blobArg.text();

      // Verify CSV headers
      expect(text).toContain('Date');
      expect(text).toContain('Description');
      expect(text).toContain('Category');
      expect(text).toContain('Type');
      expect(text).toContain('Amount');

      vi.restoreAllMocks();
    });

    it('should handle special characters in descriptions', async () => {
      const transactionsWithSpecialChars: Transaction[] = [
        {
          id: '1',
          date: '2024-01-15',
          description: 'Coffee, "The Best"',
          amount: 5.5,
          type: 'expense',
          category: 'dining',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ];

      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(<ExportButton transactions={transactionsWithSpecialChars} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Read the blob content
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
      const text = await blobArg.text();

      // PapaParse should properly escape special characters
      // The description should be quoted and internal quotes should be escaped
      expect(text).toContain('Coffee');

      vi.restoreAllMocks();
    });

    it('should trigger download with correct filename', () => {
      let capturedDownload = '';
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          Object.defineProperty(link, 'download', {
            set: (value) => { capturedDownload = value; },
            get: () => capturedDownload,
          });
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      expect(capturedDownload).toBe('zorvyn-transactions.csv');
      expect(mockClick).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it('should accept custom filename', () => {
      let capturedDownload = '';
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          Object.defineProperty(link, 'download', {
            set: (value) => { capturedDownload = value; },
            get: () => capturedDownload,
          });
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(
        <ExportButton
          transactions={mockTransactions}
          filename="custom-export.csv"
        />
      );

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      expect(capturedDownload).toBe('custom-export.csv');

      vi.restoreAllMocks();
    });

    it('should clean up object URL after download', () => {
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');

      vi.restoreAllMocks();
    });

    it('should use comma delimiter and double quotes', async () => {
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Read the blob content
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
      const text = await blobArg.text();

      // Verify comma delimiter is used
      expect(text).toContain(',');
      
      // Verify quotes are used (PapaParse adds quotes when needed)
      const lines = text.split('\n');
      expect(lines.length).toBeGreaterThan(1);

      vi.restoreAllMocks();
    });

    it('should export only provided transactions', async () => {
      const singleTransaction = [mockTransactions[0]];
      
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          const link = originalCreateElement('a');
          link.click = mockClick;
          return link;
        }
        return originalCreateElement(tagName);
      });

      render(<ExportButton transactions={singleTransaction} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Read the blob content
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
      const text = await blobArg.text();

      // Should have header + 1 data row
      const lines = text.trim().split('\n');
      expect(lines.length).toBe(2); // header + 1 row
      expect(text).toContain('Salary');
      expect(text).not.toContain('Groceries');

      vi.restoreAllMocks();
    });
  });

  it('should have proper styling classes', () => {
    useRoleStore.setState({ role: 'ADMIN' });

    render(<ExportButton transactions={mockTransactions} />);

    const button = screen.getByLabelText('Export transactions to CSV');
    expect(button).toHaveClass('flex', 'items-center', 'gap-2');
    expect(button).toHaveClass('px-4', 'py-2');
    expect(button).toHaveClass('bg-teal-500', 'text-white', 'rounded-lg');
    expect(button).toHaveClass('hover:bg-teal-600');
  });

  describe('Error Handling', () => {
    let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      useRoleStore.setState({ role: 'ADMIN' });
      useToastStore.getState().clearToasts(); // Clear toasts before each test
      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
      consoleErrorSpy.mockRestore();
      vi.restoreAllMocks();
    });

    it('should handle PapaParse errors with toast message', () => {
      // Mock Papa.unparse to throw an error
      const papaUnparseSpy = vi.spyOn(Papa, 'unparse').mockImplementation(() => {
        throw new Error('PapaParse error');
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Verify error was logged to console
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'CSV export failed:',
        expect.any(Error)
      );

      // Verify toast was shown
      const toasts = useToastStore.getState().toasts;
      expect(toasts.length).toBeGreaterThanOrEqual(1);
      const errorToast = toasts.find(t => t.type === 'error');
      expect(errorToast).toBeDefined();
      expect(errorToast?.message).toBe('Failed to export CSV. Please try again.');

      papaUnparseSpy.mockRestore();
    });

    it('should handle Blob creation errors with toast message', () => {
      // Mock Blob constructor to throw an error
      const OriginalBlob = global.Blob;
      global.Blob = class extends OriginalBlob {
        constructor(...args: any[]) {
          super(...args);
          throw new Error('Blob creation failed');
        }
      } as any;

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Verify error was logged to console
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'CSV export failed:',
        expect.any(Error)
      );

      // Verify toast was shown
      const toasts = useToastStore.getState().toasts;
      expect(toasts.length).toBeGreaterThanOrEqual(1);
      const errorToast = toasts.find(t => t.type === 'error');
      expect(errorToast).toBeDefined();
      expect(errorToast?.message).toBe('Failed to export CSV. Please try again.');

      // Restore original Blob
      global.Blob = OriginalBlob;
    });

    it('should handle URL.createObjectURL errors with toast message', () => {
      // Mock URL.createObjectURL to throw an error
      createObjectURLSpy.mockImplementation(() => {
        throw new Error('createObjectURL failed');
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Verify error was logged to console
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'CSV export failed:',
        expect.any(Error)
      );

      // Verify toast was shown
      const toasts = useToastStore.getState().toasts;
      expect(toasts.length).toBeGreaterThanOrEqual(1);
      const errorToast = toasts.find(t => t.type === 'error');
      expect(errorToast).toBeDefined();
      expect(errorToast?.message).toBe('Failed to export CSV. Please try again.');
    });

    it('should log error details to console for debugging', () => {
      const testError = new Error('Test error for debugging');
      
      // Mock Papa.unparse to throw a specific error
      const papaUnparseSpy = vi.spyOn(Papa, 'unparse').mockImplementation(() => {
        throw testError;
      });

      render(<ExportButton transactions={mockTransactions} />);

      const button = screen.getByLabelText('Export transactions to CSV');
      fireEvent.click(button);

      // Verify the exact error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('CSV export failed:', testError);

      papaUnparseSpy.mockRestore();
    });
  });
});
