import React from 'react';
 
const CalendarTimeline: React.FC = () => {
    return (
        <div>
          <h2 className="font-bold text-lg">Calendar Timeline</h2>
          <div className="flex flex-col space-y-4">
            <div className="bg-white shadow p-4 rounded">
              <h3 className="font-semibold">Event 1</h3>
              <p>Details about event 1</p>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="font-semibold">Event 2</h3>
              <p>Details about event 2</p>
            </div>
            {/* Add more events as needed */}
          </div>
        </div>
      );
}
 
export default CalendarTimeline;