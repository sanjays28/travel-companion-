import React from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
const ItineraryTimelineView = ({ itineraryData }) => {
  const sortedData = [...itineraryData].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

      {sortedData.map((item, index) => {
        const date = new Date(item.date);
        const isNewDay = index === 0 || 
          new Date(sortedData[index - 1].date).toDateString() !== date.toDateString();

        return (
          <div key={index} className="mb-8">
            {/* Date marker for new day */}
            {isNewDay && (
              <div className="mb-4 ml-16 text-lg font-semibold text-gray-700">
                {date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}

            <div className="flex items-start group">
              {/* Timeline dot and connector */}
              <div className="flex items-center">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow group-hover:bg-primary-dark transition-colors"></div>
                <div className="flex-grow border-t-2 border-gray-300 w-8"></div>
              </div>

              {/* Event card */}
              <div className="ml-4 flex-grow">
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {item.title || item.location}
                      </h3>
                      <p className="text-gray-600">
                        {date.toLocaleTimeString('en-US', { 
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {item.location && item.location !== item.title && (
                      <div className="text-sm text-gray-500">
                        <p className="text-right">{item.location}</p>
                      </div>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-2 text-gray-700">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {sortedData.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No itinerary items found
        </div>
      )}
    </div>
  );
};

ItineraryTimelineView.propTypes = {
  itineraryData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      location: PropTypes.string,
      date: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired
};

export default ItineraryTimelineView;