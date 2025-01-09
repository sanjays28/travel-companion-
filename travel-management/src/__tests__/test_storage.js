import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  clearLocalStorage
} from '../services/storage';

describe('Storage Service', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    jest.clearAllMocks();
  });

  test('saves data to localStorage successfully', () => {
    const testData = { id: 1, name: 'Test' };
    const result = saveToLocalStorage('testKey', testData);
    
    expect(result).toBe(true);
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify(testData));
  });

  test('retrieves data from localStorage successfully', () => {
    const testData = { id: 1, name: 'Test' };
    localStorage.setItem('testKey', JSON.stringify(testData));
    
    const result = getFromLocalStorage('testKey');
    expect(result).toEqual(testData);
  });

  test('returns null for non-existent key', () => {
    const result = getFromLocalStorage('nonExistentKey');
    expect(result).toBeNull();
  });

  test('handles invalid JSON data gracefully', () => {
    localStorage.setItem('invalidKey', 'invalid json');
    
    const result = getFromLocalStorage('invalidKey');
    expect(result).toBeNull();
  });

  test('removes item from localStorage successfully', () => {
    localStorage.setItem('testKey', 'test value');
    
    const result = removeFromLocalStorage('testKey');
    
    expect(result).toBe(true);
    expect(localStorage.getItem('testKey')).toBeNull();
  });

  test('clears all items from localStorage successfully', () => {
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    
    const result = clearLocalStorage();
    
    expect(result).toBe(true);
    expect(localStorage.length).toBe(0);
  });

  test('handles localStorage errors when saving', () => {
    // Mock localStorage.setItem to throw an error
    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
    mockSetItem.mockImplementation(() => {
      throw new Error('Storage full');
    });

    const result = saveToLocalStorage('testKey', { data: 'test' });
    
    expect(result).toBe(false);
    mockSetItem.mockRestore();
  });

  test('handles localStorage errors when clearing', () => {
    // Mock localStorage.clear to throw an error
    const mockClear = jest.spyOn(Storage.prototype, 'clear');
    mockClear.mockImplementation(() => {
      throw new Error('Clear failed');
    });

    const result = clearLocalStorage();
    
    expect(result).toBe(false);
    mockClear.mockRestore();
  });
});