import { convertToTHB, getSupportedCurrencies, getExchangeRate } from '../services/currencyConverter';

describe('Currency Converter Service', () => {
  describe('convertToTHB', () => {
    test('converts USD to THB correctly', () => {
      expect(convertToTHB(100, 'USD')).toBeCloseTo(3512, 1);
    });

    test('returns same amount for THB', () => {
      expect(convertToTHB(100, 'THB')).toBe(100);
    });

    test('converts EUR to THB correctly', () => {
      expect(convertToTHB(100, 'EUR')).toBeCloseTo(3815, 1);
    });

    test('throws error for unsupported currency', () => {
      expect(() => convertToTHB(100, 'XXX')).toThrow('Unsupported currency: XXX');
    });

    test('throws error for invalid amount', () => {
      expect(() => convertToTHB('100', 'USD')).toThrow('Invalid amount provided');
      expect(() => convertToTHB(NaN, 'USD')).toThrow('Invalid amount provided');
      expect(() => convertToTHB(undefined, 'USD')).toThrow('Invalid amount provided');
      expect(() => convertToTHB(null, 'USD')).toThrow('Invalid amount provided');
    });

    test('handles zero amount correctly', () => {
      expect(convertToTHB(0, 'USD')).toBe(0);
    });

    test('handles decimal amounts correctly', () => {
      expect(convertToTHB(10.5, 'USD')).toBeCloseTo(368.76, 2);
      expect(convertToTHB(0.01, 'USD')).toBeCloseTo(0.3512, 4);
      expect(convertToTHB(99.99, 'USD')).toBeCloseTo(3511.65, 2);
    });

    test('handles large amounts correctly', () => {
      expect(convertToTHB(1000000, 'USD')).toBeCloseTo(35120000, 0);
    });

    test('maintains precision for small amounts', () => {
      expect(convertToTHB(0.001, 'USD')).toBeCloseTo(0.03512, 5);
    });

    test('handles negative amounts correctly', () => {
      expect(convertToTHB(-100, 'USD')).toBeCloseTo(-3512, 1);
    });
  });

  describe('getSupportedCurrencies', () => {
    test('returns array including THB and all supported currencies', () => {
      const currencies = getSupportedCurrencies();
      expect(currencies).toContain('THB');
      expect(currencies).toContain('USD');
      expect(currencies).toContain('EUR');
      expect(currencies).toContain('GBP');
      expect(currencies.length).toBe(8); // THB + 7 other currencies
    });

    test('returns THB as first currency', () => {
      expect(getSupportedCurrencies()[0]).toBe('THB');
    });
  });

  describe('getExchangeRate', () => {
    test('returns correct rate for USD', () => {
      expect(getExchangeRate('USD')).toBe(35.12);
    });

    test('returns 1 for THB', () => {
      expect(getExchangeRate('THB')).toBe(1);
    });

    test('throws error for unsupported currency', () => {
      expect(() => getExchangeRate('XXX')).toThrow('Unsupported currency: XXX');
      expect(() => getExchangeRate('')).toThrow('Unsupported currency: ');
      expect(() => getExchangeRate(undefined)).toThrow('Unsupported currency: undefined');
      expect(() => getExchangeRate(null)).toThrow('Unsupported currency: null');
    });

    test('returns correct rates for all supported currencies', () => {
      const currencies = getSupportedCurrencies().filter(c => c !== 'THB');
      currencies.forEach(currency => {
        expect(() => getExchangeRate(currency)).not.toThrow();
        expect(typeof getExchangeRate(currency)).toBe('number');
        expect(getExchangeRate(currency)).toBeGreaterThan(0);
        expect(Number.isFinite(getExchangeRate(currency))).toBe(true);
      });
    });

    test('returns rates with correct precision', () => {
      const currencies = getSupportedCurrencies().filter(c => c !== 'THB');
      currencies.forEach(currency => {
        const rate = getExchangeRate(currency);
        expect(rate.toString()).toMatch(/^\d+(\.\d{1,3})?$/);
      });
    });
  });
});
