import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// PUBLIC_INTERFACE
const ItineraryCalendarView = ({ itineraryData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDate = (date) => {
    return itineraryData.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const renderDayCell = (day) => {
    const dayEvents = getEventsForDate(day);
    const isCurrentMonth = isSameMonth(day, currentDate);

    return (
      <div
        key={day.toString()}
        className={`min-h-[120px] p-2 border border-gray-200 ${
          isCurrentMonth ? 'bg-white' : 'bg-gray-50'
        }`}
      >
        <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
          {format(day, 'd')}
        </div>
        <div className="mt-1 space-y-1">
          {dayEvents.map((event, index) => (
            <div
              key={index}
              className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
              title={event.title || event.location}
            >
              {event.title || event.location}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="bg-gray-100 p-2 text-center text-sm font-semibold">
          {day}
        </div>
      ))}
      {days.map(day => renderDayCell(day))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex space-x-4">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        {view === 'month' && renderMonthView()}
        {/* Week and Day views will be implemented in future iterations */}
        {(view === 'week' || view === 'day') && (
          <div className="text-center text-gray-500 py-8">
            {view.charAt(0).toUpperCase() + view.slice(1)} view coming soon
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryCalendarView;