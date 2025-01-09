import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DistanceCalculator from '../components/location/DistanceCalculator';
import locations from '../data/staticLocations';

// Mock locations data to avoid external dependencies
jest.mock('../data/staticLocations', () => [
  {
    id: 'test-1',
    name: 'Bangkok',
    coordinates: { lat: 13.7563, lng: 100.5018 },
    type: 'city',
    description: 'Test location 1',
    features: ['feature1', 'feature2']
  },
  {
    id: 'test-2',
    name: 'Chiang Mai',
    coordinates: { lat: 18.7883, lng: 98.9853 },
    type: 'city',
    description: 'Test location 2',
    features: ['feature3', 'feature4']
  }
]);

describe('DistanceCalculator Component', () => {
  // Test distance calculation between known points
  test('calculates correct distance between known points', () => {
    const selectedPoint = { lat: 13.7563, lng: 100.5018 }; // Bangkok coordinates
    const { container } = render(<DistanceCalculator selectedPoint={selectedPoint} />);
    
    // The distance between Bangkok and Chiang Mai should be approximately 588 km
    const distanceElements = container.querySelectorAll('.text-2xl.font-bold.text-blue-600');
    const distances = Array.from(distanceElements).map(el => parseFloat(el.textContent));
    
    expect(distances[0]).toBe(0); // Distance to self should be 0
    expect(Math.round(distances[1])).toBe(588); // Distance to Chiang Mai
  });

  // Test handling of invalid coordinates
  test('handles invalid coordinates gracefully', () => {
    const invalidPoint = { lat: 91, lng: 181 }; // Invalid coordinates
    render(<DistanceCalculator selectedPoint={invalidPoint} />);
    
    expect(screen.getByText('Invalid coordinates provided')).toBeInTheDocument();
  });

  // Test sorting locations by distance
  test('sorts locations by distance correctly', () => {
    const selectedPoint = { lat: 15, lng: 100 }; // Point between Bangkok and Chiang Mai
    const { container } = render(<DistanceCalculator selectedPoint={selectedPoint} />);
    
    const distanceElements = container.querySelectorAll('.text-2xl.font-bold.text-blue-600');
    const distances = Array.from(distanceElements).map(el => parseFloat(el.textContent));
    
    // Check if distances are sorted in ascending order
    const sortedDistances = [...distances].sort((a, b) => a - b);
    expect(distances).toEqual(sortedDistances);
  });

  // Test edge cases
  describe('Edge Cases', () => {
    test('handles same location coordinates', () => {
      const bangkokPoint = { lat: 13.7563, lng: 100.5018 }; // Bangkok coordinates
      const { container } = render(<DistanceCalculator selectedPoint={bangkokPoint} />);
      
      const firstDistance = parseFloat(container.querySelector('.text-2xl.font-bold.text-blue-600').textContent);
      expect(firstDistance).toBe(0);
    });

    test('handles antipodal points', () => {
      const antipodalPoint = { lat: -13.7563, lng: -79.4982 }; // Opposite to Bangkok
      const { container } = render(<DistanceCalculator selectedPoint={antipodalPoint} />);
      
      const distanceElements = container.querySelectorAll('.text-2xl.font-bold.text-blue-600');
      const distances = Array.from(distanceElements).map(el => parseFloat(el.textContent));
      
      // The maximum distance on Earth should be approximately 20,000 km
      distances.forEach(distance => {
        expect(distance).toBeLessThanOrEqual(20000);
      });
    });
  });

  // Test unit conversion accuracy
  test('maintains accuracy in distance calculations', () => {
    const selectedPoint = { lat: 13.7563, lng: 100.5018 }; // Bangkok
    const { container } = render(<DistanceCalculator selectedPoint={selectedPoint} />);
    
    const distanceElements = container.querySelectorAll('.text-2xl.font-bold.text-blue-600');
    const distances = Array.from(distanceElements).map(el => {
      const value = el.textContent;
      // Check if distance has at most one decimal place
      expect(value.split('.')[1]?.length || 0).toBeLessThanOrEqual(1);
      return parseFloat(value);
    });
    
    // Verify distances are reasonable (less than Earth's circumference)
    distances.forEach(distance => {
      expect(distance).toBeGreaterThanOrEqual(0);
      expect(distance).toBeLessThanOrEqual(40075); // Earth's circumference in km
    });
  });

  // Test error handling
  test('handles missing selectedPoint prop', () => {
    console.error = jest.fn(); // Suppress console.error for this test
    expect(() => render(<DistanceCalculator />)).toThrow();
    expect(console.error).toHaveBeenCalled();
  });
});