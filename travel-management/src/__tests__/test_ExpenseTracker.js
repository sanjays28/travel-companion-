import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseTracker from '../components/expense/ExpenseTracker';
import * as storageService from '../services/storage';
import * as currencyConverter from '../services/currencyConverter';

// Mock the storage service and currency converter
jest.mock('../services/storage');
jest.mock('../services/currencyConverter');
// Mock the ExpenseVisualizations component
jest.mock('../components/expense/ExpenseVisualizations', () => {
  return function DummyExpenseVisualizations({ expenseSummary }) {
    return <div data-testid="expense-visualizations" data-summary={JSON.stringify(expenseSummary)} />;
  };
});

describe('ExpenseTracker Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock localStorage
    storageService.getFromLocalStorage.mockReturnValue([]);
    // Mock currency converter functions
    currencyConverter.convertToTHB.mockImplementation((amount, currency) => {
      if (currency === 'THB') return amount;
      if (currency === 'USD') return amount * 35.12;
      throw new Error(`Unsupported currency: ${currency}`);
    });
    currencyConverter.getSupportedCurrencies.mockReturnValue(['THB', 'USD', 'EUR', 'GBP']);
  });

  test('renders expense form with all required fields', () => {
    render(<ExpenseTracker />);
    
    expect(screen.getByTestId('expense-amount-input')).toBeInTheDocument();
    expect(screen.getByTestId('expense-category-select')).toBeInTheDocument();
    expect(screen.getByTestId('expense-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('expense-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-expense-button')).toBeInTheDocument();
    expect(screen.getByTestId('expense-currency-select')).toBeInTheDocument();
  });

  test('validates required fields before submission', () => {
    render(<ExpenseTracker />);
    
    const submitButton = screen.getByTestId('add-expense-button');
    fireEvent.click(submitButton);

    // Check if the expenses list is still empty
    expect(storageService.saveToLocalStorage).not.toHaveBeenCalled();
  });

  test('successfully adds a new expense', async () => {
    render(<ExpenseTracker />);
    
    // Fill out the form
    await act(async () => {
      fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } });
      fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
      fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: 'Lunch' } });
      fireEvent.change(screen.getByTestId('expense-date-input'), { target: { value: '2023-12-01' } });
      fireEvent.change(screen.getByTestId('expense-currency-select'), { target: { value: 'USD' } });
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByTestId('add-expense-button'));
    });

    // Verify storage was called with the new expense
    expect(storageService.saveToLocalStorage).toHaveBeenCalledWith('expenses', expect.arrayContaining([
      expect.objectContaining({
        amount: expect.closeTo(3512, 0.01), // 100 USD converted to THB
        category: 'Food',
        description: 'Lunch',
        date: '2023-12-01',
        originalAmount: 100,
        originalCurrency: 'USD'
      })
    ]));
  });

  test('handles currency conversion correctly', async () => {
    render(<ExpenseTracker />);
    
    // Add expense in USD
    await act(async () => {
      fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '50' } });
      fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
      fireEvent.change(screen.getByTestId('expense-currency-select'), { target: { value: 'USD' } });
      fireEvent.change(screen.getByTestId('expense-date-input'), { target: { value: '2023-12-01' } });
      
      fireEvent.click(screen.getByTestId('add-expense-button'));
    });

    expect(currencyConverter.convertToTHB).toHaveBeenCalledWith(50, 'USD');
    expect(storageService.saveToLocalStorage).toHaveBeenCalledWith('expenses', expect.arrayContaining([
      expect.objectContaining({
        amount: expect.closeTo(1756, 0.01), // 50 USD converted to THB
        originalAmount: 50,
        originalCurrency: 'USD'
      })
    ]));
  });

  test('handles invalid currency gracefully', async () => {
    currencyConverter.convertToTHB.mockImplementation(() => {
      throw new Error('Unsupported currency: XXX');
    });

    render(<ExpenseTracker />);
    
    // Try to add expense with invalid currency
    await act(async () => {
      fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } });
      fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
      fireEvent.change(screen.getByTestId('expense-currency-select'), { target: { value: 'XXX' } });
      
      fireEvent.click(screen.getByTestId('add-expense-button'));
    });

    expect(storageService.saveToLocalStorage).not.toHaveBeenCalled();
    expect(screen.getByText(/unsupported currency/i)).toBeInTheDocument();
  });

  test('handles currency precision correctly', async () => {
    render(<ExpenseTracker />);
    
    // Add expense with decimal amount
    await act(async () => {
      fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '10.99' } });
      fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
      fireEvent.change(screen.getByTestId('expense-currency-select'), { target: { value: 'USD' } });
      fireEvent.change(screen.getByTestId('expense-date-input'), { target: { value: '2023-12-01' } });
      
      fireEvent.click(screen.getByTestId('add-expense-button'));
    });

    expect(currencyConverter.convertToTHB).toHaveBeenCalledWith(10.99, 'USD');
    expect(storageService.saveToLocalStorage).toHaveBeenCalledWith('expenses', expect.arrayContaining([
      expect.objectContaining({
        amount: expect.any(Number),
        originalAmount: 10.99,
        originalCurrency: 'USD'
      })
    ]));

    // Verify the displayed amount is formatted correctly
    const savedExpense = storageService.saveToLocalStorage.mock.calls[0][1][0];
    expect(savedExpense.amount).toBeCloseTo(385.97, 2); // 10.99 USD * 35.12
  });

  test('filters expenses by category', async () => {
    const mockExpenses = [
      { id: 1, amount: 100, category: 'Food', date: '2023-12-01' },
      { id: 2, amount: 200, category: 'Transportation', date: '2023-12-01' }
    ];
    storageService.getFromLocalStorage.mockReturnValue(mockExpenses);

    render(<ExpenseTracker />);

    // Select Food category in filter
    await act(async () => {
      fireEvent.change(screen.getByTestId('filter-category-select'), {
        target: { value: 'Food' }
      });
    });

    // Verify only Food expense is shown
    const expenseItems = screen.getAllByRole('listitem');
    expect(expenseItems).toHaveLength(1);
    expect(expenseItems[0]).toHaveTextContent('100.00 THB');
    expect(expenseItems[0]).toHaveTextContent('Food');
  });

  test('sorts expenses by amount', async () => {
    const mockExpenses = [
      { id: 1, amount: 100, category: 'Food', date: '2023-12-01' },
      { id: 2, amount: 200, category: 'Transportation', date: '2023-12-01' }
    ];
    storageService.getFromLocalStorage.mockReturnValue(mockExpenses);

    render(<ExpenseTracker />);

    // Change sort to amount
    await act(async () => {
      fireEvent.change(screen.getByTestId('sort-by-select'), {
        target: { value: 'amount' }
      });
    });

    // Get all expense items
    const expenseItems = screen.getAllByRole('listitem');
    
    // Verify order (default is descending)
    expect(expenseItems[0]).toHaveTextContent('200.00 THB');
    expect(expenseItems[1]).toHaveTextContent('100.00 THB');
  });

  test('calculates expense summary correctly', async () => {
    const mockExpenses = [
      { id: 1, amount: 100, category: 'Food', date: '2023-12-01' },
      { id: 2, amount: 200, category: 'Food', date: '2023-12-01' },
      { id: 3, amount: 150, category: 'Transportation', date: '2023-12-01' }
    ];
    storageService.getFromLocalStorage.mockReturnValue(mockExpenses);

    render(<ExpenseTracker />);

    // Check total
    const total = screen.getByTestId('total-amount');
    expect(total).toHaveTextContent('450.00 THB');

    // Check category totals
    const categoryTotals = screen.getAllByTestId('category-total');
    const foodTotal = categoryTotals.find(el => el.textContent.includes('Food'));
    const transportationTotal = categoryTotals.find(el => el.textContent.includes('Transportation'));
    expect(foodTotal).toHaveTextContent('300.00 THB');
    expect(transportationTotal).toHaveTextContent('150.00 THB');
  });

  test('filters expenses by date range', async () => {
    const mockExpenses = [
      { id: 1, amount: 100, category: 'Food', date: '2023-12-01' },
      { id: 2, amount: 200, category: 'Food', date: '2023-12-15' },
      { id: 3, amount: 150, category: 'Transportation', date: '2023-12-30' }
    ];
    storageService.getFromLocalStorage.mockReturnValue(mockExpenses);

    render(<ExpenseTracker />);

    // Set date range
    await act(async () => {
      fireEvent.change(screen.getByTestId('filter-start-date'), {
        target: { value: '2023-12-01' }
      });
      fireEvent.change(screen.getByTestId('filter-end-date'), {
        target: { value: '2023-12-15' }
      });
    });

    // Verify only expenses within range are shown
    const expenseItems = screen.getAllByRole('listitem');
    expect(expenseItems).toHaveLength(2);
    const expenseTexts = expenseItems.map(item => item.textContent);
    expect(expenseTexts).toEqual(expect.arrayContaining(['100.00 THBFood2023-12-01', '200.00 THBFood2023-12-15']));
    expect(screen.queryByText('150.00 THB')).not.toBeInTheDocument();
  });
});
