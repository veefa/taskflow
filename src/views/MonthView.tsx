import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Task } from "../App";
import { getStatusDotColor, getCategoryBgColor } from "../shared/utils/colors";

// Props for MonthView: expects an array of tasks
interface MonthViewProps {
  tasks: Task[];
  selectedDate?: string | null;
  onDateSelect?: (date: string) => void;
}

// Days of the week for the calendar header
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper to get the Tailwind color class for a status dot


// Helper to get the Tailwind color class for a category background


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

const MONTH_KEY = "taskflow_monthView_month";
const YEAR_KEY = "taskflow_monthView_year";

const MonthView: React.FC<MonthViewProps> = ({
  tasks,
  selectedDate,
  onDateSelect,
}) => {
  // Load from localStorage or use today
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(() =>
    localStorage.getItem(MONTH_KEY) !== null
      ? Number(localStorage.getItem(MONTH_KEY))
      : today.getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(() =>
    localStorage.getItem(YEAR_KEY) !== null
      ? Number(localStorage.getItem(YEAR_KEY))
      : today.getFullYear()
  );

  // Persist to localStorage when changed
  useEffect(() => {
    localStorage.setItem(MONTH_KEY, String(currentMonth));
    localStorage.setItem(YEAR_KEY, String(currentYear));
  }, [currentMonth, currentYear]);

  // Get all days for the selected month
  const days = getDaysInMonth(currentYear, currentMonth);

  return (
    <div className="p-4">
      {/* Month navigation and title */}
      <div className="flex justify-between items-center mb-2">
        <button
          className="flex items-center bg-slate-300 hover:bg-slate-400 px-2 py-1 rounded text-slate-700"
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}>
          <FaChevronLeft className="mr-1" />
          <span className="sr-only">Previous Month</span>
        </button>
        <span className="font-semibold text-slate-700">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          className="flex items-center bg-slate-300 hover:bg-slate-400 px-2 py-1 rounded text-slate-700"
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}>
          <FaChevronRight className="ml-1" />
          <span className="sr-only">Next Month</span>
        </button>
      </div>
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
          const dateStr = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD" in local time
          // Filter tasks for this day by endDate
          const dayTasks = tasks.filter((task) => task.endDate === dateStr);
          // Highlight today
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <div
              key={dateStr}
              onClick={() => onDateSelect && onDateSelect(dateStr)}
              className={`cursor-pointer min-h-[70px] rounded p-1 border text-xs relative ${
                isToday
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              } ${selectedDate === dateStr ? "ring-2 ring-blue-400" : ""}`}>
              {/* Day number */}
              <div className="font-bold text-slate-700">{date.getDate()}</div>
              {/* List of tasks for this day */}
              <div className="space-y-1 mt-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group flex items-center gap-1 px-1 py-0.5 rounded text-slate-700 truncate ${getCategoryBgColor(task.category)}`}
                    title={task.title}>
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
