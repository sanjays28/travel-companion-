import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DistanceCalculator from './DistanceCalculator';

// PUBLIC_INTERFACE
const LocationDetails = ({ location }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === location.photos.length - 1 ? 0 : prev + 1
    );
  };

  const previousPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? location.photos.length - 1 : prev - 1
    );
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev === location.videos.length - 1 ? 0 : prev + 1
    );
  };

  const previousVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev === 0 ? location.videos.length - 1 : prev - 1
    );
  };

  const calculateAverageRating = () => {
    if (!location.reviews || location.reviews.length === 0) return 0;
    const sum = location.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / location.reviews.length).toFixed(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Location Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
        <p className="text-gray-600">{location.description}</p>
      </div>

      {/* Photo Gallery */}
      <div className="relative">
        <h2 className="text-2xl font-semibold mb-4">Photo Gallery</h2>
        <div className="relative h-96">
          {location.photos && location.photos.length > 0 && (
            <>
              <img
                src={location.photos[currentPhotoIndex].url}
                alt={location.photos[currentPhotoIndex].caption}
                className="w-full h-full object-cover rounded-lg"
                data-testid="photo-gallery-image"
              />
              <p 
                className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center"
                data-testid="photo-gallery-caption"
              >
                {location.photos[currentPhotoIndex].caption}
              </p>
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
                <button
                  onClick={previousPhoto}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  aria-label="Previous photo"
                  data-testid="photo-gallery-prev-button"
                >
                  ←
                </button>
                <button
                  onClick={nextPhoto}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  aria-label="Next photo"
                  data-testid="photo-gallery-next-button"
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video Player */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Videos</h2>
        {location.videos && location.videos.length > 0 && (
          <div className="relative">
            <video
              src={location.videos[currentVideoIndex].url}
              controls
              className="w-full rounded-lg"
              title={location.videos[currentVideoIndex].title}
              data-testid="video-player"
            />
            <p 
              className="mt-2 text-center font-medium"
              data-testid="video-title"
            >
              {location.videos[currentVideoIndex].title}
            </p>
            {location.videos.length > 1 && (
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={previousVideo}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  aria-label="Previous video"
                  data-testid="video-prev-button"
                >
                  Previous Video
                </button>
                <button
                  onClick={nextVideo}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  aria-label="Next video"
                  data-testid="video-next-button"
                >
                  Next Video
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          <div className="text-xl font-bold">
            Average Rating: {calculateAverageRating()} / 5
          </div>
        </div>
        <div className="space-y-4">
          {location.reviews && location.reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{review.author}</span>
                <div className="flex items-center">
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                  <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Highlights</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {location.highlights && location.highlights.map((highlight, index) => (
            <li
              key={index}
              className="bg-blue-50 p-4 rounded-lg flex items-center"
            >
              <span className="text-blue-500 mr-2">•</span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <div className="flex flex-wrap gap-2">
          {location.features && location.features.map((feature, index) => (
            <span
              key={index}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Points of Interest */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Points of Interest</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {location.pointsOfInterest && location.pointsOfInterest.map((poi, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{poi.name}</h3>
              <p className="text-gray-600">{poi.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Coordinates: {poi.coordinates.lat}, {poi.coordinates.lng}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distance Calculator */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Distances to Other Locations</h2>
        <DistanceCalculator selectedPoint={location.coordinates} />
      </div>
    </div>
  );
};

LocationDetails.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coordinates: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }).isRequired,
    photos: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired
    })),
    videos: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })),
    reviews: PropTypes.arrayOf(PropTypes.shape({
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired
    })),
    highlights: PropTypes.arrayOf(PropTypes.string),
    features: PropTypes.arrayOf(PropTypes.string),
    pointsOfInterest: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired
      }).isRequired,
      description: PropTypes.string.isRequired
    }))
  }).isRequired
};

export default LocationDetails;
