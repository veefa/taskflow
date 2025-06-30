import React from "react";
import type { Task } from "../../App";

// Props for MonthView: expects an array of tasks
interface MonthViewProps {
  tasks: Task[];
}

// Days of the week for the calendar header
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper to get the Tailwind color class for a status dot
const getStatusDotColor = (status: Task["status"]) => {
  switch (status) {
    case "done":
      return "bg-green-400";
    case "in progress":
      return "bg-yellow-400";
    case "not started":
    default:
      return "bg-gray-300";
  }
};

// Utility to get all days in the current month as Date objects
function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

const MonthView: React.FC<MonthViewProps> = ({ tasks }) => {
  // Get current year and month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  // Get all days for the current month
  const days = getDaysInMonth(year, month);

  return (
    <div className="p-4">
      {/* Calendar header: days of the week */}
      <div className="gap-2 grid grid-cols-7 mb-2">
        {daysOfWeek.map((d) => (
          <div key={d} className="font-semibold text-slate-500 text-center">
            {d}
          </div>
        ))}
      </div>
      {/* Calendar grid: one cell per day */}
      <div className="gap-2 grid grid-cols-7">
        {days.map((date) => {
          const dateStr = date.toISOString().split("T")[0];
          // Filter tasks for this day by dueDate
          const dayTasks = tasks.filter((task) => task.dueDate === dateStr);
          // Highlight today
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <div
              key={dateStr}
              className={`min-h-[70px] rounded p-1 border text-xs relative ${
                isToday
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}>
              {/* Day number */}
              <div className="font-bold text-slate-700">{date.getDate()}</div>
              {/* List of tasks for this day */}
              <div className="space-y-1 mt-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-1 bg-slate-100 px-1 py-0.5 rounded text-slate-700 truncate"
                    title={task.title} // fallback for accessibility
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${getStatusDotColor(task.status)}`}
                      title={task.status}
                    />
                    <span className="truncate">{task.title}</span>
                    {/* Tooltip on hover */}
                    <span className="left-1/2 z-10 absolute bg-slate-700 opacity-0 group-hover:opacity-100 mt-6 px-2 py-1 rounded text-white text-xs whitespace-pre-line transition -translate-x-1/2 pointer-events-none">
                      {task.title}
                    </span>
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

export default MonthView;
