/**
 * Currency Converter Service
 * Provides currency conversion functionality using static exchange rates
 * Focuses on THB (Thai Baht) conversions
 */

import currencyRates from '../data/staticCurrencyRates';

// Constants for decimal precision
const DECIMAL_PLACES = 2;
const ROUNDING_MODE = 'HALF_UP';

/**
 * Validates if the amount is a valid number and positive
 * @param {number} amount - The amount to validate
 * @throws {Error} If amount is invalid
 */
const validateAmount = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount) || amount === null) {
    throw new Error('Invalid amount provided');
  }
};

/**
 * Validates if the currency code exists in the rates
 * @param {string} currency - The currency code to validate
 * @throws {Error} If currency is invalid or not supported
 */
const validateCurrency = (currency) => {
  if (!currency || typeof currency !== 'string' || !currencyRates.rates.hasOwnProperty(currency)) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
};

// PUBLIC_INTERFACE
/**
 * Converts an amount from a given currency to THB
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - The source currency code (e.g., 'USD', 'EUR')
 * @returns {number} The converted amount in THB
 * @throws {Error} If the currency is not supported or amount is invalid
 */
export const convertToTHB = (amount, fromCurrency) => {
  validateAmount(amount);
  validateCurrency(fromCurrency);

  const rate = currencyRates.rates[fromCurrency];
  // Since rates are stored as THB to currency, we need to divide
  const convertedAmount = amount / rate;
  return Number(convertedAmount.toFixed(DECIMAL_PLACES));
};

// PUBLIC_INTERFACE
/**
 * Converts an amount from THB to a target currency
 * @param {number} amount - The amount in THB to convert
 * @param {string} toCurrency - The target currency code (e.g., 'USD', 'EUR')
 * @returns {number} The converted amount in the target currency
 * @throws {Error} If the currency is not supported or amount is invalid
 */
export const convertFromTHB = (amount, toCurrency) => {
  validateAmount(amount);
  validateCurrency(toCurrency);

  const rate = currencyRates.rates[toCurrency];
  const convertedAmount = amount * rate;
  return Number(convertedAmount.toFixed(DECIMAL_PLACES));
};

// PUBLIC_INTERFACE
/**
 * Gets the list of supported currencies
 * @returns {string[]} Array of supported currency codes
 */
export const getSupportedCurrencies = () => {
  return Object.keys(currencyRates.rates);
};

// PUBLIC_INTERFACE
/**
 * Gets the last update timestamp of the exchange rates
 * @returns {string} ISO timestamp of the last update
 */
export const getLastUpdateTimestamp = () => {
  return currencyRates.lastUpdated;
};

// PUBLIC_INTERFACE
/**
 * Gets the exchange rate for a given currency to THB
 * @param {string} currency - The currency code to get the rate for
 * @returns {number} The exchange rate (1 unit of currency = X THB)
 * @throws {Error} If the currency is not supported
 */
export const getExchangeRate = (currency) => {
  validateCurrency(currency);
  if (currency === 'THB') return 1;
  return 1 / currencyRates.rates[currency];
};
