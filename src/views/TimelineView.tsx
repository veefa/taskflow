import React from "react";
import type { Task } from "../App";
import { getStatusDotColor, getCategoryBgColor } from "../shared/utils/colors";

const WEEKS = 16;
const DAYS_PER_WEEK = 7;
const DAY_WIDTH = 48;
const TOTAL_DAYS = WEEKS * DAYS_PER_WEEK;

const getWeekDates = (start: string, totalDays: number): string[] => {
  const dates: string[] = [];
  const d = new Date(start);
  for (let i = 0; i < totalDays; i++) {
    dates.push(new Date(d.getTime()).toISOString().split("T")[0]);
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

const getWeekLabel = (index: number) => `W${index + 1}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("default", {
    day: "numeric",
    month: "short",
  });

const TimelineView: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const [groupBy] = React.useState<"status" | "category">("status");

  // Find the earliest startDate among all tasks
  const allDates = tasks
    .flatMap((t) => [t.startDate, t.endDate])
    .filter(Boolean) as string[];
  const timelineStart = allDates.length
    ? allDates.reduce((a, b) => (a < b ? a : b))
    : new Date().toISOString().split("T")[0];

  const timelineDates = getWeekDates(timelineStart, TOTAL_DAYS);

  // Group tasks by status or category
  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const key =
      groupBy === "category" ? task.category ?? "Uncategorized" : task.status;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  // Find today's index for vertical highlight
  const todayIndex = timelineDates.findIndex(
    (date) => new Date(date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="bg-slate-50 p-4 overflow-x-auto">
      <div className="flex flex-col mx-auto w-full max-w-5xl">
        {/* Week Headers */}
        <div className="flex mb-2">
          <div className="w-48" />
          {Array.from({ length: WEEKS }).map((_, i) => (
            <div
              key={i}
              className="font-semibold text-slate-600 text-xs text-center"
              style={{ width: DAY_WIDTH * DAYS_PER_WEEK }}>
              {getWeekLabel(i)}
            </div>
          ))}
        </div>
        <div className="flex">
          {/* Sidebar for task titles */}
          <div className="w-48" />
          {/* Shared timeline wrapper */}
          <div>
            <div
              className="relative mb-3 border-slate-300 border-b text-xs"
              style={{ width: `${timelineDates.length * DAY_WIDTH}px` }}>
              <div className="flex">
                {timelineDates.map((date, i) => (
                  <div
                    key={date}
                    className={`text-center py-1 border-l border-slate-200 ${
                      i === todayIndex
                        ? "bg-yellow-100 font-bold text-yellow-700"
                        : "text-slate-500"
                    }`}
                    style={{ width: DAY_WIDTH }}>
                    {formatDate(date)}
                  </div>
                ))}
              </div>
              {todayIndex !== -1 && (
                <div
                  className="top-0 bottom-0 absolute bg-yellow-400 opacity-60"
                  style={{
                    left: `${todayIndex * DAY_WIDTH}px`,
                    width: "3px",
                    zIndex: 10,
                  }}
                />
              )}
            </div>
            {/* Task Rows */}
            <div
              className="space-y-4 mt-2"
              style={{ width: `${timelineDates.length * DAY_WIDTH}px` }}>
              {Object.entries(grouped).map(([lane, laneTasks]) => (
                <div key={lane}>
                  <div className="space-y-2">
                    {laneTasks.map((task) => {
                      const startIdx = timelineDates.indexOf(task.startDate);
                      const endIdx = timelineDates.indexOf(task.endDate);
                      if (startIdx === -1 || endIdx === -1) return null;
                      const left = startIdx * DAY_WIDTH;
                      const width = (endIdx - startIdx + 1) * DAY_WIDTH;
                      return (
                        <div key={task.id} className="flex items-center h-8">
                          <div
                            className="relative"
                            style={{
                              width: timelineDates.length * DAY_WIDTH,
                              height: 32,
                            }}>
                            <div
                              className={`absolute top-0 h-8 rounded px-2 text-xs text-white flex items-center cursor-pointer ${getCategoryBgColor(
                                task.category
                              )} shadow`}
                              style={{
                                width: `${width}px`,
                                left: `${left}px`,
                                transition: "left 0.3s, width 0.3s",
                              }}
                              title={`${formatDate(
                                task.startDate
                              )} → ${formatDate(task.endDate)}`}>
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${getStatusDotColor(
                                  task.status
                                )} mr-2`}
                                title={task.status}
                              />
                              <span className="truncate">{task.title}</span>
                              {task.startTime && task.endTime && (
                                <span className="opacity-90 ml-2 text-[10px]">
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
              ))}
            </div>
            {/* Empty State */}
            {tasks.length === 0 && (
              <div className="pt-20 text-slate-400 text-center">
                No tasks to display in this view.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
