import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, initializeStorage } from '../../services/storage';
import TimelineView from './TimelineView';
import CalendarView from './CalendarView';
import ListView from './ListView';

// PUBLIC_INTERFACE
const ItineraryView = () => {
  const [viewType, setViewType] = useState('timeline');
  const [itineraryData, setItineraryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItineraryData = async () => {
      try {
        // Initialize storage with static data if needed
        await initializeStorage();
        
        // Load itinerary data from storage
        const data = getFromLocalStorage('itinerary');
        if (data) {
          setItineraryData(data);
        } else {
          throw new Error('No itinerary data found');
        }
      } catch (err) {
        setError('Failed to load itinerary data: ' + err.message);
      }
    };

    loadItineraryData();
  }, []);

  const renderView = () => {
    if (error) {
      return (
        <div className="p-4 text-red-600 bg-red-100 rounded">
          {error}
        </div>
      );
    }

    switch (viewType) {
      case 'timeline':
        return <TimelineView itinerary={itineraryData} />;
      case 'calendar':
        return <CalendarView itinerary={itineraryData} />;
      case 'list':
        return <ListView itinerary={itineraryData} />;
      default:
        return <TimelineView itinerary={itineraryData} />;
    }
  };

  const handleKeyboardNavigation = (e, currentView, direction) => {
    e.preventDefault();
    const views = ['timeline', 'calendar', 'list'];
    const currentIndex = views.indexOf(currentView);
    let newIndex;

    if (direction === 'right') {
      newIndex = currentIndex === views.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? views.length - 1 : currentIndex - 1;
    }

    setViewType(views[newIndex]);
    document.getElementById(`${views[newIndex]}-tab`)?.focus();
  };

  return (
    <div 
      className="container mx-auto p-4" 
      role="main"
      aria-live="polite"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4" id="itinerary-title">Itinerary</h2>
        <div className="flex space-x-4" role="tablist" aria-label="Itinerary view options">
          <button
            className={`px-4 py-2 rounded transition-all duration-200 ${
              viewType === 'timeline'
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            }`}
            onClick={() => setViewType('timeline')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                setViewType('calendar');
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setViewType('list');
              }
            }}
            data-testid="view-timeline"
            role="tab"
            aria-selected={viewType === 'timeline'}
            aria-controls="timeline-panel"
            id="timeline-tab"
          >
            Timeline
          </button>
          <button
            className={`px-4 py-2 rounded transition-all duration-200 ${
              viewType === 'calendar'
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            }`}
            onClick={() => setViewType('calendar')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                setViewType('list');
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setViewType('timeline');
              }
            }}
            data-testid="view-calendar"
            role="tab"
            aria-selected={viewType === 'calendar'}
            aria-controls="calendar-panel"
            id="calendar-tab"
          >
            Calendar
          </button>
          <button
            className={`px-4 py-2 rounded transition-all duration-200 ${
              viewType === 'list'
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            }`}
            onClick={() => setViewType('list')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                setViewType('timeline');
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setViewType('calendar');
              }
            }}
            data-testid="view-list"
            role="tab"
            aria-selected={viewType === 'list'}
            aria-controls="list-panel"
            id="list-tab"
          >
            List
          </button>
        </div>
      </div>
      {renderView()}
    </div>
  );
};

export default ItineraryView;
