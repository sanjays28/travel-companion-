import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseVisualizations from '../components/expense/ExpenseVisualizations';
import { act } from 'react-dom/test-utils';

// Mock react-chartjs-2 components
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

describe('ExpenseVisualizations Component', () => {
  const mockExpenseSummary = {
    byCategory: {
      Food: 300,
      Transportation: 150,
      Accommodation: 500,
      Entertainment: 200
    },
    byDate: {
      '2024-01-01': 200,
      '2024-01-02': 300,
      '2024-01-03': 150,
      '2024-01-04': 500
    },
    byCurrency: {
      THB: 800,
      USD: 300,
      EUR: 250
    }
  };

  // Test Chart Rendering and Data Mapping
  describe('Chart Rendering and Data Mapping', () => {
    test('renders all three charts with correct data', () => {
      const { container } = render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();

      // Verify pie chart data mapping
      const pieChart = screen.getByTestId('pie-chart');
      const pieData = JSON.parse(pieChart.dataset.chartData);
      expect(pieData.labels).toEqual(['Food', 'Transportation', 'Accommodation', 'Entertainment']);
      expect(pieData.datasets[0].data).toEqual([300, 150, 500, 200]);
    });

    test('verifies correct data transformation for timeline chart', () => {
      render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);
      const lineChart = screen.getByTestId('line-chart');
      const lineData = JSON.parse(lineChart.dataset.chartData);
      
      // Check daily expenses
      expect(lineData.datasets[0].data).toEqual([200, 300, 150, 500]);
      
      // Check cumulative expenses
      expect(lineData.datasets[1].data).toEqual([200, 500, 650, 1150]);
    });
  });

  // Test Currency Conversion Display
  describe('Currency Conversion Display', () => {
    test('displays currency amounts with correct formatting', () => {
      render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);
      const barChart = screen.getByTestId('bar-chart');
      const options = JSON.parse(barChart.dataset.chartOptions);
      
      // Verify currency formatting in y-axis
      expect(options.scales.y.ticks.callback(1000)).toBe('1,000 THB');
      
      // Verify tooltip formatting
      const tooltipLabel = options.plugins.tooltip.callbacks.label({ raw: 1000 });
      expect(tooltipLabel).toMatch(/1000\.00 THB \(\d+\.\d%\)/);
    });
  });

  // Test Responsive Layout
  describe('Responsive Layout', () => {
    test('renders with correct responsive layout classes', () => {
      const { container } = render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);
      
      expect(container.firstChild).toHaveClass('grid');
      expect(container.firstChild).toHaveClass('grid-cols-1');
      expect(container.firstChild).toHaveClass('lg:grid-cols-3');
      expect(container.firstChild).toHaveClass('gap-6');
    });

    test('applies correct responsive classes to chart containers', () => {
      const { container } = render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);
      
      const chartContainers = container.getElementsByClassName('bg-white');
      expect(chartContainers[0]).toHaveClass('lg:col-span-2'); // Timeline chart
      expect(chartContainers[2]).toHaveClass('lg:col-span-3'); // Bar chart
    });
  });

  // Test Chart Configuration
  describe('Chart Configuration', () => {
    test('applies correct chart options', () => {
      render(<ExpenseVisualizations expenseSummary={mockExpenseSummary} />);
      
      const charts = ['bar-chart', 'pie-chart', 'line-chart'].map(id => {
        const chart = screen.getByTestId(id);
        return JSON.parse(chart.dataset.chartOptions);
      });
      
      // Verify common options
      charts.forEach(options => {
        expect(options.responsive).toBe(true);
        expect(options.maintainAspectRatio).toBe(false);
        expect(options.plugins.legend.position).toBeDefined();
        expect(options.plugins.title.display).toBe(true);
      });
    });
  });

  // Test Error Handling
  describe('Error Handling', () => {
    test('handles missing data gracefully', () => {
      const incompleteSummary = {
        byCategory: {},
        byDate: {},
        byCurrency: {}
      };
      
      expect(() => {
        render(<ExpenseVisualizations expenseSummary={incompleteSummary} />);
      }).not.toThrow();
    });

    test('handles invalid date formats in timeline data', () => {
      const summaryWithInvalidDates = {
        ...mockExpenseSummary,
        byDate: {
          'invalid-date': 100,
          '2024-01-01': 200
        }
      };
      
      expect(() => {
        render(<ExpenseVisualizations expenseSummary={summaryWithInvalidDates} />);
      }).not.toThrow();
    });
  });

  // Test Performance with Large Datasets
  describe('Performance with Large Datasets', () => {
    test('handles large datasets efficiently', () => {
      const largeSummary = {
        byCategory: {},
        byDate: {},
        byCurrency: {}
      };
      
      // Generate large dataset
      for (let i = 0; i < 100; i++) {
        largeSummary.byCategory[`Category${i}`] = Math.random() * 1000;
        largeSummary.byDate[`2024-01-${String(i).padStart(2, '0')}`] = Math.random() * 1000;
        if (i < 20) largeSummary.byCurrency[`Currency${i}`] = Math.random() * 1000;
      }
      
      const startTime = performance.now();
      act(() => {
        render(<ExpenseVisualizations expenseSummary={largeSummary} />);
      });
      const endTime = performance.now();
      
      // Verify render time is reasonable (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
