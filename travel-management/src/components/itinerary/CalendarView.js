import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const CalendarView = ({ itinerary }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthEvents, setMonthEvents] = useState({});

  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days = [];
      
      // Add previous month's days
      for (let i = 0; i < firstDay.getDay(); i++) {
        const prevDate = new Date(year, month, -i);
        days.unshift(prevDate);
      }
      
      // Add current month's days
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
      }
      
      // Add next month's days to complete the grid
      const remainingDays = 42 - days.length; // 6 rows * 7 days
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i));
      }
      
      setCalendarDays(days);
    };

    const organizeEvents = () => {
      const events = {};
      itinerary.forEach(item => {
        const date = new Date(item.date).toISOString().split('T')[0];
        if (!events[date]) {
          events[date] = [];
        }
        events[date].push(item);
      });
      setMonthEvents(events);
    };

    generateCalendarDays();
    organizeEvents();
  }, [currentDate, itinerary]);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + direction)));
  };

  return (
    <div className="bg-white rounded-lg shadow" data-testid="calendar-view">
      <div className="flex justify-between items-center p-4 border-b">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-gray-600">
            {day}
          </div>
        ))}
        {calendarDays.map((date, index) => {
          const dateStr = formatDate(date);
          const events = monthEvents[dateStr] || [];
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 ${
                isCurrentMonth(date) ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className={`text-right ${
                isCurrentMonth(date) ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {date.getDate()}
              </div>
              <div className="mt-1 space-y-1">
                {events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
