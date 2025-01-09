import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ItineraryView from '../components/itinerary/ItineraryView';
import ExpenseTracker from '../components/expense/ExpenseTracker';
import ExpenseVisualizations from '../components/expense/ExpenseVisualizations';

// Mock the storage service
jest.mock('../services/storage', () => ({
  getFromLocalStorage: jest.fn(() => ({
    itinerary: [
      { id: 1, title: 'Test Event', date: '2024-03-20' }
    ],
    expenses: [
      { id: 1, amount: 100, category: 'Food', date: '2024-03-20', currency: 'THB' }
    ]
  })),
  initializeStorage: jest.fn(),
  saveToLocalStorage: jest.fn()
}));

// Mock chart.js and react-chartjs-2 to avoid canvas rendering issues
jest.mock('chart.js');
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart" role="img" aria-label="Line chart visualization" />,
  Pie: () => <div data-testid="pie-chart" role="img" aria-label="Pie chart visualization" />,
  Bar: () => <div data-testid="bar-chart" role="img" aria-label="Bar chart visualization" />
}));

describe('Accessibility Tests - ItineraryView', () => {
  test('should have proper ARIA roles and labels', () => {
    render(<ItineraryView />);
    
    // Check main region
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check tab list
    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveAttribute('aria-label', 'Itinerary view options');
    
    // Check individual tabs
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected');
  });

  test('supports keyboard navigation between views', async () => {
    await act(async () => {
      render(<ItineraryView />);
    });
    
    const timelineTab = screen.getByRole('tab', { name: /timeline/i });
    const calendarTab = screen.getByRole('tab', { name: /calendar/i });
    const listTab = screen.getByRole('tab', { name: /list/i });

    // Focus timeline tab
    await act(async () => {
      timelineTab.focus();
    });
    expect(timelineTab).toHaveFocus();

    // Navigate right
    await act(async () => {
      fireEvent.keyDown(timelineTab, { key: 'ArrowRight' });
    });
    expect(calendarTab).toHaveAttribute('aria-selected', 'true');

    // Navigate right again
    await act(async () => {
      fireEvent.keyDown(calendarTab, { key: 'ArrowRight' });
    });
    expect(listTab).toHaveAttribute('aria-selected', 'true');

    // Navigate left
    await act(async () => {
      fireEvent.keyDown(listTab, { key: 'ArrowLeft' });
    });
    expect(calendarTab).toHaveAttribute('aria-selected', 'true');
  });
});

describe('Accessibility Tests - ExpenseTracker', () => {
  test('form controls have proper labels and ARIA attributes', async () => {
    await act(async () => {
      render(<ExpenseTracker />);
    });
    
    // Check form elements
    const amountInput = screen.getByTestId('expense-amount');
    const categorySelect = screen.getByTestId('expense-category');
    const descriptionInput = screen.getByTestId('expense-description');
    const dateInput = screen.getByTestId('expense-date-input');
    
    // Check for proper labels
    expect(screen.getByLabelText(/amount/i)).toBe(amountInput);
    expect(screen.getByLabelText(/category/i)).toBe(categorySelect);
    expect(screen.getByLabelText(/description/i)).toBe(descriptionInput);
    expect(screen.getByLabelText(/date/i)).toBe(dateInput);
    
    // Check ARIA attributes
    expect(amountInput).toHaveAttribute('aria-required', 'true');
    expect(categorySelect).toHaveAttribute('aria-required', 'true');
    expect(descriptionInput).toHaveAttribute('aria-required', 'true');
    expect(dateInput).toHaveAttribute('aria-required', 'true');
    
    // Check table
    const table = screen.getByRole('grid', { name: /expenses list/i });
    expect(table).toBeInTheDocument();
  });

  test('expense list supports keyboard navigation', async () => {
    await act(async () => {
      render(<ExpenseTracker />);
    });
    
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header + data rows

    // Focus first data row
    await act(async () => {
      rows[1].focus();
    });
    expect(rows[1]).toHaveFocus();

    // Test keyboard navigation
    await act(async () => {
      fireEvent.keyDown(rows[1], { key: 'ArrowDown' });
    });
    
    // Next row should receive focus if it exists
    if (rows[2]) {
      expect(rows[2]).toHaveFocus();
    }
  });

  test('delete buttons have descriptive labels', () => {
    render(<ExpenseTracker />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete expense/i });
    deleteButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toMatch(/delete expense:.+/i);
    });
  });
});

describe('Accessibility Tests - ExpenseVisualizations', () => {
  const mockExpenseSummary = {
    byCategory: {
      'Food': 1000,
      'Transportation': 500
    },
    byDate: {
      '2024-03-20': 1000,
      '2024-03-21': 500
    },
    byCurrency: {
      'THB': 1500
    }
  };

  test('charts have proper ARIA roles and labels', () => {
    render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);
    
    // Check chart regions
    const regions = screen.getAllByRole('region');
    expect(regions).toHaveLength(3);
    
    // Check specific chart labels
    expect(screen.getByRole('region', { name: /expense timeline chart/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /expense distribution pie chart/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /currency distribution chart/i })).toBeInTheDocument();
  });

  test('visualization container is keyboard focusable', () => {
    render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);
    
    const container = screen.getByRole('region', { name: /expense visualizations/i });
    expect(container).toHaveAttribute('tabIndex', '0');
  });
});

// Focus management tests
describe('Focus Management Tests', () => {
  test('ItineraryView maintains focus when switching views', () => {
    render(<ItineraryView />);
    
    const timelineTab = screen.getByRole('tab', { name: /timeline/i });
    const calendarTab = screen.getByRole('tab', { name: /calendar/i });

    // Click timeline tab and check focus
    timelineTab.focus();
    fireEvent.click(timelineTab);
    expect(timelineTab).toHaveAttribute('aria-selected', 'true');
    expect(timelineTab).toHaveFocus();

    // Switch to calendar view and check focus
    calendarTab.focus();
    fireEvent.click(calendarTab);
    expect(calendarTab).toHaveAttribute('aria-selected', 'true');
    expect(calendarTab).toHaveFocus();
  });

  test('ExpenseTracker form maintains focus after submission', async () => {
    render(<ExpenseTracker />);
    
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', { name: /add expense/i });

    // Fill form
    await userEvent.type(amountInput, '100');
    
    // Submit form
    submitButton.focus();
    fireEvent.click(submitButton);
    
    // Focus should return to amount input after submission
    expect(amountInput).toHaveFocus();
  });
});
