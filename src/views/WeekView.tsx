import React from "react";
import type { Task } from "../App";
import { getStatusDotColor, getCategoryBgColor } from "../shared/utils/Colors";

interface WeekViewProps {
  tasks: Task[];
}

const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

const getStartOfWeek = (date: Date) => {
  const day = date.getDay(); // 0 = Sunday
  const diff = date.getDate() - (day === 0 ? 6 : day - 1); // Monday start
  const start = new Date(date);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};
// Helper: get column index for a date string
const getColIndex = (weekDates: Date[], dateStr: string) =>
  weekDates.findIndex((d) => d.toISOString().split("T")[0] === dateStr);

// Helper: get top position (in px) for a given startTime
const getTopPx = (startTime: string) => {
  const [h, m] = startTime.split(":").map(Number);
  return h * 48 + (m / 60) * 48; // 48px per hour row
};

// Helper: get height (in px) for a given start/end time
const getHeightPx = (start: string, end?: string) => {
  if (!end) return 48; // default 1 hour
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh + em / 60 - (sh + sm / 60)) * 48;
};

const WeekView: React.FC<WeekViewProps> = ({ tasks }) => {
  const today = new Date();
  const weekDates = getStartOfWeek(today);

  return (
    <div className="p-4 overflow-x-auto">
      <div className="relative grid grid-cols-[60px_repeat(7,_1fr)] min-w-[700px]">
        {/* Header row */}
        <div></div>
        {weekDates.map((date, index) => (
          <div
            key={index}
            className={`text-center font-medium py-2 border-b ${
              date.toDateString() === today.toDateString()
                ? "text-slate-600 font-bold border-b-4 border-slate-600 bg-slate-300 hover:bg-slate-200 hover:shadow"
                : "text-slate-600 border-b"
            }`}>
            {date.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
            })}
          </div>
        ))}

        {/* Optional: All-day row */}
        <div className="bg-slate-50 py-1 pr-2 border-b text-slate-400 text-xs">
          All-day
        </div>
        {weekDates.map((_, dayIndex) => (
          <div
            key={`allday-${dayIndex}`}
            className="bg-slate-50 border border-slate-200 h-8"></div>
        ))}

        {/* Grid body */}
        {hours.map((hour, hourIndex) => (
          <React.Fragment key={hourIndex}>
            {/* Time labels */}
            <div className="py-1 pr-2 text-slate-400 text-xs">{hour}</div>
            {/* Each column for each day */}
            {weekDates.map((_, dayIndex) => (
              <div
                key={`${hourIndex}-${dayIndex}`}
                className="relative bg-white border border-slate-200 h-12"></div>
            ))}
          </React.Fragment>
        ))}

        {/* Task blocks (absolute positioning over the grid) */}
        {tasks.map((task) => {
          if (!task.startDate || !task.startTime) return null;
          const col = getColIndex(weekDates, task.startDate);
          if (col === -1) return null;
          const top = getTopPx(task.startTime);
          const height = getHeightPx(task.startTime, task.endTime);

          return (
            <div
              key={task.id}
              className="absolute pointer-events-none"
              style={{
                gridColumn: `${col + 2} / span 1`,
                top: `${top + 88}px`,
                height: `${height}px`,
                width: "100%",
                zIndex: 10,
              }}>
              <div className="relative flex items-center px-1 w-full h-full pointer-events-auto">
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
