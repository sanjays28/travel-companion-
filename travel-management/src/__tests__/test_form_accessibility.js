import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ExpenseTracker from '../components/expense/ExpenseTracker';

// Mock the storage service
jest.mock('../services/storage', () => ({
  getFromLocalStorage: jest.fn(() => ({
    expenses: [
      { 
        id: 1, 
        amount: 100, 
        category: 'Food', 
        description: 'Lunch', 
        date: '2024-03-20', 
        currency: 'THB' 
      }
    ]
  })),
  saveToLocalStorage: jest.fn()
}));

describe('Form Accessibility Tests', () => {
  test('form inputs have associated labels', async () => {
    await act(async () => {
      render(<ExpenseTracker />);
    });
    
    // Check for form labels using test IDs
    expect(screen.getByTestId('expense-amount')).toBeInTheDocument();
    expect(screen.getByTestId('expense-category')).toBeInTheDocument();
    expect(screen.getByTestId('expense-description')).toBeInTheDocument();
    expect(screen.getByTestId('expense-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('expense-currency-select')).toBeInTheDocument();
  });

  test('required fields have proper ARIA attributes', async () => {
    await act(async () => {
      render(<ExpenseTracker />);
    });
    
    // Check required fields using test IDs
    const requiredFields = [
      'expense-amount',
      'expense-category',
      'expense-description',
      'expense-date-input'
    ];
    
    requiredFields.forEach(testId => {
      const input = screen.getByTestId(testId);
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  test('form validation errors are announced to screen readers', async () => {
    // Mock window.alert
    const alertMock = jest.fn();
    window.alert = alertMock;

    await act(async () => {
      render(<ExpenseTracker />);
    });
    
    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Check that alert was called with validation message
    expect(alertMock).toHaveBeenCalledWith('Please fill in all required fields');
    
    // Check that required fields are properly indicated
    const amountInput = screen.getByTestId('expense-amount');
    const categorySelect = screen.getByTestId('expense-category');
    const descriptionInput = screen.getByTestId('expense-description');
    
    expect(amountInput).toHaveAttribute('required');
    expect(amountInput).toHaveAttribute('aria-required', 'true');
    expect(amountInput).toHaveAttribute('aria-invalid', 'true');
    expect(amountInput).toHaveAttribute('aria-errormessage');
    
    expect(categorySelect).toHaveAttribute('required');
    expect(categorySelect).toHaveAttribute('aria-required', 'true');
    expect(categorySelect).toHaveAttribute('aria-invalid', 'true');
    expect(categorySelect).toHaveAttribute('aria-errormessage');
    
    expect(descriptionInput).toHaveAttribute('required');
    expect(descriptionInput).toHaveAttribute('aria-required', 'true');
    expect(descriptionInput).toHaveAttribute('aria-invalid', 'true');
    expect(descriptionInput).toHaveAttribute('aria-errormessage');

    // Test individual field validation
    await act(async () => {
      await userEvent.type(amountInput, '-100');
      amountInput.blur();
    });
    
    expect(screen.getByText('Amount must be a positive number')).toBeInTheDocument();
    expect(amountInput).toHaveAttribute('aria-invalid', 'true');
    
    await act(async () => {
      await userEvent.clear(amountInput);
      await userEvent.type(amountInput, '100');
      amountInput.blur();
    });
    
    expect(amountInput).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText('Amount must be a positive number')).not.toBeInTheDocument();
  });

  test('live validation feedback is accessible', async () => {
    await act(async () => {
      render(<ExpenseTracker />);
    });

    const amountInput = screen.getByTestId('expense-amount');
    const descriptionInput = screen.getByTestId('expense-description');

    // Test amount validation
    await act(async () => {
      await userEvent.type(amountInput, 'abc');
      amountInput.blur();
    });

    const amountError = screen.getByText('Please enter a valid number');
    expect(amountError).toHaveAttribute('role', 'alert');
    expect(amountError).toHaveAttribute('aria-live', 'assertive');
    expect(amountInput).toHaveAttribute('aria-invalid', 'true');
    expect(amountInput).toHaveAttribute('aria-errormessage', amountError.id);

    // Test description length validation
    await act(async () => {
      await userEvent.type(descriptionInput, 'a'.repeat(101));
      descriptionInput.blur();
    });

    const descriptionError = screen.getByText('Description must be 100 characters or less');
    expect(descriptionError).toHaveAttribute('role', 'alert');
    expect(descriptionError).toHaveAttribute('aria-live', 'assertive');
    expect(descriptionInput).toHaveAttribute('aria-invalid', 'true');
    expect(descriptionInput).toHaveAttribute('aria-errormessage', descriptionError.id);
  });

  test('keyboard navigation through form fields follows logical order', async () => {
    await act(async () => {
      render(<ExpenseTracker />);
    });
    
    const amountInput = screen.getByTestId('expense-amount');
    const currencySelect = screen.getByTestId('expense-currency-select');
    const categorySelect = screen.getByTestId('expense-category');
    const dateInput = screen.getByTestId('expense-date-input');
    const descriptionInput = screen.getByTestId('expense-description');
    
    // Start with first input
    amountInput.focus();
    expect(amountInput).toHaveFocus();
    
    // Tab through fields
    userEvent.tab();
    expect(currencySelect).toHaveFocus();
    
    userEvent.tab();
    expect(categorySelect).toHaveFocus();
    
    userEvent.tab();
    expect(dateInput).toHaveFocus();
    
    userEvent.tab();
    expect(descriptionInput).toHaveFocus();
  });

  test('select elements have accessible options', () => {
    render(<ExpenseTracker />);
    
    const categorySelect = screen.getByLabelText(/category/i);
    const currencySelect = screen.getByLabelText(/currency/i);
    
    // Check category select
    expect(categorySelect).toHaveAttribute('aria-required', 'true');
    expect(categorySelect.options.length).toBeGreaterThan(0);
    
    // Check currency select
    expect(currencySelect).toBeInTheDocument();
    expect(currencySelect.options.length).toBeGreaterThan(0);
  });

  test('form submission feedback is accessible', async () => {
    await act(async () => {
      render(<ExpenseTracker />);
    });
    
    // Fill out form
    const amountInput = screen.getByTestId('expense-amount');
    const categorySelect = screen.getByTestId('expense-category');
    const descriptionInput = screen.getByTestId('expense-description');
    
    await act(async () => {
      await userEvent.type(amountInput, '100');
      await userEvent.selectOptions(categorySelect, 'Food');
      await userEvent.type(descriptionInput, 'Test expense');
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Check that the expense list is updated and announced
    const expensesList = screen.getByRole('region', { name: /expenses/i });
    expect(expensesList).toBeInTheDocument();
    expect(expensesList).toHaveAttribute('aria-live', 'polite');
  });

  test('filter controls are accessible', () => {
    render(<ExpenseTracker />);
    
    const filterSelect = screen.getByLabelText(/filter by category/i);
    expect(filterSelect).toBeInTheDocument();
    expect(filterSelect).toHaveAttribute('aria-label', 'Filter expenses by category');
    
    // Test keyboard interaction
    filterSelect.focus();
    expect(filterSelect).toHaveFocus();
    
    // Check options
    const options = Array.from(filterSelect.options);
    expect(options.length).toBeGreaterThan(1); // Should have "All" plus categories
    expect(options[0].text).toBe('All Categories');
  });

  test('expense table has proper ARIA attributes', () => {
    render(<ExpenseTracker />);
    
    const table = screen.getByRole('grid', { name: /expenses list/i });
    expect(table).toBeInTheDocument();
    
    // Check table headers
    const headers = screen.getAllByRole('columnheader');
    expect(headers.length).toBeGreaterThan(0);
    
    // Check table rows
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header + data rows
    
    // Check that rows are keyboard navigable
    rows[1].focus();
    expect(rows[1]).toHaveFocus();
  });
});
