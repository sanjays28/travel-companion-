import React from 'react';

// PUBLIC_INTERFACE
const ListView = ({ itinerary }) => {
  return (
    <div className="space-y-4" data-testid="list-view">
      {itinerary.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-gray-500">{item.location}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">{item.date}</p>
            </div>
          </div>
          <p className="mt-2">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ListView;
