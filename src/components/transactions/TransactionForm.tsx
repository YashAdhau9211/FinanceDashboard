import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Transaction, TransactionType, Category } from '../../types';
import { useCategoriesStore } from '../../stores/categoriesStore';
import { Plus, X } from 'lucide-react';

interface TransactionFormProps {
  mode: 'add' | 'edit';
  transaction?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

export interface TransactionFormData {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category | string; // Allow custom categories
}

interface FormErrors {
  date?: string;
  description?: string;
  amount?: string;
  type?: string;
  category?: string;
}

export function TransactionForm({ onSubmit, onCancel, transaction }: TransactionFormProps) {
  const getAllCategories = useCategoriesStore((state) => state.getAllCategories);
  const addCustomCategory = useCategoriesStore((state) => state.addCustomCategory);
  const allCategories = getAllCategories();
  
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  
  const [formData, setFormData] = useState<TransactionFormData>({
    date: transaction?.date || '',
    description: transaction?.description || '',
    amount: transaction?.amount || 0,
    type: transaction?.type || 'expense',
    category: transaction?.category || 'other',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form on data change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, touched]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate date
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Validate amount
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Validate type
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      date: true,
      description: true,
      amount: true,
      type: true,
      category: true,
    });

    if (validateForm()) {
      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
        setSubmissionError(
          error instanceof Error ? error.message : 'Failed to save transaction. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRetry = () => {
    setSubmissionError(null);
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
      currentTarget: {},
    } as unknown as FormEvent;
    handleSubmit(syntheticEvent);
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (trimmed && !allCategories.includes(trimmed.toLowerCase())) {
      addCustomCategory(trimmed);
      setFormData({ ...formData, category: trimmed.toLowerCase() as Category });
      setCustomCategoryInput('');
      setShowCustomCategoryInput(false);
    }
  };

  const handleCancelCustomCategory = () => {
    setCustomCategoryInput('');
    setShowCustomCategoryInput(false);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submission Error Message */}
      {submissionError && (
        <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error saving transaction</h3>
              <p className="mt-1 text-sm text-red-700">{submissionError}</p>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-sm font-medium text-red-800 hover:text-red-900 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Field */}
      <div>
        <label
          htmlFor="transaction-date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="transaction-date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          onBlur={() => handleBlur('date')}
          max={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          required
          aria-required="true"
          aria-describedby={touched.date && errors.date ? 'date-error' : undefined}
        />
        {touched.date && errors.date && (
          <p id="date-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.date}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="transaction-description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="transaction-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          onBlur={() => handleBlur('description')}
          maxLength={100}
          placeholder="Enter transaction description"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          required
          aria-required="true"
          aria-describedby={
            touched.description && errors.description ? 'description-error' : undefined
          }
        />
        {touched.description && errors.description && (
          <p id="description-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      {/* Amount Field */}
      <div>
        <label
          htmlFor="transaction-amount"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Amount (₹) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="transaction-amount"
          value={formData.amount || ''}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
          onBlur={() => handleBlur('amount')}
          min="0.01"
          step="0.01"
          placeholder="0.00"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          required
          aria-required="true"
          aria-describedby={touched.amount && errors.amount ? 'amount-error' : undefined}
        />
        {touched.amount && errors.amount && (
          <p id="amount-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.amount}
          </p>
        )}
      </div>

      {/* Type Field */}
      <div>
        <fieldset aria-describedby={touched.type && errors.type ? 'type-error' : undefined}>
          <legend className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Type <span className="text-red-500">*</span>
          </legend>
          <div className="space-y-2">
            {(['income', 'expense', 'transfer'] as TransactionType[]).map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  id={`transaction-type-${type}`}
                  name="transaction-type"
                  value={type}
                  checked={formData.type === type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as TransactionType })
                  }
                  onBlur={() => handleBlur('type')}
                  className="h-4 w-4 border-gray-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500"
                  required
                  aria-required="true"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {touched.type && errors.type && (
          <p id="type-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.type}
          </p>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label
          htmlFor="transaction-category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Category <span className="text-red-500">*</span>
        </label>
        
        {!showCustomCategoryInput ? (
          <>
            <select
              id="transaction-category"
              value={formData.category}
              onChange={(e) => {
                if (e.target.value === '__add_custom__') {
                  setShowCustomCategoryInput(true);
                } else {
                  setFormData({ ...formData, category: e.target.value as Category });
                }
              }}
              onBlur={() => handleBlur('category')}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
              aria-required="true"
              aria-describedby={touched.category && errors.category ? 'category-error' : undefined}
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
              <option value="__add_custom__" className="text-teal-600 font-medium">
                + Add Custom Category
              </option>
            </select>
          </>
        ) : (
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={customCategoryInput}
              onChange={(e) => setCustomCategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomCategory();
                } else if (e.key === 'Escape') {
                  handleCancelCustomCategory();
                }
              }}
              placeholder="Enter custom category name"
              className="flex-1 block rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddCustomCategory}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Add custom category"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCancelCustomCategory}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {touched.category && errors.category && (
          <p id="category-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.category}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={(hasErrors && Object.keys(touched).length > 0) || isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
