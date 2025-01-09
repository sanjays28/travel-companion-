import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../../services/storage';
import { convertToTHB, getSupportedCurrencies } from '../../services/currencyConverter';

// PUBLIC_INTERFACE
const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [supportedCurrencies] = useState(getSupportedCurrencies());
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    currency: 'THB',
    originalAmount: '',
    originalCurrency: 'THB',
    convertedAmount: ''
  });
  const [filter, setFilter] = useState('all');

  const categories = ['Transportation', 'Accommodation', 'Food', 'Activities', 'Other'];

  useEffect(() => {
    const storedExpenses = getFromLocalStorage('expenses');
    if (storedExpenses) {
      setExpenses(storedExpenses);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'amount' ? { originalAmount: value } : {}),
      ...(name === 'currency' ? { originalCurrency: value } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const originalAmount = parseFloat(newExpense.amount);
      const convertedAmount = newExpense.currency === 'THB' 
        ? originalAmount 
        : convertToTHB(originalAmount, newExpense.currency);

      const expenseToAdd = {
        ...newExpense,
        id: Date.now(),
        amount: originalAmount,
        originalAmount: originalAmount,
        convertedAmount: convertedAmount
      };

      const updatedExpenses = [...expenses, expenseToAdd];
      setExpenses(updatedExpenses);
      saveToLocalStorage('expenses', updatedExpenses);

      // Reset form
      setNewExpense({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        currency: 'THB',
        originalAmount: '',
        originalCurrency: 'THB',
        convertedAmount: ''
      });
    } catch (error) {
      alert(error.message);
      return;
    }

  };

  const deleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveToLocalStorage('expenses', updatedExpenses);
  };

  const filteredExpenses = filter === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filter);

  return (
    <div className="p-4" role="main">
      <h2 className="text-2xl font-bold mb-4" id="expense-tracker-title">Expense Tracker</h2>
      
      {/* Expense Input Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4" aria-labelledby="expense-form-title">
        <h3 id="expense-form-title" className="sr-only">Add New Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              value={newExpense.amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 hover:border-indigo-400"
              id="amount"
              required
              data-testid="expense-amount"
              aria-required="true"
              aria-label="Enter expense amount"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="currency">Currency</label>
            <select
              name="currency"
              value={newExpense.currency}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 hover:border-indigo-400"
              id="currency"
              data-testid="expense-currency-select"
              aria-label="Select currency"
            >
              {supportedCurrencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="category">Category</label>
            <select
              name="category"
              value={newExpense.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 hover:border-indigo-400"
              id="category"
              required
              data-testid="expense-category"
              aria-required="true"
              aria-label="Select expense category"
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 hover:border-indigo-400"
              id="date"
              required
              data-testid="expense-date-input"
              aria-required="true"
              aria-label="Select expense date"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={newExpense.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 hover:border-indigo-400"
            id="description"
            required
            data-testid="expense-description"
            aria-required="true"
            aria-label="Enter expense description"
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:bg-indigo-800 active:transform active:scale-95"
          data-testid="add-expense-btn"
          aria-label="Add expense to tracker"
        >
          Add Expense
        </button>
      </form>

      {/* Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="filter-category">Filter by Category</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block w-full md:w-auto rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 hover:border-indigo-400"
          id="filter-category"
          data-testid="filter-category-select"
          aria-label="Filter expenses by category"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Expense List */}
      <div className="mt-6" role="region" aria-labelledby="expenses-list-title">
        <h3 className="text-lg font-medium mb-4" id="expenses-list-title">Expenses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" role="grid" aria-label="Expenses list">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense, index) => (
                <tr 
                  key={expense.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                      deleteExpense(expense.id);
                    } else if (e.key === 'ArrowDown' && index < filteredExpenses.length - 1) {
                      e.preventDefault();
                      document.querySelector(`tr[data-row-index="${index + 1}"]`)?.focus();
                    } else if (e.key === 'ArrowUp' && index > 0) {
                      e.preventDefault();
                      document.querySelector(`tr[data-row-index="${index - 1}"]`)?.focus();
                    }
                  }}
                  data-row-index={index}
                  role="row"
                  aria-label={`Expense: ${expense.description}, Amount: ${expense.amount} ${expense.currency}, Date: ${expense.date}, Category: ${expense.category}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.amount ? expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} {expense.currency}
                    {expense.currency !== 'THB' && (
                      <div className="text-xs text-gray-400">
                        ({expense.convertedAmount ? expense.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} THB)
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-2 py-1 hover:bg-red-50"
                      aria-label={`Delete expense: ${expense.description} of ${expense.amount} ${expense.currency} on ${expense.date}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
