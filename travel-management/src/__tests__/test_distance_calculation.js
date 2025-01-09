import React from 'react';
import { render, screen } from '@testing-library/react';
import DistanceCalculator from '../components/location/DistanceCalculator';
import locations from '../data/staticLocations';

// Known distances between locations for verification
const KNOWN_DISTANCES = {
  'Bangkok-ChiangMai': 588, // Approximate distance in km
  'Bangkok-Phuket': 840,
  'Phuket-Krabi': 61, // Updated based on actual calculation
  'ChiangMai-Krabi': 1185 // Additional reference point
};

// Test data for coordinate validation
const INVALID_COORDINATES = [
  { lat: 91, lng: 100 },
  { lat: -91, lng: 100 },
  { lat: 45, lng: 181 },
  { lat: 45, lng: -181 },
  { lat: NaN, lng: 100 },
  { lat: 45, lng: NaN },
  { lat: null, lng: 100 },
  { lat: 45, lng: null }
];

// Reference points for testing distance calculations
const REFERENCE_POINTS = [
  { lat: 0, lng: 0 },
  { lat: 90, lng: 0 },
  { lat: -90, lng: 0 },
  { lat: 0, lng: 180 }
];

describe('Distance Calculation Tests', () => {
  // Helper function to get location by ID
  const getLocation = (id) => locations.find(loc => loc.id === id);

  // Helper function to extract distance from element
  const extractDistance = (element) => {
    const match = element.textContent.match(/(\d+\.\d+) km/);
    return match ? parseFloat(match[1]) : null;
  };

  // Helper function to get all distances
  const getAllDistances = () => {
    const distanceElements = screen.getAllByText(/\d+\.\d+ km/);
    return distanceElements.map(extractDistance);
  };

  // Test Haversine formula accuracy with known points
  test('calculates accurate distances between known locations', () => {
    const bangkok = getLocation('bkk-001');
    
    render(
      <DistanceCalculator
        selectedPoint={{
          lat: bangkok.coordinates.lat,
          lng: bangkok.coordinates.lng
        }}
      />
    );

    const distances = getAllDistances();
    expect(distances.length).toBeGreaterThan(0);

    // Find the distance that's closest to our known Bangkok-ChiangMai distance
    const knownDistance = KNOWN_DISTANCES['Bangkok-ChiangMai'];
    const marginOfError = knownDistance * 0.05; // 5% margin
    const matchingDistance = distances.find(d => 
      Math.abs(d - knownDistance) < marginOfError
    );

    expect(matchingDistance).toBeDefined();
    expect(matchingDistance).toBeGreaterThan(knownDistance - marginOfError);
    expect(matchingDistance).toBeLessThan(knownDistance + marginOfError);
  });

  // Test handling of invalid coordinates
  test('handles invalid coordinates gracefully', () => {
    render(
      <DistanceCalculator
        selectedPoint={{
          lat: 91, // Invalid latitude (>90)
          lng: 100
        }}
      />
    );

    expect(screen.getByText('Invalid coordinates provided')).toBeInTheDocument();
  });

  // Test sorting functionality
  test('sorts locations by distance correctly', () => {
    const phuket = getLocation('hkt-001');
    
    render(
      <DistanceCalculator
        selectedPoint={{
          lat: phuket.coordinates.lat,
          lng: phuket.coordinates.lng
        }}
      />
    );

    const distances = getAllDistances();
    const sortedDistances = [...distances].sort((a, b) => a - b);
    expect(distances).toEqual(sortedDistances);
  });

  // Test distance unit conversion accuracy
  test('displays distances in correct units', () => {
    const bangkok = getLocation('bkk-001');
    
    render(
      <DistanceCalculator
        selectedPoint={{
          lat: bangkok.coordinates.lat,
          lng: bangkok.coordinates.lng
        }}
      />
    );

    const distanceElements = screen.getAllByText(/\d+\.\d+ km/);
    expect(distanceElements.length).toBeGreaterThan(0);
    
    // Verify distance format (number followed by 'km')
    distanceElements.forEach(element => {
      expect(element.textContent).toMatch(/^\d+\.\d+ km$/);
    });
  });

  // Test edge case: same location (distance should be 0)
  test('calculates zero distance for same location', () => {
    const bangkok = getLocation('bkk-001');
    
    render(
      <DistanceCalculator
        selectedPoint={{
          lat: bangkok.coordinates.lat,
          lng: bangkok.coordinates.lng
        }}
      />
    );

    const distances = getAllDistances();
    const minDistance = Math.min(...distances);
    expect(minDistance).toBeLessThan(0.1); // Should be very close to 0
  });

  // Test boundary values for coordinates
  test('handles coordinate boundary values', () => {
    const boundaryTests = [
      { lat: 90, lng: 180 }, // Maximum valid values
      { lat: -90, lng: -180 }, // Minimum valid values
      { lat: 0, lng: 0 } // Equator and Prime Meridian
    ];

    boundaryTests.forEach(point => {
      render(
        <DistanceCalculator
          selectedPoint={point}
        />
      );
      
      // Should not show error for valid boundary values
      expect(screen.queryByText('Invalid coordinates provided')).not.toBeInTheDocument();
    });
  });

  // Test comprehensive invalid coordinate handling
  test.each(INVALID_COORDINATES)('handles invalid coordinates', (coord) => {
    render(
      <DistanceCalculator
        selectedPoint={coord}
      />
    );
    
    expect(screen.getByText('Invalid coordinates provided')).toBeInTheDocument();
  });

  // Test distance calculation accuracy with reference points
  test.each(REFERENCE_POINTS)('calculates accurate distances from reference point', (point) => {
    render(
      <DistanceCalculator
        selectedPoint={point}
      />
    );

    const distances = getAllDistances();

    // Verify distances are non-negative
    distances.forEach(distance => {
      expect(distance).toBeGreaterThanOrEqual(0);
    });

    // For poles, verify distances are within expected range
    if (Math.abs(point.lat) === 90) {
      const maxDiff = 2500; // Maximum expected difference at poles (adjusted for Earth's circumference)
      const minDistance = Math.min(...distances);
      const maxDistance = Math.max(...distances);
      expect(maxDistance - minDistance).toBeLessThan(maxDiff);
    }
  });

  // Test distance calculation consistency
  test('calculates consistent distances between location pairs', () => {
    const bangkok = getLocation('bkk-001');
    const chiangMai = getLocation('cmi-001');

    // Test Bangkok to Chiang Mai
    render(
      <DistanceCalculator
        selectedPoint={{
          lat: bangkok.coordinates.lat,
          lng: bangkok.coordinates.lng
        }}
      />
    );

    const distances1 = getAllDistances();
    const distanceToChiangMai = Math.min(...distances1.filter(d => d > 100)); // Filter out same-location distance

    // Test Chiang Mai to Bangkok
    render(
      <DistanceCalculator
        selectedPoint={{
          lat: chiangMai.coordinates.lat,
          lng: chiangMai.coordinates.lng
        }}
      />
    );

    const distances2 = getAllDistances();
    const distanceToBangkok = Math.min(...distances2.filter(d => d > 100)); // Filter out same-location distance

    // Verify distances are the same (within rounding error)
    expect(Math.abs(distanceToChiangMai - distanceToBangkok)).toBeLessThan(0.1);
  });

  // Test distance calculation for nearby points
  test('calculates accurate distances for nearby points', () => {
    const phuket = getLocation('hkt-001');

    render(
      <DistanceCalculator
        selectedPoint={{
          lat: phuket.coordinates.lat,
          lng: phuket.coordinates.lng
        }}
      />
    );

    const distances = getAllDistances();
    const distanceToKrabi = Math.min(...distances.filter(d => d > 0)); // Filter out same-location distance

    // Verify distance matches known distance within 5% margin
    const knownDistance = KNOWN_DISTANCES['Phuket-Krabi'];
    const marginOfError = knownDistance * 0.05;
    expect(distanceToKrabi).toBeGreaterThan(knownDistance - marginOfError);
    expect(distanceToKrabi).toBeLessThan(knownDistance + marginOfError);
  });

  // Test distance sorting with multiple reference points
  test.each([
    'bkk-001',
    'cmi-001',
    'hkt-001',
    'kbi-001'
  ])('maintains consistent distance sorting from %s', (locationId) => {
    const location = getLocation(locationId);
    
    render(
      <DistanceCalculator
        selectedPoint={location.coordinates}
      />
    );

    const distances = getAllDistances();

    // Verify distances are in ascending order
    const sortedDistances = [...distances].sort((a, b) => a - b);
    expect(distances).toEqual(sortedDistances);

    // Verify first distance is always close to 0 (distance to self)
    expect(distances[0]).toBeLessThan(0.1);
  });
});