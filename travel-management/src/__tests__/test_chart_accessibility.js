import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseVisualizations from '../components/expense/ExpenseVisualizations';

// Mock chart.js and react-chartjs-2 to avoid canvas rendering issues
jest.mock('chart.js');

// Mock react-chartjs-2 components
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart" role="img" />,
  Pie: () => <div data-testid="pie-chart" role="img" />,
  Bar: () => <div data-testid="bar-chart" role="img" />
}));

describe('Chart Accessibility Tests', () => {
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

  test('charts have proper ARIA descriptions', () => {
    render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);

    // Check timeline chart
    const timelineRegion = screen.getByRole('region', { name: /expense timeline chart/i });
    expect(timelineRegion).toBeInTheDocument();
    const timelineChart = screen.getByTestId('line-chart');
    expect(timelineChart).toHaveAttribute('role', 'img');

    // Check pie chart
    const pieRegion = screen.getByRole('region', { name: /expense distribution pie chart/i });
    expect(pieRegion).toBeInTheDocument();
    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart).toHaveAttribute('role', 'img');

    // Check bar chart
    const barRegion = screen.getByRole('region', { name: /currency distribution chart/i });
    expect(barRegion).toBeInTheDocument();
    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toHaveAttribute('role', 'img');
  });

  test('chart containers are keyboard navigable', () => {
    render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);

    const chartRegions = screen.getAllByRole('region');
    chartRegions.forEach(region => {
      expect(region).toHaveAttribute('tabIndex', '0');
    });
  });

  test('charts have accessible titles and descriptions', () => {
    render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);

    // Timeline chart
    const timelineChart = screen.getByTestId('expense-chart');
    expect(timelineChart).toHaveAttribute('aria-label', 'Expense timeline visualization');
    expect(timelineChart).toHaveAttribute('role', 'img');
    expect(timelineChart).toHaveAttribute('aria-description', expect.stringContaining('Timeline showing daily expenses'));

    // Pie chart
    const pieChart = screen.getByTestId('expense-total');
    expect(pieChart).toHaveAttribute('aria-label', 'Expense distribution by category');
    expect(pieChart).toHaveAttribute('role', 'img');
    expect(pieChart).toHaveAttribute('aria-description', expect.stringContaining('Expense distribution by category'));

    // Bar chart
    const barChart = screen.getByTestId('currency-chart');
    expect(barChart).toHaveAttribute('aria-label', 'Expense distribution by currency');
    expect(barChart).toHaveAttribute('role', 'img');
    expect(barChart).toHaveAttribute('aria-description', expect.stringContaining('Expense distribution by currency'));

    // Verify detailed descriptions
    const timelineDesc = timelineChart.getAttribute('aria-description');
    expect(timelineDesc).toContain('2024-03-20');
    expect(timelineDesc).toContain('2024-03-21');
    expect(timelineDesc).toContain('1500');

    const pieDesc = pieChart.getAttribute('aria-description');
    expect(pieDesc).toContain('Food: 1000');
    expect(pieDesc).toContain('Transportation: 500');

    const barDesc = barChart.getAttribute('aria-description');
    expect(barDesc).toContain('THB: 1500');
  });

  test('chart tooltips are keyboard accessible', () => {
    render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);

    const timelineChart = screen.getByTestId('expense-chart');
    const pieChart = screen.getByTestId('expense-total');
    const barChart = screen.getByTestId('currency-chart');

    // Verify tooltip configuration
    [timelineChart, pieChart, barChart].forEach(chart => {
      expect(chart).toHaveAttribute('tabIndex', '0');
      expect(chart).toHaveAttribute('aria-haspopup', 'true');
      expect(chart).toHaveAttribute('role', 'img');
    });
  });

  test('chart data points are keyboard navigable', () => {
    render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);

    const timelineChart = screen.getByTestId('expense-chart');
    const pieChart = screen.getByTestId('expense-total');
    const barChart = screen.getByTestId('currency-chart');

    [timelineChart, pieChart, barChart].forEach(chart => {
      const container = chart.closest('[role="region"]');
      expect(container).toHaveAttribute('tabIndex', '0');
      expect(container).toHaveAttribute('aria-label', expect.stringMatching(/chart|visualization/i));
    });
  });

  test('chart legends are accessible', () => {
    render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);

    // Check for legend accessibility
    const legendItems = screen.getAllByRole('listitem', { hidden: true });
    expect(legendItems.length).toBeGreaterThan(0);

    legendItems.forEach(item => {
      expect(item).toHaveAttribute('aria-label');
      expect(item).toHaveAttribute('tabIndex', '0');
    });
  });

  test('chart regions have proper structure', () => {
    render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);

    const container = screen.getByRole('region', { name: /expense visualizations/i });
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('tabIndex', '0');

    // Verify chart container structure
    const chartRegions = screen.getAllByRole('region');
    expect(chartRegions).toHaveLength(4); // Main container + 3 chart regions
    
    chartRegions.forEach(region => {
      expect(region).toHaveAttribute('aria-label');
    });
  });
});
