import React from 'react';

// PUBLIC_INTERFACE
const TimelineView = ({ itinerary }) => {
  return (
    <div className="relative" data-testid="timeline-view">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-8">
        {itinerary.map((item, index) => (
          <div key={index} className="relative pl-12">
            <div className="absolute left-2 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 mt-1.5"></div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-gray-600">{item.date}</p>
              <p className="text-gray-500">{item.location}</p>
              <p className="mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
