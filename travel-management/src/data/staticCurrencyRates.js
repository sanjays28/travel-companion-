/**
 * Static currency exchange rates for THB conversion
 * This file provides predefined exchange rates for major currencies to Thai Baht (THB)
 */

// PUBLIC_INTERFACE
const currencyRates = {
  lastUpdated: "2024-01-15T00:00:00Z",
  base: "THB",
  rates: {
    THB: 1.00,     // Base currency
    USD: 0.02845,  // 1 USD = 35.12 THB
    EUR: 0.02620,  // 1 EUR = 38.15 THB
    GBP: 0.02240,  // 1 GBP = 44.64 THB
    JPY: 4.22000,  // 1 THB = 4.22 JPY
    INR: 2.40000,  // 1 THB = 2.40 INR
    AUD: 0.04310,  // 1 AUD = 23.20 THB
    SGD: 0.03780   // 1 SGD = 26.45 THB
  }
};

export default currencyRates;
