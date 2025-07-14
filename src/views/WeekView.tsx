import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Task } from "../App";
import { getStatusDotColor, getCategoryBgColor } from "../shared/utils/colors";

// Props interface for WeekView component
interface WeekViewProps {
  tasks: Task[];
}

// Generate array of time strings from "00:00" to "23:00"
const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

// Calculate the start of the current week (Monday) and return all 7 dates
const getStartOfWeek = (date: Date) => {
  const day = date.getDay(); // Sunday = 0
  const diff = date.getDate() - (day === 0 ? 6 : day - 1); // Offset to get Monday
  const start = new Date(date);
  start.setDate(diff); // Set to Monday
  start.setHours(0, 0, 0, 0); // Reset time to midnight

  // Return array of 7 dates starting from Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

// Format a Date object into a YYYY-MM-DD string (local time)
const toLocalDateString = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Find the index of a date string in the weekDates array
const getColIndex = (weekDates: Date[], dateStr: string) =>
  weekDates.findIndex((d) => toLocalDateString(d) === dateStr);

// Convert a time string (e.g. "14:30") into vertical position in pixels
const getTopPx = (startTime: string) => {
  const [h, m] = startTime.split(":").map(Number);
  return h * 48 + (m / 60) * 48; // Each hour = 48px
};

// Calculate height in pixels for a task duration
const getHeightPx = (start: string, end?: string) => {
  if (!end) return 48; // Default to 1 hour height
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh + em / 60 - (sh + sm / 60)) * 48;
};

const WeekView: React.FC<WeekViewProps> = ({ tasks }) => {
  // State to track the base date for the current visible week
  const [startDate, setStartDate] = useState(new Date());

  // Get week range based on the selected start date
  const weekDates = getStartOfWeek(startDate);

  return (
    <div className="p-4 overflow-x-auto">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="flex items-center bg-slate-300 hover:bg-slate-400 px-2 py-1 rounded text-slate-700"
          onClick={() => {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() - 1); // Go to previous day
            setStartDate(newDate);
          }}>
          <FaChevronLeft className="mr-1" />

        </button>

        <span className="font-semibold text-slate-700">
  {weekDates[4].toLocaleDateString("default", {
    day: "numeric",
    month: "long",
  })}
</span>

        <button
          className="flex items-center bg-slate-300 hover:bg-slate-400 px-2 py-1 rounded text-slate-700"
          onClick={() => {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + 1); // Go to next day
            setStartDate(newDate);
          }}>
          <FaChevronRight className="ml-1" />
        </button>
      </div>

      <div className="relative grid grid-cols-[60px_repeat(7,_1fr)] min-w-[700px]">
        {/*  WEEKDAY HEADER  */}
        <div></div> {/* Empty cell for time column header */}
        {weekDates.map((date, index) => (
          <div
            key={index}
            className={`text-center font-medium py-2 border-b ${
              toLocalDateString(date) === toLocalDateString(new Date())
                ? "text-slate-600 font-bold border-b-4 border-slate-600 bg-slate-300 hover:bg-slate-200 hover:shadow"
                : "text-slate-600 border-b"
            }`}>
            {/* Show weekday name and date (e.g. Mon 1) */}
            {date.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
            })}
          </div>
        ))}
        {/*  ALL-DAY ROW  */}
        <div className="bg-slate-50 py-1 pr-2 border-b text-slate-400 text-xs">
          All-day
        </div>
        {weekDates.map((_, dayIndex) => (
          <div
            key={`allday-${dayIndex}`}
            className="bg-slate-50 border border-slate-200 h-8"></div>
        ))}
        {/*  HOURLY GRID  */}
        {hours.map((hour, hourIndex) => (
          <React.Fragment key={hourIndex}>
            {/* Time label on the left */}
            <div className="py-1 pr-2 text-slate-400 text-xs">{hour}</div>
            {/* 7 columns, one for each day */}
            {weekDates.map((_, dayIndex) => (
              <div
                key={`${hourIndex}-${dayIndex}`}
                className="relative bg-white border border-slate-200 h-12"></div>
            ))}
          </React.Fragment>
        ))}
        {/*  TASK BLOCKS  */}
        {tasks.map((task) => {
          if (!task.startDate || !task.startTime) return null;

          const colStart = getColIndex(weekDates, task.startDate);
          if (colStart === -1) return null;

          // Determine column end for multi-day tasks
          let colEnd = colStart;
          if (task.endDate) {
            const tempEnd = getColIndex(weekDates, task.endDate);
            if (tempEnd !== -1) {
              colEnd = tempEnd;
            }
          }

          const top = getTopPx(task.startTime); // Y position of task
          const height = getHeightPx(task.startTime, task.endTime); // Task height

          return (
            <div
              key={task.id}
              className="absolute pointer-events-none"
              style={{
                gridColumn: `${colStart + 2} / ${colEnd + 3}`, // Span across day columns
                top: `${top + 88}px`, // Offset by header + all-day height
                height: `${height}px`,
                width: "100%",
                zIndex: 10,
              }}>
              {/* Group class enables tooltip hover behavior */}
              <div className="group relative flex items-center px-1 w-full h-full pointer-events-auto">
                {/* Tooltip */}
                <span className="-bottom-8 left-1/2 z-10 absolute bg-slate-700 opacity-0 group-hover:opacity-100 px-2 py-1 rounded text-white text-xs whitespace-pre-line transition-opacity -translate-x-1/2 duration-200 ease-in-out pointer-events-none">
                  {task.title}
                </span>

                {/* Task card  */}
                <div
                  className={`px-2 py-1 border rounded shadow text-xs w-full truncate text-slate-800
                  ${getCategoryBgColor(task.category)} ${getStatusDotColor(
                    task.status
                  )}`}>
                  <span>{task.title}</span>
                  {task.endTime && (
                    <span className="ml-1 text-[10px] text-slate-600">
                      ({task.startTime}–{task.endTime})
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
