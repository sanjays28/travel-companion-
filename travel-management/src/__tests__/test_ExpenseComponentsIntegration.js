import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseTracker from '../components/expense/ExpenseTracker';
import ExpenseVisualizations from '../components/expense/ExpenseVisualizations';
import * as storageService from '../services/storage';
import * as currencyConverter from '../services/currencyConverter';

// Mock modules
jest.mock('../services/storage', () => ({
  getFromLocalStorage: jest.fn(),
  saveToLocalStorage: jest.fn()
}));

jest.mock('../services/currencyConverter', () => ({
  convertToTHB: jest.fn(),
  getSupportedCurrencies: jest.fn(),
  convertFromTHB: jest.fn()
}));

// Mock chart.js components with consistent data-testid attributes
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)} />
  ),
  Pie: ({ data, options }) => (
    <div data-testid="pie-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)} />
  ),
  Line: ({ data, options }) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)} />
  )
}));

// Mock window.alert with Jest spy
const mockAlert = jest.fn();

describe('Expense Components Integration', () => {
  const mockExpenses = [
    {
      id: 1,
      amount: 1000,
      category: 'Food',
      description: 'Dinner',
      date: '2024-01-01',
      currency: 'THB',
      originalAmount: 1000,
      convertedAmount: 1000
    },
    {
      id: 2,
      amount: 50,
      category: 'Transportation',
      description: 'Taxi',
      date: '2024-01-01',
      currency: 'USD',
      originalAmount: 50,
      convertedAmount: 1756 // 50 USD * 35.12 THB
    }
  ];

  beforeAll(() => {
    global.window = { ...window, alert: mockAlert };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Initialize mock storage with test data
    const mockStorage = new Map();
    mockStorage.set('expenses', mockExpenses);
    
    // Standardize storage service mocks
    storageService.getFromLocalStorage.mockImplementation(key => mockStorage.get(key));
    storageService.saveToLocalStorage.mockImplementation((key, value) => {
      mockStorage.set(key, value);
    });
    
    // Configure currency converter with precise values
    currencyConverter.getSupportedCurrencies.mockReturnValue(['THB', 'USD', 'EUR', 'GBP']);
    currencyConverter.convertToTHB.mockImplementation((amount, currency) => {
      const rates = {
        THB: 1,
        USD: 35.12,
        EUR: 38.15,
        GBP: 44.50
      };
      
      if (!(currency in rates)) {
        throw new Error(`Unsupported currency: ${currency}`);
      }
      
      return Number((amount * rates[currency]).toFixed(2));
    });
  });

  afterAll(() => {
    delete global.window.alert;
  });

  afterEach(() => {
    mockAlert.mockClear();
  });

  describe('Data Flow Between Components', () => {
    test('expense data flows correctly from ExpenseTracker to ExpenseVisualizations', async () => {
      const initialSummary = {
        byCategory: { Food: 1000, Transportation: 1756 },
        byDate: { '2024-01-01': 2756 },
        byCurrency: { THB: 1000, USD: 1756 }
      };

      render(
        <div>
          <ExpenseTracker />
          <ExpenseVisualizations expenseSummary={initialSummary} />
        </div>
      );

      // Verify initial expense data
      const pieChart = screen.getByTestId('pie-chart');
      const pieData = JSON.parse(pieChart.dataset.chartData);
      expect(pieData.labels).toEqual(['Food', 'Transportation']);
      pieData.datasets[0].data.forEach((value, index) => {
        const expected = [1000, 1756][index];
        expect(value).toBeCloseTo(expected, 2);
      });

      // Add a new expense in USD
      await act(async () => {
        fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } });
        fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
        fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: 'Lunch' } });
        fireEvent.change(screen.getByTestId('expense-currency-select'), { target: { value: 'USD' } });
        fireEvent.click(screen.getByTestId('add-expense-button'));
      });

      // Verify storage was updated
      expect(storageService.saveToLocalStorage).toHaveBeenCalledWith('expenses', expect.any(Array));

      // Verify charts update
      const updatedPieChart = screen.getByTestId('pie-chart');
      const updatedPieData = JSON.parse(updatedPieChart.dataset.chartData);
      updatedPieData.datasets[0].data.forEach((value, index) => {
        const expected = [1000, 1756, 3512.00][index];
        expect(value).toBeCloseTo(expected, 2);
      });
    });

    test('handles decimal precision correctly in currency conversions', async () => {
      render(
        <div>
          <ExpenseTracker />
          <ExpenseVisualizations
            expenseSummary={{
              byCategory: { Food: 1000 },
              byDate: { '2024-01-01': 1000 },
              byCurrency: { THB: 1000 }
            }}
          />
        </div>
      );

      // Add expense with decimal amount
      await act(async () => {
        fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '45.99' } });
        fireEvent.change(screen.getByTestId('expense-currency-select'), { target: { value: 'USD' } });
        fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
        fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: 'Lunch' } });
        fireEvent.click(screen.getByTestId('add-expense-button'));
      });

      // Verify converted amount is handled with proper precision
      const barChart = screen.getByTestId('bar-chart');
      const barData = JSON.parse(barChart.dataset.chartData);
      const convertedAmount = barData.datasets[0].data.find(amount => Math.abs(amount - 1615.17) < 0.01);
      expect(convertedAmount).toBeDefined();
      expect(convertedAmount).toBeCloseTo(1615.17, 2);
    });
  });

  describe('Currency Conversion Integration', () => {
    test('currency conversion is applied correctly across components', async () => {
      render(
        <div>
          <ExpenseTracker />
          <ExpenseVisualizations
            expenseSummary={{
              byCategory: { Food: 1000, Transportation: 1756 },
              byDate: { '2024-01-01': 2756 },
              byCurrency: { THB: 1000, USD: 1756 }
            }}
          />
        </div>
      );

      // Test multiple currency conversions
      const testCases = [
        { amount: '100', currency: 'USD', expected: 3512.00 },
        { amount: '50.50', currency: 'EUR', expected: 1926.58 },
        { amount: '75.25', currency: 'GBP', expected: 3348.63 }
      ];

      for (const testCase of testCases) {
        await act(async () => {
          fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: testCase.amount } });
          fireEvent.change(screen.getByTestId('expense-currency-select'), { target: { value: testCase.currency } });
          fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
          fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: `Test ${testCase.currency}` } });
          fireEvent.click(screen.getByTestId('add-expense-button'));
        });

        // Verify conversion was called with correct parameters
        expect(currencyConverter.convertToTHB).toHaveBeenCalledWith(Number(testCase.amount), testCase.currency);

        // Verify converted amount in charts
        const barChart = screen.getByTestId('bar-chart');
        const barData = JSON.parse(barChart.dataset.chartData);
        const convertedAmount = barData.datasets[0].data.find(amount => Math.abs(amount - testCase.expected) < 0.01);
        expect(convertedAmount).toBeDefined();
        expect(convertedAmount).toBeCloseTo(testCase.expected, 2);
      }
    });

    test('handles currency conversion errors gracefully', async () => {
      // Test different error scenarios
      const errorScenarios = [
        {
          currency: 'EUR',
          error: 'Currency conversion failed',
          setup: () => {
            currencyConverter.convertToTHB.mockImplementation(() => {
              throw new Error('Currency conversion failed');
            });
          }
        },
        {
          currency: 'XYZ',
          error: 'Unsupported currency: XYZ',
          setup: () => {
            currencyConverter.convertToTHB.mockImplementation((amount, currency) => {
              throw new Error(`Unsupported currency: ${currency}`);
            });
          }
        }
      ];

      for (const scenario of errorScenarios) {
        scenario.setup();

        render(
          <div>
            <ExpenseTracker />
            <ExpenseVisualizations
              expenseSummary={{
                byCategory: { Food: 1000 },
                byDate: { '2024-01-01': 1000 },
                byCurrency: { THB: 1000 }
              }}
            />
          </div>
        );

        // Attempt to add expense with failing conversion
        await act(async () => {
          fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } });
          fireEvent.change(screen.getByTestId('expense-currency-select'), { target: { value: scenario.currency } });
          fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
          fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: 'Test' } });
          fireEvent.click(screen.getByTestId('add-expense-button'));
        });

        // Verify error handling
        expect(mockAlert).toHaveBeenCalledWith(scenario.error);
        expect(storageService.saveToLocalStorage).not.toHaveBeenCalled();

        // Verify charts maintain previous state
        const pieChart = screen.getByTestId('pie-chart');
        const pieData = JSON.parse(pieChart.dataset.chartData);
        expect(pieData.datasets[0].data).toEqual([1000]);

        // Clear mocks for next scenario
        jest.clearAllMocks();
      }
    });
  });

  describe('Chart Updates on Expense Changes', () => {
    test('charts update correctly when expenses are deleted', async () => {
      const initialSummary = {
        byCategory: { Food: 1000, Transportation: 1756 },
        byDate: { '2024-01-01': 2756 },
        byCurrency: { THB: 1000, USD: 1756 }
      };

      render(
        <div>
          <ExpenseTracker />
          <ExpenseVisualizations expenseSummary={initialSummary} />
        </div>
      );

      // Get initial chart data
      const initialPieChart = screen.getByTestId('pie-chart');
      const initialPieData = JSON.parse(initialPieChart.dataset.chartData);
      expect(initialPieData.datasets[0].data.length).toBe(2);
      initialPieData.datasets[0].data.forEach((value, index) => {
        const expected = [1000, 1756][index];
        expect(value).toBeCloseTo(expected, 2);
      });

      // Delete an expense
      await act(async () => {
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[0]);
      });

      // Verify storage was updated
      expect(storageService.saveToLocalStorage).toHaveBeenCalledWith('expenses', expect.any(Array));

      // Verify charts update after deletion
      const updatedPieChart = screen.getByTestId('pie-chart');
      const updatedPieData = JSON.parse(updatedPieChart.dataset.chartData);
      expect(updatedPieData.datasets[0].data.length).toBe(1);
      expect(updatedPieData.datasets[0].data[0]).toBeCloseTo(1756, 2);
    });

    test('timeline chart updates correctly with new expenses', async () => {
      const initialSummary = {
        byCategory: { Food: 1000, Transportation: 1756 },
        byDate: { '2024-01-01': 2756 },
        byCurrency: { THB: 1000, USD: 1756 }
      };

      render(
        <div>
          <ExpenseTracker />
          <ExpenseVisualizations expenseSummary={initialSummary} />
        </div>
      );

      // Add expenses on different dates
      const newExpenses = [
        { amount: '200', date: '2024-01-02', expected: 200 },
        { amount: '150.50', date: '2024-01-03', expected: 150.50 },
        { amount: '75.25', date: '2024-01-04', expected: 75.25 }
      ];

      for (const expense of newExpenses) {
        await act(async () => {
          fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: expense.amount } });
          fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
          fireEvent.change(screen.getByTestId('expense-date-input'), { target: { value: expense.date } });
          fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: `Test ${expense.date}` } });
          fireEvent.click(screen.getByTestId('add-expense-button'));
        });

        // Verify timeline chart includes new date and amount
        const lineChart = screen.getByTestId('line-chart');
        const lineData = JSON.parse(lineChart.dataset.chartData);
        expect(lineData.labels).toContain(expense.date);
        const dateIndex = lineData.labels.indexOf(expense.date);
        expect(lineData.datasets[0].data[dateIndex]).toBeCloseTo(expense.expected, 2);
      }

      // Verify cumulative amounts are calculated correctly
      const lineChart = screen.getByTestId('line-chart');
      const lineData = JSON.parse(lineChart.dataset.chartData);
      const cumulativeData = lineData.datasets[1].data;
      expect(cumulativeData[cumulativeData.length - 1]).toBeCloseTo(
        2756 + newExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
        2
      );
    });

    test('handles edge cases in chart updates', async () => {
      render(
        <div>
          <ExpenseTracker />
          <ExpenseVisualizations
            expenseSummary={{
              byCategory: {},
              byDate: {},
              byCurrency: {}
            }}
          />
        </div>
      );

      // Test with zero amount
      await act(async () => {
        fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '0' } });
        fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
        fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: 'Zero amount test' } });
        fireEvent.click(screen.getByTestId('add-expense-button'));
      });

      // Verify charts handle zero amounts correctly
      const pieChart = screen.getByTestId('pie-chart');
      const pieData = JSON.parse(pieChart.dataset.chartData);
      expect(pieData.datasets[0].data[0]).toBeCloseTo(0, 2);

      // Test with very large number
      await act(async () => {
        fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '999999.99' } });
        fireEvent.change(screen.getByTestId('expense-category-select'), { target: { value: 'Food' } });
        fireEvent.change(screen.getByTestId('expense-description-input'), { target: { value: 'Large amount test' } });
        fireEvent.click(screen.getByTestId('add-expense-button'));
      });

      // Verify charts handle large numbers correctly
      const barChart = screen.getByTestId('bar-chart');
      const barData = JSON.parse(barChart.dataset.chartData);
      expect(barData.datasets[0].data.find(amount => amount > 999999)).toBeDefined();
    });
  });
});
