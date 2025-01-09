import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * @typedef {Object} ExpenseSummary
 * @property {Object.<string, number>} byCategory - Expenses grouped by category
 * @property {Object.<string, number>} byDate - Expenses grouped by date
 * @property {Object.<string, number>} byCurrency - Expenses grouped by currency
 */

/**
 * @typedef {Object} ExpenseVisualizationsProps
 * @property {ExpenseSummary} expenseSummary - Summary of expenses
 */

// PUBLIC_INTERFACE
// PUBLIC_INTERFACE
const ExpenseVisualizations = ({ expenseSummary }) => {
  // Category data
  const categories = Object.keys(expenseSummary.byCategory);
  const categoryAmounts = Object.values(expenseSummary.byCategory);
  const total = categoryAmounts.reduce((sum, amount) => sum + amount, 0);

  // Timeline data
  const dates = Object.keys(expenseSummary.byDate).sort();
  const timelineAmounts = dates.map(date => expenseSummary.byDate[date]);

  // Currency data
  const currencies = Object.keys(expenseSummary.byCurrency);
  const currencyAmounts = Object.values(expenseSummary.byCurrency);
  
  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
  ];

  const barChartData = {
    labels: currencies,
    datasets: [
      {
        label: 'Original Currency Amounts',
        data: currencyAmounts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1,
      },
      {
        label: 'THB Equivalent',
        data: currencies.map(currency => 
          Object.values(expenseSummary.byCurrency).reduce((sum, amount) => sum + amount, 0)
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        type: 'line'
      }
    ],
  };

  const pieChartData = {
    labels: categories,
    datasets: [
      {
        data: categoryAmounts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1,
        hoverOffset: 4,
        hoverBorderWidth: 2,
      },
    ],
  };

  const timelineChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Daily Expenses (THB)',
        data: timelineAmounts,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        label: 'Cumulative Expenses',
        data: timelineAmounts.reduce((acc, curr, i) => {
          acc.push((acc[i - 1] || 0) + curr);
          return acc;
        }, []),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
        borderDash: [5, 5],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Expense Distribution by Currency',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value.toFixed(2)} THB (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} THB`
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Expense Percentage Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toFixed(2)} THB (${percentage}%)`;
          }
        }
      }
    }
  };

  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Expense Timeline',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${value.toFixed(2)} THB`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} THB`
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  // Prepare accessible descriptions for screen readers
  const timelineDescription = `Timeline showing daily expenses from ${dates[0]} to ${dates[dates.length - 1]}. ` +
    `Total expenses: ${total.toLocaleString()} THB. ` +
    `Highest daily expense: ${Math.max(...timelineAmounts).toLocaleString()} THB.`;

  const pieDescription = `Expense distribution by category. ` +
    categories.map(cat => 
      `${cat}: ${expenseSummary.byCategory[cat].toLocaleString()} THB (${((expenseSummary.byCategory[cat] / total) * 100).toFixed(1)}%)`
    ).join('. ');

  const barDescription = `Expense distribution by currency. ` +
    currencies.map(curr => 
      `${curr}: ${expenseSummary.byCurrency[curr].toLocaleString()} THB`
    ).join('. ');

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6" 
      role="region" 
      aria-label="Expense visualizations"
      tabIndex={0}
    >
      <div className="bg-white p-4 rounded-lg shadow lg:col-span-2" role="region" aria-label="Expense timeline chart">
        <div className="h-[400px]">
          <Line 
            data={timelineChartData} 
            options={{
              ...timelineOptions,
              plugins: {
                ...timelineOptions.plugins,
                accessibility: {
                  enabled: true,
                  announceOnFocus: true,
                  description: 'Line chart showing daily and cumulative expenses over time'
                }
              }
            }} 
            data-testid="expense-chart"
            aria-label="Expense timeline visualization"
          />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow" role="region" aria-label="Expense distribution pie chart">
        <div className="h-[400px]">
          <Pie 
            data={pieChartData} 
            options={{
              ...pieOptions,
              plugins: {
                ...pieOptions.plugins,
                accessibility: {
                  enabled: true,
                  announceOnFocus: true,
                  description: 'Pie chart showing expense distribution by category'
                }
              }
            }} 
            data-testid="expense-total"
            aria-label="Expense distribution by category"
          />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow lg:col-span-3" role="region" aria-label="Currency distribution chart">
        <div className="h-[400px]">
          <Bar 
            data={barChartData} 
            options={{
              ...barOptions,
              plugins: {
                ...barOptions.plugins,
                accessibility: {
                  enabled: true,
                  announceOnFocus: true,
                  description: 'Bar chart showing expense distribution by currency'
                }
              }
            }} 
            data-testid="currency-chart"
            aria-label="Expense distribution by currency"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseVisualizations;
