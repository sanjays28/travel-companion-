import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import locations from '../../data/staticLocations';

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Validate coordinates
const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

// PUBLIC_INTERFACE
const DistanceCalculator = ({ selectedPoint }) => {
  const [distances, setDistances] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedPoint || !isValidCoordinate(selectedPoint.lat, selectedPoint.lng)) {
      setError('Invalid coordinates provided');
      setDistances([]);
      return;
    }

    try {
      const calculatedDistances = locations.map(location => {
        const distance = calculateDistance(
          selectedPoint.lat,
          selectedPoint.lng,
          location.coordinates.lat,
          location.coordinates.lng
        );

        return {
          id: location.id,
          name: location.name,
          distance: distance,
          type: location.type,
          features: location.features,
          description: location.description
        };
      });

      // Sort locations by distance
      const sortedDistances = calculatedDistances.sort((a, b) => a.distance - b.distance);
      setDistances(sortedDistances);
      setError(null);
    } catch (err) {
      setError('Error calculating distances');
      setDistances([]);
    }
  }, [selectedPoint]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Distances from Selected Point</h2>
      <div className="space-y-4">
        {distances.map(location => (
          <div
            key={location.id}
            className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{location.name}</h3>
                <p className="text-gray-600 mt-1">{location.description}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-600">
                  {location.distance.toFixed(1)} km
                </span>
                <p className="text-sm text-gray-500 capitalize">{location.type}</p>
              </div>
            </div>
            
            {location.features && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {location.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

DistanceCalculator.propTypes = {
  selectedPoint: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired
};

export default DistanceCalculator;