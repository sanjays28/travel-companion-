import { staticItinerary } from '../data/staticItinerary';
import { staticExpenses } from '../data/staticExpenses';
import locations from '../data/staticLocations';
import currencyRates from '../data/staticCurrencyRates';

// Static data mapping
const staticData = {
  'itinerary': staticItinerary,
  'expenses': staticExpenses,
  'locations': locations,
  'currencyRates': currencyRates
};

// PUBLIC_INTERFACE
export const initializeStorage = () => {
  try {
    // Check each key and initialize if empty
    Object.entries(staticData).forEach(([key, data]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    });
    return true;
  } catch (error) {
    console.error('Error initializing localStorage:', error);
    return false;
  }
};

// PUBLIC_INTERFACE
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// PUBLIC_INTERFACE
export const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// PUBLIC_INTERFACE
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// PUBLIC_INTERFACE
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};
